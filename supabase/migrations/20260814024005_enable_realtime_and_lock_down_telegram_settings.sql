-- Enable realtime for site_content so admin changes sync across all devices
ALTER PUBLICATION supabase_realtime ADD TABLE site_content;

-- Revoke all direct grants on telegram_settings from anon and authenticated.
-- RLS already blocks access (no policies), but defense in depth: remove table-level grants too.
REVOKE ALL ON telegram_settings FROM anon, authenticated;

-- Ensure only the service role (which bypasses RLS) can read/write telegram_settings.
GRANT SELECT, INSERT, UPDATE, DELETE ON telegram_settings TO service_role;
