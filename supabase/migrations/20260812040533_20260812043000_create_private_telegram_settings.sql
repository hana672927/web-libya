/*
# Create private Telegram delivery settings

1. New Tables
- `telegram_settings` stores the bot token and destination chat ID used only by server-side functions.
- `id` is fixed to 1 so the project has one private configuration record.
- `bot_token` stores the Telegram bot credential and is never selected by the public website.
- `chat_id` stores the private Telegram destination.
- `updated_at` records the latest configuration change.
2. Security
- Row Level Security is enabled.
- No anon or authenticated policies are created, so browser clients cannot read or write these credentials.
- The Telegram edge functions use their server-side service role to access this table.
3. Important Notes
- The public site content table is not used for these secrets.
- Configuration changes are accepted only by the protected admin configuration function.
*/

CREATE TABLE IF NOT EXISTS telegram_settings (
  id smallint PRIMARY KEY DEFAULT 1,
  bot_token text NOT NULL,
  chat_id text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT telegram_settings_single_row CHECK (id = 1)
);

ALTER TABLE telegram_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "telegram_settings_no_public_select" ON telegram_settings;
DROP POLICY IF EXISTS "telegram_settings_no_public_insert" ON telegram_settings;
DROP POLICY IF EXISTS "telegram_settings_no_public_update" ON telegram_settings;
DROP POLICY IF EXISTS "telegram_settings_no_public_delete" ON telegram_settings;
