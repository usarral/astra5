create table public.information (
  id uuid not null default gen_random_uuid (),
  geojson jsonb not null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint information_pkey primary key (id)
) TABLESPACE pg_default;

INSERT INTO "public"."information" ("id", "geojson", "created_at", "updated_at") VALUES ('50c6428f-1e58-49c6-9635-afaa9c906b83', '{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[-0.407625, 39.292975], [-0.407625, 39.375418], [-0.305073, 39.375418], [-0.305073, 39.292975], [-0.407625, 39.292975]]]}, "properties": {"name": "Albufera", "videoId": "tEqCx3WQU0U", "description": "Albufera", "detection_date": "05/10/2025"}}', '2025-10-05 10:41:59.980705', '2025-10-05 10:41:59.980705');
