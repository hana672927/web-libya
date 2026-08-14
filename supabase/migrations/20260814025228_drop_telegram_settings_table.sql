/*
# Drop unused telegram_settings table

The Telegram integration has been completely removed. Orders are now stored
directly in the `orders` table and managed via the admin panel. The
`telegram_settings` table (which stored bot tokens and chat IDs) is no longer
needed and is safe to drop — it contained only configuration data, no user data.
*/

DROP TABLE IF EXISTS telegram_settings;
