/*
# Create orders table and images storage bucket

1. New Tables
- `orders`: stores all submitted order requests from the contact form.
  - `id` (uuid, primary key)
  - `name` (text) — client's full name
  - `whatsapp` (text, not null) — required contact number
  - `store_link` (text) — optional existing store URL
  - `details` (text) — optional project description
  - `status` (text, default 'new') — order status: new, contacted, completed, archived
  - `created_at` (timestamptz, default now())
2. Storage
- Create public bucket `site-images` for storing uploaded images (hero, about, portfolio).
- Policies allow anon+authenticated to upload and read images (single-tenant, no auth).
3. Security
- Enable RLS on `orders`.
- Allow anon+authenticated INSERT (anyone can submit orders) and SELECT/UPDATE/DELETE (admin manages via anon key).
- Add `orders` to realtime publication for live sync.
4. Important Notes
- This replaces the Telegram integration. Orders are now stored directly in Supabase.
- The `site-images` bucket is public so uploaded images are accessible via public URLs.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  whatsapp text NOT NULL,
  store_link text DEFAULT '',
  details text DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Add orders to realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END $$;

-- Create the site-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow anon+authenticated to upload and read
DROP POLICY IF EXISTS "anon_upload_site_images" ON storage.objects;
CREATE POLICY "anon_upload_site_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "anon_read_site_images" ON storage.objects;
CREATE POLICY "anon_read_site_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "anon_update_site_images" ON storage.objects;
CREATE POLICY "anon_update_site_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'site-images') WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "anon_delete_site_images" ON storage.objects;
CREATE POLICY "anon_delete_site_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'site-images');
