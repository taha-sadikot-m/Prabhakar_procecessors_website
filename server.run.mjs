// scripts/prod-server.mjs
import http from "node:http";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";

// api/_lib/http.ts
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}
function handleOptions(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}
function json(res, status, body) {
  setCors(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
function readJsonBody(req) {
  const body = req.body;
  if (body == null || body === "") return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}
function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// api/_lib/routes/health.ts
async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }
  return json(res, 200, { ok: true });
}

// api/_lib/db.ts
import { neon } from "@neondatabase/serverless";
var sql = null;
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!sql) {
    sql = neon(url);
  }
  return sql;
}

// api/_lib/routes/services.ts
async function handler2(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const sql2 = getDb();
    const categories = await sql2`
      SELECT id, title, numeral, intro, sort_order
      FROM service_categories
      ORDER BY sort_order ASC, title ASC
    `;
    const cards = await sql2`
      SELECT id, category_id, name, description, image_url, sort_order
      FROM service_cards
      ORDER BY sort_order ASC, name ASC
    `;
    const result = categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      numeral: cat.numeral,
      intro: cat.intro,
      services: cards.filter((c) => c.category_id === cat.id).map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        image: c.image_url
      }))
    }));
    return json(res, 200, { categories: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load services";
    return json(res, 500, { error: message });
  }
}

// api/_lib/drive.ts
function parseDriveFileId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (!host.includes("google.com") && !host.includes("drive.google")) {
      return null;
    }
    const fileMatch = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (fileMatch?.[1]) return fileMatch[1];
    const openMatch = u.pathname.match(/\/open/);
    if (openMatch) {
      const id = u.searchParams.get("id");
      if (id) return id;
    }
    const idParam = u.searchParams.get("id");
    if (idParam) return idParam;
    const uc = u.pathname.match(/\/uc/);
    if (uc) {
      const id = u.searchParams.get("id");
      if (id) return id;
    }
  } catch {
    return null;
  }
  return null;
}
function drivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
function driveVideoUrl(fileId) {
  return `/api/drive-media?id=${encodeURIComponent(fileId)}`;
}
function isLocalMp4(url) {
  return /^\/.+\.mp4(?:$|\?)/i.test(url.trim());
}
function resolveDriveUrls(driveUrl) {
  const trimmed = (driveUrl || "").trim();
  if (isLocalMp4(trimmed)) {
    const poster = trimmed.replace(/\.mp4(?:$|\?)/i, ".jpg");
    return {
      fileId: null,
      previewUrl: trimmed,
      viewUrl: trimmed,
      thumbUrl: poster,
      videoUrl: trimmed
    };
  }
  const id = parseDriveFileId(trimmed);
  if (!id) {
    return {
      fileId: null,
      previewUrl: trimmed,
      viewUrl: trimmed,
      thumbUrl: trimmed,
      videoUrl: null
    };
  }
  return {
    fileId: id,
    previewUrl: drivePreviewUrl(id),
    viewUrl: driveVideoUrl(id),
    thumbUrl: `${driveVideoUrl(id)}&thumb=1`,
    videoUrl: driveVideoUrl(id)
  };
}
function isValidDriveFileId(id) {
  return /^[a-zA-Z0-9_-]{10,128}$/.test(id);
}
function cookieHeaderFrom(res) {
  const anyHeaders = res.headers;
  const setCookies = typeof anyHeaders.getSetCookie === "function" ? anyHeaders.getSetCookie() : [];
  if (!setCookies.length) {
    const single = res.headers.get("set-cookie");
    if (!single) return void 0;
    return single.split(";")[0];
  }
  return setCookies.map((c) => c.split(";")[0]).join("; ");
}
function parseConfirmToken(html) {
  const patterns = [
    /confirm=([0-9A-Za-z_-]+)/,
    /name="confirm"\s+value="([^"]+)"/,
    /"confirm"\s*,\s*"([^"]+)"/
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1] && m[1] !== "t") return m[1];
  }
  return "t";
}
async function fetchDriveDownload(fileId, rangeHeader, confirm, cookie) {
  const url = new URL("https://drive.usercontent.google.com/download");
  url.searchParams.set("id", fileId);
  url.searchParams.set("export", "download");
  url.searchParams.set("confirm", confirm || "t");
  const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; PrabhakarProcessorsGallery/1.0)"
  };
  if (rangeHeader) headers.Range = rangeHeader;
  if (cookie) headers.Cookie = cookie;
  return fetch(url.toString(), {
    headers,
    redirect: "follow"
  });
}
async function fetchDriveMediaStream(fileId, rangeHeader) {
  let res = await fetchDriveDownload(fileId, rangeHeader);
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const html = await res.text();
    const confirm = parseConfirmToken(html);
    const cookie = cookieHeaderFrom(res);
    res = await fetchDriveDownload(
      fileId,
      rangeHeader,
      confirm || "t",
      cookie
    );
  }
  const nextType = res.headers.get("content-type") || "";
  if (!res.ok || nextType.includes("text/html")) {
    throw new Error(
      res.ok ? "Drive returned HTML instead of media (file may not be public)" : `Drive download failed (${res.status})`
    );
  }
  return res;
}
var THUMB_UA = "Mozilla/5.0 (compatible; PrabhakarProcessorsGallery/1.0)";
async function fetchImageUrl(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": THUMB_UA },
    redirect: "follow"
  });
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || contentType.includes("text/html")) return null;
  if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
    return null;
  }
  return res;
}
async function fetchDriveThumbnailStream(fileId) {
  const id = encodeURIComponent(fileId);
  const candidates = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w400`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1280`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    `https://lh3.googleusercontent.com/d/${id}=w400`,
    `https://lh3.googleusercontent.com/d/${id}=w1600`
  ];
  for (const url of candidates) {
    const image = await fetchImageUrl(url);
    if (image) return image;
  }
  throw new Error("Drive thumbnail unavailable (file may not be public)");
}

