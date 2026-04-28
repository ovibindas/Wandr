-- Enable PostGIS extension
create extension if not exists postgis;

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read any profile"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── PLACES ──────────────────────────────────────────────────────────────────
create type place_category as enum (
  'restaurant', 'cafe', 'bar', 'hotel', 'attraction', 'shop', 'park', 'museum', 'other'
);

create table if not exists places (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  category     place_category not null default 'other',
  location     geography(point, 4326) not null,
  address      text,
  city         text,
  country      text,
  rating_avg   numeric(3, 2) not null default 0 check (rating_avg between 0 and 5),
  rating_count int not null default 0,
  price_level  smallint not null default 2 check (price_level between 1 and 4),
  is_verified  boolean not null default false,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Spatial index for fast proximity queries
create index if not exists places_location_idx
  on places using gist (location);

-- Supporting indexes
create index if not exists places_category_idx on places (category);
create index if not exists places_rating_idx   on places (rating_avg desc);

alter table places enable row level security;

create policy "Anyone can read places"
  on places for select using (true);

create policy "Authenticated users can insert places"
  on places for insert with check (auth.role() = 'authenticated');

create policy "Owners can update their places"
  on places for update using (auth.uid() = created_by);

-- ─── RATINGS ─────────────────────────────────────────────────────────────────
create table if not exists ratings (
  id         uuid primary key default gen_random_uuid(),
  place_id   uuid not null references places (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  score      smallint not null check (score between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  unique (place_id, user_id)
);

alter table ratings enable row level security;

create policy "Anyone can read ratings"
  on ratings for select using (true);

create policy "Authenticated users can rate places"
  on ratings for insert with check (auth.uid() = user_id and auth.role() = 'authenticated');

-- Maintain rating_avg / rating_count on places whenever a rating is inserted/updated/deleted
create or replace function update_place_rating()
returns trigger language plpgsql security definer as $$
begin
  update places
  set
    rating_avg   = coalesce((select avg(score) from ratings where place_id = coalesce(new.place_id, old.place_id)), 0),
    rating_count = (select count(*) from ratings where place_id = coalesce(new.place_id, old.place_id)),
    updated_at   = now()
  where id = coalesce(new.place_id, old.place_id);
  return coalesce(new, old);
end;
$$;

create trigger on_rating_change
  after insert or update or delete on ratings
  for each row execute procedure update_place_rating();

-- ─── SAVED PLACES ────────────────────────────────────────────────────────────
create table if not exists saved_places (
  user_id    uuid not null references auth.users (id) on delete cascade,
  place_id   uuid not null references places (id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (user_id, place_id)
);

alter table saved_places enable row level security;

create policy "Users can manage their own saved places"
  on saved_places for all using (auth.uid() = user_id);
