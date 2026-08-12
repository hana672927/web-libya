import { Globe, ArrowUp, Facebook, Instagram, Lock } from 'lucide-react';
import { TikTok } from '@/components/icons/TikTok';
import type { SiteContent } from '@/types';

interface FooterProps {
  content: SiteContent['footer'];
  contactInfo: SiteContent['contact']['info'];
  onAdminClick: () => void;
}

export default function Footer({ content, contactInfo, onAdminClick }: FooterProps) {
  const links = [
    { label: 'من نحن', href: '#about' },
    { label: 'أعمالنا', href: '#portfolio' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  const socials = [
    { icon: Facebook, url: contactInfo.facebook, label: 'فيسبوك' },
    { icon: Instagram, url: contactInfo.instagram, label: 'انستغرام' },
    { icon: TikTok, url: contactInfo.tiktok, label: 'تيك توك' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-navy-950/50">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-cyan-400 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-extrabold text-lg">ويب ليبيا</div>
                <div className="text-cyan-400/70 text-[10px] tracking-widest">WEB LIBYA</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              وكالة تصميم وتطوير مواقع إلكترونية احترافية في ليبيا. نبني تجارب رقمية تُلهم وتُنجز.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-slate-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-4">تابعنا</h3>
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg glass hover:bg-gradient-to-br hover:from-royal-500 hover:to-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center">{content.copyright}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:-translate-y-1"
            aria-label="العودة للأعلى"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle admin access lock icon */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onAdminClick}
            className="text-slate-700 hover:text-cyan-400 transition-all duration-300 p-1"
            aria-label="دخول الإدارة"
            title="دخول الإدارة"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
