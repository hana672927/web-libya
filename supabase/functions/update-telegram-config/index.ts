import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { adminPasscode, botToken, chatId } = await req.json();
    const { data: content, error: contentError } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    if (contentError || content?.data?.adminPasscode !== adminPasscode) {
      return json({ error: "غير مصرح" }, 403);
    }

    if (typeof botToken !== "string" || botToken.trim().length < 10 || typeof chatId !== "string" || !chatId.trim()) {
      return json({ error: "بيانات Telegram غير مكتملة" }, 400);
    }

    const { error } = await supabase.from("telegram_settings").upsert({
      id: 1,
      bot_token: botToken.trim(),
      chat_id: chatId.trim(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

    if (error) {
      console.error("Telegram settings save failed", error);
      return json({ error: "تعذر حفظ الإعدادات" }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Telegram config failed", error);
    return json({ error: "تعذر حفظ الإعدادات" }, 500);
  }
});

function json(body: Record<string, boolean | string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
