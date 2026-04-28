-- Sample seed data (London) — for development only
insert into places (name, description, category, location, address, city, country, rating_avg, rating_count, price_level, is_verified)
values
  ('The Ledbury',       'Two-Michelin-star modern European cuisine.',           'restaurant', st_makepoint(-0.2017, 51.5149), '127 Ledbury Rd',      'London', 'UK', 4.8, 342, 4, true),
  ('Monmouth Coffee',   'Legendary specialty coffee roaster in Borough Market.', 'cafe',       st_makepoint(-0.0905, 51.5055), '2 Park St',           'London', 'UK', 4.7, 891, 2, true),
  ('The Barbican',      'Iconic Brutalist arts centre and concert hall.',        'attraction', st_makepoint(-0.0963, 51.5200), 'Silk St',             'London', 'UK', 4.5, 512, 2, true),
  ('Dishoom Covent Garden','Bombay café with legendary bacon naan rolls.',       'restaurant', st_makepoint(-0.1230, 51.5118), '12 Upper St Martin''s Ln', 'London', 'UK', 4.6, 2341, 2, true),
  ('Hide Bar',          'Rooftop cocktail bar with panoramic city views.',       'bar',        st_makepoint(-0.1439, 51.5069), '85 Piccadilly',       'London', 'UK', 4.4, 178, 3, false),
  ('Victoria and Albert Museum', 'World''s greatest museum of art and design.', 'museum',     st_makepoint(-0.1726, 51.4966), 'Cromwell Rd',         'London', 'UK', 4.8, 3124, 1, true),
  ('Primrose Hill',     'Hilltop park with spectacular London skyline views.',   'park',       st_makepoint(-0.1595, 51.5392), 'Primrose Hill Rd',    'London', 'UK', 4.7, 654, 1, true),
  ('Claridge''s',       'Art Deco luxury hotel and afternoon tea institution.',  'hotel',      st_makepoint(-0.1481, 51.5121), 'Brook St',            'London', 'UK', 4.9, 1023, 4, true)
on conflict do nothing;
