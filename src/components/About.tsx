import { CircleCheck as CheckCircle2, Zap, Shield, Smartphone, Search, Headphones, LayoutGrid as Layout } from 'lucide-react';
import type { SiteContent } from '@/types';

interface AboutProps {
  content: SiteContent['about'];
}

const featureIcons = [Smartphone, Zap, Search, Headphones, Layout, Shield];

export default function About({ content }: AboutProps) {
  return (
    <section id="about" className="section-padding relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-royal-700/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative animate-fade-up order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden glass">
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 right-6 glass-card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white text-2xl font-extrabold">5</span>
              </div>
              <div>
                <div className="text-white font-bold">سنوات خبرة</div>
                <div className="text-slate-400 text-sm">في تصميم المواقع</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-200 font-medium">{content.title}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              نصمم <span className="gradient-text">تجارب رقمية</span> تُحدث فرقاً
            </h2>

            <p className="text-slate-300 leading-relaxed mb-8 text-base sm:text-lg">
              {content.description}
            </p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {content.features.map((feature, i) => {
                const Icon = featureIcons[i % featureIcons.length];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/[0.06] transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-royal-500/20 to-cyan-400/20 flex items-center justify-center group-hover:from-royal-500/30 group-hover:to-cyan-400/30 transition-all">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
