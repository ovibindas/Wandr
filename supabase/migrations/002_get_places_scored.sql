-- GET /places scoring formula
--
-- Score = (rating_avg / 5) * 40          -- up to 40 pts for quality
--       + log10(rating_count + 1) * 20   -- up to ~20 pts for popularity (log-scaled)
--       + (1 - distance_km / radius_km) * 30  -- up to 30 pts for proximity
--       + (is_verified::int) * 10         -- 10 pts bonus for verified places
--
-- Total max ≈ 100 pts

create or replace function get_places_scored(
  p_latitude  float8,
  p_longitude float8,
  p_radius_km float8  default 10,
  p_category  text    default null,
  p_limit     int     default 20,
  p_offset    int     default 0
)
returns table (
  id            uuid,
  name          text,
  description   text,
  category      place_category,
  latitude      float8,
  longitude     float8,
  address       text,
  city          text,
  country       text,
  rating_avg    numeric,
  rating_count  int,
  price_level   smallint,
  is_verified   boolean,
  created_by    uuid,
  created_at    timestamptz,
  updated_at    timestamptz,
  distance_km   float8,
  score         float8
)
language sql stable security definer as $$
  select
    p.id,
    p.name,
    p.description,
    p.category,
    st_y(p.location::geometry)  as latitude,
    st_x(p.location::geometry)  as longitude,
    p.address,
    p.city,
    p.country,
    p.rating_avg,
    p.rating_count,
    p.price_level,
    p.is_verified,
    p.created_by,
    p.created_at,
    p.updated_at,
    round(
      (st_distance(
        p.location,
        st_makepoint(p_longitude, p_latitude)::geography
      ) / 1000.0)::numeric,
      3
    )::float8                                                       as distance_km,
    round((
      -- Quality: 0-40 pts
      (p.rating_avg / 5.0) * 40.0
      -- Popularity: 0-~20 pts (log-scaled so 1 rating ≠ 0)
      + log(p.rating_count::numeric + 1) * 20.0
      -- Proximity: 0-30 pts (linear decay, 0 at edge of radius)
      + greatest(0,
          (1.0 - (
            st_distance(
              p.location,
              st_makepoint(p_longitude, p_latitude)::geography
            ) / 1000.0
          ) / p_radius_km)
        ) * 30.0
      -- Verified bonus: 10 pts
      + (p.is_verified::int) * 10.0
    )::numeric, 2)::float8                                          as score
  from places p
  where
    st_dwithin(
      p.location,
      st_makepoint(p_longitude, p_latitude)::geography,
      p_radius_km * 1000.0   -- convert km → metres
    )
    and (p_category is null or p.category = p_category::place_category)
  order by score desc
  limit  p_limit
  offset p_offset;
$$;

-- Grant execute to anon and authenticated roles so the client can call it
grant execute on function get_places_scored to anon, authenticated;
