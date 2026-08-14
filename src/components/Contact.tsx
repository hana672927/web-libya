import { useState } from 'react';
import { Send, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Facebook, Instagram, User, MessageSquare, Link2 } from 'lucide-react';
import { TikTok } from '@/components/icons/TikTok';
import type { SiteContent } from '@/types';

interface ContactProps {
  content: SiteContent['contact'];
}

interface OrderForm {
  name: string;
  whatsapp: string;
  storeLink: string;
  details: string;
}

export default function Contact({ content }: ContactProps) {
  const [form, setForm] = useState<OrderForm>({
    name: '',
    whatsapp: '',
    storeLink: '',
    details: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.whatsapp.trim()) {
      setStatus('error');
      setErrorMsg('رقم الواتساب مطلوب لإتمام الطلب');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-telegram-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: form.name,
            whatsapp: form.whatsapp,
            storeLink: form.storeLink,
            details: form.details,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || `HTTP ${response.status}`);
      }

      setStatus('sent');
      setForm({ name: '', whatsapp: '', storeLink: '', details: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('تعذر إرسال الطلب. يرجى المحاولة مرة أخرى لاحقاً.');
      console.error('Order send error:', err);
    }
  };

  const socials = [
    { icon: Facebook, url: content.info.facebook, label: 'فيسبوك' },
    { icon: Instagram, url: content.info.instagram, label: 'انستغرام' },
    { icon: TikTok, url: content.info.tiktok, label: 'تيك توك' },
  ];

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-royal-700/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5">
            <Send className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-200 font-medium">{content.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            لنبدأ <span className="gradient-text">مشروعك القادم</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Social info */}
          <div className="lg:col-span-2 space-y-4 animate-fade-up">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold text-lg mb-2">تابعنا على</h3>
              <p className="text-slate-400 text-sm mb-5">تواصل معنا عبر منصات التواصل الاجتماعي</p>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-12 h-12 rounded-xl glass hover:bg-gradient-to-br hover:from-royal-500 hover:to-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-royal-500/30"
                  >
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-bold text-base mb-3">لماذا تختارنا؟</h3>
              <ul className="space-y-2.5">
                {[
                  'تصميم احترافي وعصري',
                  'تسليم سريع وفي الموعد',
                  'دعم فني متواصل',
                  'أسعار تنافسية',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-3 animate-fade-up">
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-bold text-lg">استمارة الطلب</h3>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-navy-950/50 border border-white/10 text-white placeholder-slate-500 focus:border-royal-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp Number - REQUIRED */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  رقم الواتساب <span className="text-red-400 font-bold">*</span>
                  <span className="text-red-400/80 text-xs mr-1">(إلزامي)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="مثال: +218 91 234 5678"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-navy-950/50 border border-white/10 text-white placeholder-slate-500 focus:border-royal-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 transition-all"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {/* Existing Store Link - Optional */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  رابط المتجر الإلكتروني إن وجد
                  <span className="text-slate-500 text-xs mr-1">(اختياري)</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={form.storeLink}
                    onChange={(e) => setForm({ ...form, storeLink: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-navy-950/50 border border-white/10 text-white placeholder-slate-500 focus:border-royal-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Website Description - Optional */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  تفاصيل وفحوى الموقع المطلوب
                  <span className="text-slate-500 text-xs mr-1">(اختياري)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
                  <textarea
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="اكتب تفاصيل المشروع، نوع الموقع، المميزات المطلوبة، الجمهور المستهدف..."
                    rows={5}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-navy-950/50 border border-white/10 text-white placeholder-slate-500 focus:border-royal-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  status === 'sent'
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                    : status === 'sending'
                    ? 'bg-royal-500/50 text-white/70 cursor-wait'
                    : 'btn-primary'
                }`}
              >
                {status === 'sent' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    تم إرسال طلبك بنجاح! سنتواصل معك قريباً
                  </>
                ) : status === 'sending' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    إرسال الطلب
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
