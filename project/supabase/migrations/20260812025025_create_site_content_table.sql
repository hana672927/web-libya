/*
# Create site_content table for Web Libya CMS

1. New Tables
- `site_content`: single-row table storing the entire website content as JSONB.
  - `id` (int2, primary key, fixed to 1) — ensures only one content row exists.
  - `data` (jsonb, not null) — the full SiteContent object (hero, about, portfolio, contact, footer, adminPasscode).
  - `updated_at` (timestamptz) — automatically updated on row change.
2. Security
- Enable RLS on `site_content`.
- Allow anon + authenticated full CRUD: the data is intentionally public/shared (single-tenant, no sign-in).
  The admin passcode lives inside the JSONB and is checked client-side; it is not a server-side secret.
3. Notes
- A trigger keeps `updated_at` current on every UPDATE.
- The single-row constraint is enforced by a unique index on `id` plus a default of 1.
*/

CREATE TABLE IF NOT EXISTS site_content (
  id smallint PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Single-tenant: data is intentionally public/shared, no sign-in screen.
DROP POLICY IF EXISTS "anon_select_site_content" ON site_content;
CREATE POLICY "anon_select_site_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_site_content" ON site_content;
CREATE POLICY "anon_insert_site_content" ON site_content FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_site_content" ON site_content;
CREATE POLICY "anon_update_site_content" ON site_content FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_site_content" ON site_content;
CREATE POLICY "anon_delete_site_content" ON site_content FOR DELETE
  TO anon, authenticated USING (true);
