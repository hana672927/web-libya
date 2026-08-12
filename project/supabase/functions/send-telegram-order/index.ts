import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BOT_TOKEN = "8992846659:AAE_z6kS9hNOOIsNt6US9_yPj9JvypsX2BU";
const CHAT_ID = "73976346";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, whatsapp, storeLink, details } = await req.json();

    if (!whatsapp || !details) {
      return new Response(
        JSON.stringify({ error: "رقم الواتساب والتفاصيل مطلوبة" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const message = [
      "📋 <b>طلب جديد - ويب ليبيا</b>",
      "",
      `👤 <b>الاسم:</b> ${escapeHtml(name) || "—"}`,
      `📱 <b>رقم الواتساب:</b> ${escapeHtml(whatsapp)}`,
      `🔗 <b>رابط المتجر:</b> ${escapeHtml(storeLink) || "لا يوجد"}`,
      "",
      `📝 <b>تفاصيل الموقع المطلوب:</b>`,
      escapeHtml(details),
      "",
      `🕐 <b>وقت الطلب:</b> ${new Date().toLocaleString("ar-LY", { timeZone: "Africa/Tripoli" })}`,
    ].join("\n");

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!tgResponse.ok) {
      const errData = await tgResponse.json().catch(() => ({}));
      throw new Error(errData?.description || `Telegram API error: ${tgResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to send order" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
