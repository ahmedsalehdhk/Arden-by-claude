-- Arden backend — initial schema.

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  name            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Projects ─────────────────────────────────────────────────────────

CREATE TYPE project_type_e   AS ENUM ('residential', 'commercial');
CREATE TYPE project_status_e AS ENUM ('ongoing', 'upcoming', 'completed');

CREATE TABLE projects (
  id                   SERIAL PRIMARY KEY,
  slug                 TEXT UNIQUE NOT NULL,
  name                 TEXT NOT NULL,
  tagline              TEXT NOT NULL DEFAULT '',
  type                 project_type_e   NOT NULL DEFAULT 'residential',
  status               project_status_e NOT NULL DEFAULT 'ongoing',
  address              TEXT NOT NULL DEFAULT '',
  location             TEXT NOT NULL DEFAULT '',
  hero_image           TEXT NOT NULL DEFAULT '',
  building_image       TEXT NOT NULL DEFAULT '',
  map_embed_src        TEXT,
  by_alliance_arden    BOOLEAN NOT NULL DEFAULT FALSE,
  by_trilliant_arden   BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured          BOOLEAN NOT NULL DEFAULT FALSE,
  featured_order       INTEGER NOT NULL DEFAULT 0,
  is_published         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX projects_is_featured_idx  ON projects (is_featured, featured_order);
CREATE INDEX projects_is_published_idx ON projects (is_published);

CREATE TABLE project_specs (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX project_specs_project_idx ON project_specs (project_id, sort_order);

CREATE TABLE project_features (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  icon        TEXT NOT NULL,   -- lucide icon name
  label       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX project_features_project_idx ON project_features (project_id, sort_order);

CREATE TABLE project_gallery (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX project_gallery_project_idx ON project_gallery (project_id, sort_order);

CREATE TYPE floor_kind_e AS ENUM ('basement', 'ground', 'mezzanine', 'typical', 'roof');

CREATE TABLE project_floor_plans (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  full_label  TEXT NOT NULL,
  image       TEXT NOT NULL,
  kind        floor_kind_e,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX project_floor_plans_project_idx ON project_floor_plans (project_id, sort_order);

CREATE TABLE project_neighborhood (
  project_id  INTEGER PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  image_1     TEXT,
  image_2     TEXT,
  body_md     TEXT NOT NULL DEFAULT ''
);

CREATE TABLE project_architect (
  project_id  INTEGER PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  image       TEXT,
  quote       TEXT NOT NULL DEFAULT ''
);

-- ── News & events ────────────────────────────────────────────────────

CREATE TYPE news_category_e AS ENUM ('news', 'event');

CREATE TABLE news_posts (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL DEFAULT '',
  body_md         TEXT NOT NULL DEFAULT '',
  category        news_category_e NOT NULL DEFAULT 'news',
  published_at    TIMESTAMPTZ,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX news_posts_is_published_idx ON news_posts (is_published, published_at DESC);

CREATE TABLE news_images (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  caption     TEXT,
  is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX news_images_post_idx ON news_images (post_id, sort_order);
-- Enforce at most one cover per post.
CREATE UNIQUE INDEX news_images_one_cover_per_post
  ON news_images (post_id) WHERE is_cover;

-- ── Career job postings ─────────────────────────────────────────────

CREATE TYPE job_type_e AS ENUM ('full-time', 'part-time', 'contract', 'internship');

CREATE TABLE job_postings (
  id                SERIAL PRIMARY KEY,
  slug              TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  department        TEXT NOT NULL DEFAULT '',
  location          TEXT NOT NULL DEFAULT '',
  type              job_type_e NOT NULL DEFAULT 'full-time',
  summary           TEXT NOT NULL DEFAULT '',
  description_md    TEXT NOT NULL DEFAULT '',
  is_open           BOOLEAN NOT NULL DEFAULT TRUE,
  posted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX job_postings_is_open_idx ON job_postings (is_open, posted_at DESC);

-- ── Team ─────────────────────────────────────────────────────────────

CREATE TABLE team_members (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT '',
  quote         TEXT NOT NULL DEFAULT '',
  image         TEXT,
  bio_md        TEXT NOT NULL DEFAULT '',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX team_members_order_idx ON team_members (is_published, sort_order);

-- ── Inbound ─────────────────────────────────────────────────────────

CREATE TABLE contact_submissions (
  id            SERIAL PRIMARY KEY,
  active_form   TEXT,
  name          TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  message       TEXT NOT NULL DEFAULT '',
  extra_json    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived   BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX contact_submissions_inbox_idx
  ON contact_submissions (is_archived, is_read, created_at DESC);

CREATE TABLE floorplan_leads (
  id            SERIAL PRIMARY KEY,
  project_id    INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  project_slug  TEXT NOT NULL,
  name          TEXT NOT NULL,
  -- 11-digit local format with leading 0, e.g. "01712345678"
  phone         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived   BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (project_slug, phone)
);
CREATE INDEX floorplan_leads_inbox_idx
  ON floorplan_leads (is_archived, is_read, created_at DESC);
CREATE INDEX floorplan_leads_project_idx
  ON floorplan_leads (project_slug, created_at DESC);
