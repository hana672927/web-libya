import { ArrowLeft, Sparkles, Code as Code2, Palette, Rocket, CircleCheck as CheckCircle2 } from 'lucide-react';
import type { SiteContent } from '@/types';

interface HeroProps {
  content: SiteContent['hero'];
  onContactClick: () => void;
}

export default function Hero({ content, onContactClick }: HeroProps) {
  const badges = [
    { icon: Code2, label: 'تطوير احترافي' },
    { icon: Palette, label: 'تصميم إبداعي' },
    { icon: Rocket, label: 'أداء فائق' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden animated-gradient">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-royal-600/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-slow" />

      <div className="container-max px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-right animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-200 font-medium">وكالة تصميم ويب في ليبيا</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
              {content.title.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="gradient-text">{content.title.split(' ').slice(-2).join(' ')}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0">
              {content.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-slate-200"
                  style={{ animation: `fadeUp 0.6s ease-out ${0.3 + i * 0.1}s both` }}
                >
                  <b.icon className="w-4 h-4 text-cyan-400" />
                  {b.label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button onClick={onContactClick} className="btn-primary flex items-center gap-2">
                {content.ctaText}
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-ghost"
              >
                شاهد أعمالنا
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto lg:mx-0">
              {[
                { num: '+50', label: 'مشروع منجز' },
                { num: '+30', label: 'عميل سعيد' },
                { num: '5', label: 'سنوات خبرة' },
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{s.num}</div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-scale-in hidden lg:block">
            <div className="relative">
              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden glass glow-blue animate-float">
                <img
                  src={content.image}
                  alt="تصميم ويب"
                  className="w-full h-[420px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-royal-500/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  مشروع مكتمل
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 glass-card p-4 flex items-center gap-3 animate-float-slow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-royal-500 to-cyan-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-bold">كود نظيف</div>
                  <div className="text-slate-400 text-xs">معايير عالمية</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 glass-card p-4 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-royal-500 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-bold">تصميم فريد</div>
                  <div className="text-slate-400 text-xs">مخصص لك</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  );
}
