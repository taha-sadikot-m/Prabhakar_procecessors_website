-- Prabhakar Processors CMS schema (Neon Postgres)

CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  numeral TEXT NOT NULL DEFAULT '',
  intro TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_cards (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_cards_category
  ON service_cards(category_id, sort_order);

CREATE TABLE IF NOT EXISTS gallery_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES gallery_sections(id) ON DELETE CASCADE,
  drive_url TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_section
  ON gallery_items(section_id, sort_order);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  partner_type TEXT NOT NULL,
  years INT NOT NULL DEFAULT 0,
  quote TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  published_at DATE NOT NULL,
  read_minutes INT NOT NULL DEFAULT 5,
  category TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  cover_alt TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta JSONB,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published
  ON blog_posts(published, published_at DESC);
