import type { NeonQueryFunction } from '@neondatabase/serverless'

type Sql = NeonQueryFunction<false, false>

async function hasColumn(sql: Sql, table: string, column: string) {
  const rows = await sql`
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ${table}
      AND column_name = ${column}
    LIMIT 1
  `
  return rows.length > 0
}

async function hasTable(sql: Sql, table: string) {
  const rows = await sql`
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = ${table}
    LIMIT 1
  `
  return rows.length > 0
}

/** Detach items from sections and drop gallery_sections. Safe to run repeatedly. */
export async function flattenGallerySchema(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id TEXT PRIMARY KEY,
      drive_url TEXT NOT NULL,
      description TEXT,
      media_type TEXT NOT NULL DEFAULT 'video',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    ALTER TABLE gallery_items
    ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'video'
  `

  if (await hasColumn(sql, 'gallery_items', 'section_id')) {
    await sql`
      ALTER TABLE gallery_items
      DROP CONSTRAINT IF EXISTS gallery_items_section_id_fkey
    `
    if (await hasTable(sql, 'gallery_sections')) {
      await sql`
        WITH ranked AS (
          SELECT
            gi.id,
            ROW_NUMBER() OVER (
              ORDER BY COALESCE(gs.sort_order, 0) ASC, gi.sort_order ASC, gi.id
            ) - 1 AS new_order
          FROM gallery_items gi
          LEFT JOIN gallery_sections gs ON gs.id = gi.section_id
        )
        UPDATE gallery_items gi
        SET sort_order = ranked.new_order
        FROM ranked
        WHERE gi.id = ranked.id
      `
    }
    await sql`ALTER TABLE gallery_items DROP COLUMN IF EXISTS section_id`
  }

  await sql`DROP TABLE IF EXISTS gallery_sections`
  await sql`DROP INDEX IF EXISTS idx_gallery_items_section`
  await sql`
    CREATE INDEX IF NOT EXISTS idx_gallery_items_sort
    ON gallery_items (sort_order)
  `
}