// api/_lib/gallery-schema.ts
async function hasColumn(sql2, table, column) {
  const rows = await sql2`
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ${table}
      AND column_name = ${column}
    LIMIT 1
  `;
  return rows.length > 0;
}
async function hasTable(sql2, table) {
  const rows = await sql2`
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = ${table}
    LIMIT 1
  `;
  return rows.length > 0;
}
async function flattenGallerySchema(sql2) {
  await sql2`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id TEXT PRIMARY KEY,
      drive_url TEXT NOT NULL,
      description TEXT,
      media_type TEXT NOT NULL DEFAULT 'video',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql2`
    ALTER TABLE gallery_items
    ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'video'
  `;
  if (await hasColumn(sql2, "gallery_items", "section_id")) {
    await sql2`
      ALTER TABLE gallery_items
      DROP CONSTRAINT IF EXISTS gallery_items_section_id_fkey
    `;
    if (await hasTable(sql2, "gallery_sections")) {
      await sql2`
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
      `;
    }
    await sql2`ALTER TABLE gallery_items DROP COLUMN IF EXISTS section_id`;
  }
  await sql2`DROP TABLE IF EXISTS gallery_sections`;
  await sql2`DROP INDEX IF EXISTS idx_gallery_items_section`;
  await sql2`
    CREATE INDEX IF NOT EXISTS idx_gallery_items_sort
    ON gallery_items (sort_order)
  `;
}

// api/_lib/routes/gallery.ts
async function handler3(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const sql2 = getDb();
    await flattenGallerySchema(sql2);
    const items = await sql2`
      SELECT id, drive_url, description, media_type, sort_order
      FROM gallery_items
      ORDER BY sort_order ASC, id ASC
    `;
    return json(res, 200, {
      items: items.map((item) => {
        const driveUrl = item.drive_url;
        const resolved = resolveDriveUrls(driveUrl);
        const mediaType = item.media_type === "image" ? "image" : "video";
        return {
          id: item.id,
          driveUrl,
          description: item.description ?? null,
          mediaType,
          previewUrl: resolved.previewUrl,
          viewUrl: resolved.viewUrl,
          thumbUrl: resolved.thumbUrl,
          fileId: resolved.fileId,
          videoUrl: mediaType === "video" ? resolved.videoUrl : null
        };
      })
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load gallery";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/drive-media.ts
import { Readable } from "node:stream";
function queryId(req) {
  const raw = req.query.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || typeof id !== "string") return null;
  return id;
}
function queryFlag(req, key) {
  const raw = req.query[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "1" || value === "true";
}
async function handler4(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET" && req.method !== "HEAD") {
    return json(res, 405, { error: "Method not allowed" });
  }
  const fileId = queryId(req);
  if (!fileId || !isValidDriveFileId(fileId)) {
    return json(res, 400, { error: "Invalid or missing Drive file id" });
  }
  try {
    const wantThumb = queryFlag(req, "thumb");
    const rangeHeader = typeof req.headers.range === "string" ? req.headers.range : void 0;
    const upstream = wantThumb ? await fetchDriveThumbnailStream(fileId) : await fetchDriveMediaStream(fileId, rangeHeader);
    setCors(res);
    res.statusCode = upstream.status === 206 ? 206 : 200;
    const contentType = upstream.headers.get("content-type") || (wantThumb ? "image/jpeg" : "video/mp4");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Accept-Ranges", "bytes");
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) res.setHeader("Content-Length", contentLength);
    const contentRange = upstream.headers.get("content-range");
    if (contentRange) res.setHeader("Content-Range", contentRange);
    if (req.method === "HEAD" || !upstream.body) {
      res.end();
      return;
    }
    const nodeStream = Readable.fromWeb(
      upstream.body
    );
    nodeStream.on("error", () => {
      if (!res.headersSent) {
        res.statusCode = 502;
      }
      res.end();
    });
    nodeStream.pipe(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load Drive media";
    return json(res, 502, { error: message });
  }
}

// api/_lib/routes/testimonials.ts
async function handler5(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const sql2 = getDb();
    const rows = await sql2`
      SELECT id, partner_type, years, quote, sort_order
      FROM testimonials
      ORDER BY sort_order ASC, years DESC
    `;
    return json(res, 200, {
      quotes: rows.map((row) => ({
        id: row.id,
        type: row.partner_type,
        years: Number(row.years),
        quote: row.quote
      }))
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load testimonials";
    return json(res, 500, { error: message });
  }
}

// api/_lib/blog.ts
function asTheme(value) {
  if (value === "accent" || value === "outline" || value === "light") {
    return value;
  }
  return void 0;
}
function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}
function asSections(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (!item || typeof item !== "object") return null;
    const row = item;
    const heading = typeof row.heading === "string" ? row.heading.trim() : "";
    const paragraphs = asStringArray(row.paragraphs).map((p) => p.trim()).filter(Boolean);
    if (!heading || paragraphs.length === 0) return null;
    return { heading, paragraphs };
  }).filter((s) => s != null);
}
function asCta(value) {
  if (!value || typeof value !== "object") return void 0;
  const row = value;
  const headline = typeof row.headline === "string" ? row.headline.trim() : "";
  const body = typeof row.body === "string" ? row.body.trim() : "";
  const primaryLabel = typeof row.primaryLabel === "string" ? row.primaryLabel.trim() : "";
  const primaryHref = typeof row.primaryHref === "string" ? row.primaryHref.trim() : "";
  if (!headline || !body || !primaryLabel || !primaryHref) return void 0;
  const cta = { headline, body, primaryLabel, primaryHref };
  const primaryTheme = asTheme(row.primaryTheme);
  if (primaryTheme) cta.primaryTheme = primaryTheme;
  if (typeof row.secondaryLabel === "string" && row.secondaryLabel.trim()) {
    cta.secondaryLabel = row.secondaryLabel.trim();
  }
  if (typeof row.secondaryHref === "string" && row.secondaryHref.trim()) {
    cta.secondaryHref = row.secondaryHref.trim();
  }
  const secondaryTheme = asTheme(row.secondaryTheme);
  if (secondaryTheme) cta.secondaryTheme = secondaryTheme;
  return cta;
}
function dateOnly(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function mapBlogRow(row) {
  const keywords = typeof row.keywords === "string" ? asStringArray(JSON.parse(row.keywords)) : asStringArray(row.keywords);
  const sections = typeof row.sections === "string" ? asSections(JSON.parse(row.sections)) : asSections(row.sections);
  const cta = typeof row.cta === "string" ? asCta(JSON.parse(row.cta)) : asCta(row.cta);
  const updatedAt = row.updated_at ? dateOnly(row.updated_at) : void 0;
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    date: dateOnly(row.published_at),
    updatedAt,
    readMinutes: Number(row.read_minutes) || 5,
    category: String(row.category ?? ""),
    coverImage: String(row.cover_image ?? ""),
    coverAlt: String(row.cover_alt ?? ""),
    seoTitle: String(row.seo_title ?? ""),
    seoDescription: String(row.seo_description ?? ""),
    keywords,
    sections,
    cta,
    published: Boolean(row.published),
    sortOrder: Number(row.sort_order) || 0
  };
}
function toPublicBlogPost(post) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    updatedAt: post.updatedAt,
    readMinutes: post.readMinutes,
    category: post.category,
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    keywords: post.keywords,
    sections: post.sections,
    cta: post.cta
  };
}
function slugifyTitle(title) {
  return title.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

// api/_lib/routes/blog.ts
async function handler6(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const sql2 = getDb();
    const slug = typeof req.query.slug === "string" ? req.query.slug.trim() : "";
    if (slug) {
      const rows2 = await sql2`
        SELECT *
        FROM blog_posts
        WHERE slug = ${slug} AND published = TRUE
        LIMIT 1
      `;
      if (!rows2.length) {
        return json(res, 404, { error: "Post not found" });
      }
      return json(res, 200, {
        post: toPublicBlogPost(mapBlogRow(rows2[0]))
      });
    }
    const rows = await sql2`
      SELECT *
      FROM blog_posts
      WHERE published = TRUE
      ORDER BY published_at DESC, sort_order ASC, title ASC
    `;
    return json(res, 200, {
      posts: rows.map(
        (row) => toPublicBlogPost(mapBlogRow(row))
      )
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load blog";
    return json(res, 500, { error: message });
  }
}

// api/_lib/email.ts
import { Resend } from "resend";
function parseList(value, fallback) {
  if (!value?.trim()) return fallback;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}
function contactNotifyTo() {
  return parseList(process.env.CONTACT_NOTIFY_TO, [
    "shaleen@prabhakarprocessors.com"
  ]);
}
function contactNotifyCc() {
  return parseList(process.env.CONTACT_NOTIFY_CC, [
    "info@prabhakarprocessors.com"
  ]);
}
function careersNotifyTo() {
  return parseList(process.env.CAREERS_NOTIFY_TO, [
    "prabhakarhr64@gmail.com"
  ]);
}
async function sendMail(input) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_EMAIL_ADDRESS?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!from) {
    throw new Error("RESEND_EMAIL_ADDRESS is not set");
  }
  const to = Array.isArray(input.to) ? input.to : [input.to];
  if (to.length === 0) {
    throw new Error("No email recipients");
  }
  const ccRaw = input.cc ? Array.isArray(input.cc) ? input.cc : [input.cc] : [];
  const cc = ccRaw.filter(Boolean);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: input.subject,
    text: input.text,
    ...cc.length > 0 ? { cc } : {},
    ...input.replyTo ? { replyTo: input.replyTo } : {}
  });
  if (error) {
    throw new Error(error.message || "Resend send failed");
  }
}
async function notifyOrLog(label, input) {
  try {
    await sendMail(input);
  } catch (err) {
    console.error(
      `[email] ${label} failed:`,
      err instanceof Error ? err.message : err
    );
  }
}

// api/_lib/routes/contact.ts
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function ensureTable() {
  const sql2 = getDb();
  await sql2`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
async function handler7(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const body = readJsonBody(req);
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const phone = (body.phone ?? "").trim();
    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();
    if (!name || name.length > 120) {
      return json(res, 400, { error: "Please enter your name." });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 200) {
      return json(res, 400, { error: "Please enter a valid email address." });
    }
    if (phone.length > 40) {
      return json(res, 400, { error: "Phone number is too long." });
    }
    if (!subject || subject.length > 200) {
      return json(res, 400, { error: "Please enter a subject." });
    }
    if (!message || message.length > 5e3) {
      return json(res, 400, { error: "Please enter a message." });
    }
    await ensureTable();
    const sql2 = getDb();
    const id = newId("msg");
    await sql2`
      INSERT INTO contact_messages (id, name, email, phone, subject, message)
      VALUES (${id}, ${name}, ${email}, ${phone}, ${subject}, ${message})
    `;
    await notifyOrLog("contact", {
      to: contactNotifyTo(),
      cc: contactNotifyCc(),
      subject: `New contact form: ${subject}`,
      replyTo: email,
      text: [
        "A new contact form was submitted on the website.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "(none)"}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
        "",
        `Message ID: ${id}`
      ].join("\n")
    });
    return json(res, 200, { ok: true, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send your message";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/careers.ts
var EMAIL_RE2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
async function ensureTable2() {
  const sql2 = getDb();
  await sql2`
    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      department TEXT NOT NULL,
      city TEXT NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      qualification TEXT NOT NULL,
      experience TEXT NOT NULL,
      current_company TEXT NOT NULL DEFAULT '',
      expected_salary TEXT NOT NULL DEFAULT '',
      resume_url TEXT NOT NULL,
      remarks TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
async function handler8(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const body = readJsonBody(req);
    const department = (body.department ?? "").trim();
    const city = (body.city ?? "").trim();
    const fullName = (body.fullName ?? "").trim();
    const mobile = (body.mobile ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const qualification = (body.qualification ?? "").trim();
    const experience = (body.experience ?? "").trim();
    const currentCompany = (body.currentCompany ?? "").trim();
    const expectedSalary = (body.expectedSalary ?? "").trim();
    const resumeUrl = (body.resumeUrl ?? "").trim();
    const remarks = (body.remarks ?? "").trim();
    if (!department || department.length > 200) {
      return json(res, 400, { error: "Please select a department." });
    }
    if (!city || city.length > 120) {
      return json(res, 400, { error: "Please enter your current city." });
    }
    if (!fullName || fullName.length > 120) {
      return json(res, 400, { error: "Please enter your full name." });
    }
    if (!mobile || mobile.length > 40) {
      return json(res, 400, { error: "Please enter a valid mobile number." });
    }
    if (!email || !EMAIL_RE2.test(email) || email.length > 200) {
      return json(res, 400, { error: "Please enter a valid email address." });
    }
    if (!qualification || qualification.length > 200) {
      return json(res, 400, { error: "Please enter your qualification." });
    }
    if (!experience || experience.length > 200) {
      return json(res, 400, { error: "Please enter your work experience." });
    }
    if (currentCompany.length > 200) {
      return json(res, 400, { error: "Current company is too long." });
    }
    if (expectedSalary.length > 120) {
      return json(res, 400, { error: "Expected salary is too long." });
    }
    if (!resumeUrl || !isHttpUrl(resumeUrl) || resumeUrl.length > 2e3) {
      return json(res, 400, {
        error: "Please paste a valid resume link (https://\u2026)."
      });
    }
    if (remarks.length > 5e3) {
      return json(res, 400, { error: "Remarks are too long." });
    }
    await ensureTable2();
    const sql2 = getDb();
    const id = newId("app");
    await sql2`
      INSERT INTO job_applications (
        id,
        department,
        city,
        full_name,
        mobile,
        email,
        qualification,
        experience,
        current_company,
        expected_salary,
        resume_url,
        remarks
      )
      VALUES (
        ${id},
        ${department},
        ${city},
        ${fullName},
        ${mobile},
        ${email},
        ${qualification},
        ${experience},
        ${currentCompany},
        ${expectedSalary},
        ${resumeUrl},
        ${remarks}
      )
    `;
    await notifyOrLog("careers", {
      to: careersNotifyTo(),
      subject: `New job application: ${department} \u2014 ${fullName}`,
      replyTo: email,
      text: [
        "A new job application was submitted on the website.",
        "",
        `Department: ${department}`,
        `City: ${city}`,
        `Full name: ${fullName}`,
        `Mobile: ${mobile}`,
        `Email: ${email}`,
        `Qualification: ${qualification}`,
        `Experience: ${experience}`,
        `Current company: ${currentCompany || "(none)"}`,
        `Expected salary: ${expectedSalary || "(none)"}`,
        `Resume: ${resumeUrl}`,
        "",
        "Remarks:",
        remarks || "(none)",
        "",
        `Application ID: ${id}`
      ].join("\n")
    });
    return json(res, 200, { ok: true, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit application";
    return json(res, 500, { error: message });
  }
}

// api/_lib/culture-schema.ts
async function ensureCultureImagesSchema(sql2) {
  await sql2`
    CREATE TABLE IF NOT EXISTS culture_images (
      id TEXT PRIMARY KEY,
      drive_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql2`
    CREATE INDEX IF NOT EXISTS idx_culture_images_sort
      ON culture_images(sort_order)
  `;
}

// api/_lib/routes/culture.ts
async function handler9(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const sql2 = getDb();
    await ensureCultureImagesSchema(sql2);
    const items = await sql2`
      SELECT id, drive_url, caption, sort_order
      FROM culture_images
      ORDER BY sort_order ASC, id ASC
    `;
    return json(res, 200, {
      items: items.map((item) => {
        const driveUrl = item.drive_url;
        const resolved = resolveDriveUrls(driveUrl);
        return {
          id: item.id,
          driveUrl,
          caption: item.caption || "",
          sortOrder: item.sort_order,
          previewUrl: resolved.previewUrl,
          viewUrl: resolved.viewUrl,
          thumbUrl: resolved.thumbUrl,
          fileId: resolved.fileId
        };
      })
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load culture images";
    return json(res, 500, { error: message });
  }
}

// api/_lib/auth.ts
import { createHmac, timingSafeEqual } from "node:crypto";
var TOKEN_TTL_SEC = 12 * 60 * 60;
function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}
function base64UrlEncode(input) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlDecode(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - padded.length % 4) % 4;
  return Buffer.from(padded + "=".repeat(padLen), "base64");
}
function signHs256(data, secret) {
  return createHmac("sha256", secret).update(data).digest();
}
async function signAdminToken() {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1e3);
  const payload = base64UrlEncode(
    JSON.stringify({
      role: "admin",
      iat: now,
      exp: now + TOKEN_TTL_SEC
    })
  );
  const data = `${header}.${payload}`;
  const signature = base64UrlEncode(signHs256(data, secretKey()));
  return `${data}.${signature}`;
}
async function verifyAdminToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, signatureB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const expected = signHs256(data, secretKey());
  const actual = base64UrlDecode(signatureB64);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
    if (payload.role !== "admin") return false;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1e3)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
function readBearer(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== "string") return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}
async function requireAdmin(req) {
  const token = readBearer(req);
  if (!token) return false;
  try {
    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}
function checkStaticCredentials(username, password) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    throw new Error("ADMIN_USERNAME / ADMIN_PASSWORD are not configured");
  }
  return username === expectedUser && password === expectedPass;
}

