import type { NeonQueryFunction } from '@neondatabase/serverless'

type Sql = NeonQueryFunction<false, false>

export async function ensureCultureImagesSchema(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS culture_images (
      id TEXT PRIMARY KEY,
      drive_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_culture_images_sort
      ON culture_images(sort_order)
  `
}
