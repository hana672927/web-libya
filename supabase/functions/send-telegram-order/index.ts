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
    const { name, whatsapp, storeLink, details } = await req.json();
    const trimmedWhatsapp = typeof whatsapp === "string" ? whatsapp.trim() : "";
    const trimmedDetails = typeof details === "string" ? details.trim() : "";

    if (!trimmedWhatsapp || !trimmedDetails) {
      return json({ error: "رقم الواتساب والتفاصيل مطلوبة" }, 400);
    }

    const { data: settings, error: settingsError } = await supabase
      .from("telegram_settings")
      .select("bot_token, chat_id")
      .eq("id", 1)
      .maybeSingle();

    if (settingsError || !settings?.bot_token || !settings.chat_id) {
      return json({ error: "لم يتم إعداد قناة استقبال الطلبات بعد" }, 503);
    }

    const message = [
      "طلب جديد - ويب ليبيا",
      "",
      `الاسم: ${escapeHtml(typeof name === "string" ? name.trim() : "—") || "—"}`,
      `رقم الواتساب: ${escapeHtml(trimmedWhatsapp)}`,
      `رابط المتجر: ${escapeHtml(typeof storeLink === "string" ? storeLink.trim() : "") || "لا يوجد"}`,
      "",
      "تفاصيل الموقع المطلوب:",
      escapeHtml(trimmedDetails),
      "",
      `وقت الطلب: ${new Date().toLocaleString("ar-LY", { timeZone: "Africa/Tripoli" })}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${settings.bot_token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: settings.chat_id, text: message, parse_mode: "HTML" }),
      },
    );

    if (!telegramResponse.ok) {
      console.error("Telegram delivery failed", telegramResponse.status);
      return json({ error: "تعذر إرسال الطلب حالياً" }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Order delivery failed", error);
    return json({ error: "تعذر إرسال الطلب حالياً" }, 500);
  }
});

function json(body: Record<string, boolean | string>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