// api/_lib/routes/admin/login.ts
async function handler10(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }
  try {
    const body = readJsonBody(req);
    const username = (body.username ?? "").trim();
    const password = body.password ?? "";
    if (!username || !password) {
      return json(res, 400, { error: "Username and password required" });
    }
    if (!checkStaticCredentials(username, password)) {
      return json(res, 401, { error: "Invalid credentials" });
    }
    const token = await signAdminToken();
    return json(res, 200, { token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/services.ts
async function handler11(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  const sql2 = getDb();
  const action = typeof req.query.action === "string" ? req.query.action : "";
  try {
    if (req.method === "GET") {
      const categories = await sql2`
        SELECT id, title, numeral, intro, sort_order
        FROM service_categories
        ORDER BY sort_order ASC, title ASC
      `;
      const cards = await sql2`
        SELECT id, category_id, name, description, image_url, sort_order
        FROM service_cards
        ORDER BY sort_order ASC, name ASC
      `;
      return json(res, 200, {
        categories: categories.map((cat) => ({
          id: cat.id,
          title: cat.title,
          numeral: cat.numeral,
          intro: cat.intro,
          sortOrder: cat.sort_order,
          services: cards.filter((c) => c.category_id === cat.id).map((c) => ({
            id: c.id,
            categoryId: c.category_id,
            name: c.name,
            description: c.description,
            imageUrl: c.image_url,
            sortOrder: c.sort_order
          }))
        }))
      });
    }
    if (req.method === "POST" && action === "category") {
      const body = readJsonBody(req);
      const id = (body.id ?? newId("cat")).trim();
      const title = (body.title ?? "").trim();
      if (!title) return json(res, 400, { error: "Title required" });
      await sql2`
        INSERT INTO service_categories (id, title, numeral, intro, sort_order)
        VALUES (
          ${id},
          ${title},
          ${(body.numeral ?? "").trim()},
          ${(body.intro ?? "").trim()},
          ${body.sortOrder ?? 0}
        )
      `;
      return json(res, 201, { id });
    }
    if (req.method === "PUT" && action === "category") {
      const body = readJsonBody(req);
      if (!body.id) return json(res, 400, { error: "id required" });
      await sql2`
        UPDATE service_categories
        SET
          title = ${(body.title ?? "").trim()},
          numeral = ${(body.numeral ?? "").trim()},
          intro = ${(body.intro ?? "").trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `;
      return json(res, 200, { ok: true });
    }
    if (req.method === "DELETE" && action === "category") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM service_categories WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    if (req.method === "POST" && action === "card") {
      const body = readJsonBody(req);
      if (!body.categoryId) return json(res, 400, { error: "categoryId required" });
      const name = (body.name ?? "").trim();
      if (!name) return json(res, 400, { error: "name required" });
      const id = (body.id ?? newId("svc")).trim();
      await sql2`
        INSERT INTO service_cards (id, category_id, name, description, image_url, sort_order)
        VALUES (
          ${id},
          ${body.categoryId},
          ${name},
          ${(body.description ?? "").trim()},
          ${(body.imageUrl ?? "").trim()},
          ${body.sortOrder ?? 0}
        )
      `;
      return json(res, 201, { id });
    }
    if (req.method === "PUT" && action === "card") {
      const body = readJsonBody(req);
      if (!body.id) return json(res, 400, { error: "id required" });
      await sql2`
        UPDATE service_cards
        SET
          category_id = ${body.categoryId ?? ""},
          name = ${(body.name ?? "").trim()},
          description = ${(body.description ?? "").trim()},
          image_url = ${(body.imageUrl ?? "").trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `;
      return json(res, 200, { ok: true });
    }
    if (req.method === "DELETE" && action === "card") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM service_cards WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 400, { error: "Unknown action" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Services admin error";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/gallery.ts
function parseMediaType(value) {
  if (value === "image" || value === "video") return value;
  return null;
}
async function handler12(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  const sql2 = getDb();
  const action = typeof req.query.action === "string" ? req.query.action : "";
  try {
    await flattenGallerySchema(sql2);
    if (req.method === "GET") {
      const items = await sql2`
        SELECT id, drive_url, description, media_type, sort_order
        FROM gallery_items
        ORDER BY sort_order ASC, id ASC
      `;
      return json(res, 200, {
        items: items.map((i) => ({
          id: i.id,
          driveUrl: i.drive_url,
          description: i.description,
          mediaType: i.media_type === "image" ? "image" : "video",
          sortOrder: i.sort_order
        }))
      });
    }
    if (req.method === "POST" && action === "item") {
      const body = readJsonBody(req);
      const driveUrl = (body.driveUrl ?? "").trim();
      if (!driveUrl) return json(res, 400, { error: "driveUrl required" });
      const mediaType = parseMediaType(body.mediaType);
      if (!mediaType) {
        return json(res, 400, { error: "mediaType required (image or video)" });
      }
      const id = (body.id ?? newId("gitem")).trim();
      await sql2`
        INSERT INTO gallery_items (id, drive_url, description, media_type, sort_order)
        VALUES (
          ${id},
          ${driveUrl},
          ${body.description?.trim() || null},
          ${mediaType},
          ${body.sortOrder ?? 0}
        )
      `;
      return json(res, 201, { id });
    }
    if (req.method === "PUT" && action === "item") {
      const body = readJsonBody(req);
      if (!body.id) return json(res, 400, { error: "id required" });
      const mediaType = parseMediaType(body.mediaType);
      if (!mediaType) {
        return json(res, 400, { error: "mediaType required (image or video)" });
      }
      await sql2`
        UPDATE gallery_items
        SET
          drive_url = ${(body.driveUrl ?? "").trim()},
          description = ${body.description?.trim() || null},
          media_type = ${mediaType},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `;
      return json(res, 200, { ok: true });
    }
    if (req.method === "DELETE" && action === "item") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM gallery_items WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 400, { error: "Unknown action" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gallery admin error";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/testimonials.ts
async function handler13(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  const sql2 = getDb();
  try {
    if (req.method === "GET") {
      const rows = await sql2`
        SELECT id, partner_type, years, quote, sort_order
        FROM testimonials
        ORDER BY sort_order ASC, years DESC
      `;
      return json(res, 200, {
        quotes: rows.map((row) => ({
          id: row.id,
          type: row.partner_type,
          years: Number(row.years),
          quote: row.quote,
          sortOrder: row.sort_order
        }))
      });
    }
    if (req.method === "POST") {
      const body = readJsonBody(req);
      const type = (body.type ?? "").trim();
      const quote = (body.quote ?? "").trim();
      if (!type || !quote) {
        return json(res, 400, { error: "type and quote required" });
      }
      const id = (body.id ?? newId("tst")).trim();
      await sql2`
        INSERT INTO testimonials (id, partner_type, years, quote, sort_order)
        VALUES (
          ${id},
          ${type},
          ${Number(body.years) || 0},
          ${quote},
          ${body.sortOrder ?? 0}
        )
      `;
      return json(res, 201, { id });
    }
    if (req.method === "PUT") {
      const body = readJsonBody(req);
      if (!body.id) return json(res, 400, { error: "id required" });
      await sql2`
        UPDATE testimonials
        SET
          partner_type = ${(body.type ?? "").trim()},
          years = ${Number(body.years) || 0},
          quote = ${(body.quote ?? "").trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `;
      return json(res, 200, { ok: true });
    }
    if (req.method === "DELETE") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM testimonials WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: "Method not allowed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Testimonials admin error";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/blog.ts
function normalizeSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.map((item) => {
    if (!item || typeof item !== "object") return null;
    const row = item;
    const heading = typeof row.heading === "string" ? row.heading.trim() : "";
    const paragraphs = Array.isArray(row.paragraphs) ? row.paragraphs.filter((p) => typeof p === "string").map((p) => p.trim()).filter(Boolean) : [];
    if (!heading || paragraphs.length === 0) return null;
    return { heading, paragraphs };
  }).filter((s) => s != null);
}
function normalizeKeywords(keywords) {
  if (!Array.isArray(keywords)) return [];
  return keywords.filter((k) => typeof k === "string").map((k) => k.trim()).filter(Boolean);
}
function asTheme2(value) {
  if (value === "accent" || value === "outline" || value === "light") {
    return value;
  }
  return void 0;
}
function normalizeCta(cta) {
  if (!cta || typeof cta !== "object") return null;
  const row = cta;
  const headline = typeof row.headline === "string" ? row.headline.trim() : "";
  const body = typeof row.body === "string" ? row.body.trim() : "";
  const primaryLabel = typeof row.primaryLabel === "string" ? row.primaryLabel.trim() : "";
  const primaryHref = typeof row.primaryHref === "string" ? row.primaryHref.trim() : "";
  if (!headline || !body || !primaryLabel || !primaryHref) return null;
  const out = { headline, body, primaryLabel, primaryHref };
  const primaryTheme = asTheme2(row.primaryTheme);
  if (primaryTheme) out.primaryTheme = primaryTheme;
  if (typeof row.secondaryLabel === "string" && row.secondaryLabel.trim()) {
    out.secondaryLabel = row.secondaryLabel.trim();
  }
  if (typeof row.secondaryHref === "string" && row.secondaryHref.trim()) {
    out.secondaryHref = row.secondaryHref.trim();
  }
  const secondaryTheme = asTheme2(row.secondaryTheme);
  if (secondaryTheme) out.secondaryTheme = secondaryTheme;
  return out;
}
async function handler14(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  const sql2 = getDb();
  try {
    if (req.method === "GET") {
      const rows = await sql2`
        SELECT *
        FROM blog_posts
        ORDER BY published_at DESC, sort_order ASC, title ASC
      `;
      return json(res, 200, {
        posts: rows.map((row) => mapBlogRow(row))
      });
    }
    if (req.method === "POST" || req.method === "PUT") {
      const body = readJsonBody(req);
      const title = (body.title ?? "").trim();
      const excerpt = (body.excerpt ?? "").trim();
      const category = (body.category ?? "").trim();
      const coverImage = (body.coverImage ?? "").trim();
      const coverAlt = (body.coverAlt ?? "").trim();
      const seoTitle = (body.seoTitle ?? "").trim();
      const seoDescription = (body.seoDescription ?? "").trim();
      const date = (body.date ?? "").trim().slice(0, 10);
      const sections = normalizeSections(body.sections);
      const keywords = normalizeKeywords(body.keywords);
      const cta = normalizeCta(body.cta);
      let slug = (body.slug ?? "").trim().toLowerCase();
      if (!title) return json(res, 400, { error: "title required" });
      if (!slug) slug = slugifyTitle(title);
      if (!slug) return json(res, 400, { error: "slug required" });
      if (!date) return json(res, 400, { error: "date required" });
      if (!seoTitle || !seoDescription) {
        return json(res, 400, { error: "seoTitle and seoDescription required" });
      }
      if (sections.length === 0) {
        return json(res, 400, { error: "at least one section required" });
      }
      const readMinutes = Number(body.readMinutes) || 5;
      const published = body.published !== false;
      const sortOrder = Number(body.sortOrder) || 0;
      const keywordsJson = JSON.stringify(keywords);
      const sectionsJson = JSON.stringify(sections);
      const ctaJson = cta ? JSON.stringify(cta) : null;
      if (req.method === "POST") {
        const id2 = (body.id ?? newId("blog")).trim();
        try {
          await sql2`
            INSERT INTO blog_posts (
              id, slug, title, excerpt, published_at, read_minutes, category,
              cover_image, cover_alt, seo_title, seo_description, keywords,
              sections, cta, published, sort_order
            )
            VALUES (
              ${id2},
              ${slug},
              ${title},
              ${excerpt},
              ${date}::date,
              ${readMinutes},
              ${category},
              ${coverImage},
              ${coverAlt},
              ${seoTitle},
              ${seoDescription},
              ${keywordsJson}::jsonb,
              ${sectionsJson}::jsonb,
              ${ctaJson}::jsonb,
              ${published},
              ${sortOrder}
            )
          `;
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          if (message.includes("blog_posts_slug_key") || message.includes("unique")) {
            return json(res, 409, { error: "slug already exists" });
          }
          throw err;
        }
        return json(res, 201, { id: id2 });
      }
      const id = (body.id ?? "").trim();
      if (!id) return json(res, 400, { error: "id required" });
      try {
        await sql2`
          UPDATE blog_posts
          SET
            slug = ${slug},
            title = ${title},
            excerpt = ${excerpt},
            published_at = ${date}::date,
            read_minutes = ${readMinutes},
            category = ${category},
            cover_image = ${coverImage},
            cover_alt = ${coverAlt},
            seo_title = ${seoTitle},
            seo_description = ${seoDescription},
            keywords = ${keywordsJson}::jsonb,
            sections = ${sectionsJson}::jsonb,
            cta = ${ctaJson}::jsonb,
            published = ${published},
            sort_order = ${sortOrder},
            updated_at = NOW()
          WHERE id = ${id}
        `;
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message.includes("blog_posts_slug_key") || message.includes("unique")) {
          return json(res, 409, { error: "slug already exists" });
        }
        throw err;
      }
      return json(res, 200, { ok: true });
    }
    if (req.method === "DELETE") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM blog_posts WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: "Method not allowed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Blog admin error";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/careers.ts
async function ensureTable3() {
  const sql2 = getDb();
  await sql2`
    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      department TEXT NOT NULL,
      city TEXT NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      qualification TEXT NOT NULL,
      experience TEXT NOT NULL,
      current_company TEXT NOT NULL DEFAULT '',
      expected_salary TEXT NOT NULL DEFAULT '',
      resume_url TEXT NOT NULL,
      remarks TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
async function handler15(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  try {
    await ensureTable3();
    const sql2 = getDb();
    if (req.method === "GET") {
      const rows = await sql2`
        SELECT
          id,
          department,
          city,
          full_name,
          mobile,
          email,
          qualification,
          experience,
          current_company,
          expected_salary,
          resume_url,
          remarks,
          created_at
        FROM job_applications
        ORDER BY created_at DESC
      `;
      return json(res, 200, {
        applications: rows.map((row) => ({
          id: row.id,
          department: row.department,
          city: row.city,
          fullName: row.full_name,
          mobile: row.mobile,
          email: row.email,
          qualification: row.qualification,
          experience: row.experience,
          currentCompany: row.current_company || "",
          expectedSalary: row.expected_salary || "",
          resumeUrl: row.resume_url,
          remarks: row.remarks || "",
          createdAt: row.created_at
        }))
      });
    }
    if (req.method === "DELETE") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM job_applications WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: "Method not allowed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Careers admin error";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/culture.ts
async function handler16(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  const sql2 = getDb();
  const action = typeof req.query.action === "string" ? req.query.action : "";
  try {
    await ensureCultureImagesSchema(sql2);
    if (req.method === "GET") {
      const items = await sql2`
        SELECT id, drive_url, caption, sort_order
        FROM culture_images
        ORDER BY sort_order ASC, id ASC
      `;
      return json(res, 200, {
        items: items.map((i) => ({
          id: i.id,
          driveUrl: i.drive_url,
          caption: i.caption || "",
          sortOrder: i.sort_order
        }))
      });
    }
    if (req.method === "POST" && action === "item") {
      const body = readJsonBody(req);
      const driveUrl = (body.driveUrl ?? "").trim();
      if (!driveUrl) return json(res, 400, { error: "driveUrl required" });
      const id = (body.id ?? newId("cult")).trim();
      await sql2`
        INSERT INTO culture_images (id, drive_url, caption, sort_order)
        VALUES (
          ${id},
          ${driveUrl},
          ${(body.caption ?? "").trim()},
          ${body.sortOrder ?? 0}
        )
      `;
      return json(res, 201, { id });
    }
    if (req.method === "PUT" && action === "item") {
      const body = readJsonBody(req);
      if (!body.id) return json(res, 400, { error: "id required" });
      const driveUrl = (body.driveUrl ?? "").trim();
      if (!driveUrl) return json(res, 400, { error: "driveUrl required" });
      await sql2`
        UPDATE culture_images
        SET
          drive_url = ${driveUrl},
          caption = ${(body.caption ?? "").trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `;
      return json(res, 200, { ok: true });
    }
    if (req.method === "DELETE" && action === "item") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM culture_images WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 400, { error: "Unknown action" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Culture admin error";
    return json(res, 500, { error: message });
  }
}

// api/_lib/routes/admin/contact.ts
async function ensureTable4() {
  const sql2 = getDb();
  await sql2`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
async function handler17(req, res) {
  if (handleOptions(req, res)) return;
  if (!await requireAdmin(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }
  try {
    await ensureTable4();
    const sql2 = getDb();
    if (req.method === "GET") {
      const rows = await sql2`
        SELECT id, name, email, phone, subject, message, created_at
        FROM contact_messages
        ORDER BY created_at DESC
      `;
      return json(res, 200, {
        messages: rows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone || "",
          subject: row.subject,
          message: row.message,
          createdAt: row.created_at
        }))
      });
    }
    if (req.method === "DELETE") {
      const id = typeof req.query.id === "string" ? req.query.id : readJsonBody(req).id;
      if (!id) return json(res, 400, { error: "id required" });
      await sql2`DELETE FROM contact_messages WHERE id = ${id}`;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: "Method not allowed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Contact admin error";
    return json(res, 500, { error: message });
  }
}

// scripts/prod-server.mjs
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var ROOT = existsSync(path.join(__dirname, "package.json")) ? __dirname : path.resolve(__dirname, "..");
var DIST = path.join(ROOT, "dist");
var PUBLIC = path.join(ROOT, "public");
var PORT = Number(process.env.PORT) || 3e3;
function resolveHandler(mod) {
  if (typeof mod === "function") return mod;
  if (mod && typeof mod.default === "function") return mod.default;
  throw new Error("API handler export is not a function");
}
function mount(mod) {
  const handler18 = resolveHandler(mod);
  return async (req, res) => {
    try {
      await handler18(req, res);
    } catch (err) {
      console.error("[prod-server]", err);
      if (!res.headersSent) {
        res.status(500).json({
          error: err instanceof Error ? err.message : "Internal error"
        });
      }
    }
  };
}
var app = express();
app.use(express.json({ limit: "2mb" }));
app.all("/api/health", mount(handler));
app.all("/api/services", mount(handler2));
app.all("/api/gallery", mount(handler3));
app.all("/api/drive-media", mount(handler4));
app.all("/api/testimonials", mount(handler5));
app.all("/api/blog", mount(handler6));
app.all("/api/contact", mount(handler7));
app.all("/api/careers", mount(handler8));
app.all(["/api/culture", "/api/culture/"], mount(handler9));
app.all("/api/admin/login", mount(handler10));
app.all("/api/admin/services", mount(handler11));
app.all("/api/admin/gallery", mount(handler12));
app.all("/api/admin/testimonials", mount(handler13));
app.all("/api/admin/blog", mount(handler14));
app.all("/api/admin/careers", mount(handler15));
app.all(["/api/admin/culture", "/api/admin/culture/"], mount(handler16));
app.all("/api/admin/contact", mount(handler17));
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});
app.use(
  express.static(PUBLIC, {
    index: false,
    fallthrough: true
  })
);
app.use(
  express.static(DIST, {
    index: false,
    fallthrough: true
  })
);
app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  res.sendFile(path.join(DIST, "index.html"), (err) => {
    if (err) next(err);
  });
});
var server = http.createServer(app);
server.on("error", (err) => {
  const code = err && typeof err === "object" && "code" in err ? err.code : "";
  if (code === "EADDRINUSE") {
    console.error(
      `[prod-server] failed to bind :${PORT}: address already in use`
    );
    process.exit(1);
  }
  console.error("[prod-server]", err);
  process.exit(1);
});
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[prod-server] listening on http://0.0.0.0:${PORT}`);
  console.log(`[prod-server] serving public from ${PUBLIC}`);
  console.log(`[prod-server] serving app bundle from ${DIST}`);
});
function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
