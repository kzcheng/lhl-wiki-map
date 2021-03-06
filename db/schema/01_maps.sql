DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE maps (
  id serial PRIMARY KEY NOT NULL,
  u_id integer REFERENCES users (id) ON DELETE CASCADE,
  title varchar,
  created_at timestamp,
  center_lat double precision,
  center_lng double precision,
  existence boolean DEFAULT TRUE
);

