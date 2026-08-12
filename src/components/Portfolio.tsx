import { ExternalLink, FolderOpen } from 'lucide-react';
import type { SiteContent } from '@/types';

interface PortfolioProps {
  content: SiteContent['portfolio'];
}

export default function Portfolio({ content }: PortfolioProps) {
  return (
    <section id="portfolio" className="section-padding relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-700/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-5">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-200 font-medium">{content.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            أعمالنا <span className="gradient-text">السابقة</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.projects.map((project, i) => (
            <article
              key={project.id}
              className="group relative rounded-2xl overflow-hidden glass-card hover:border-royal-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)]"
              style={{ animation: `fadeUp 0.6s ease-out ${i * 0.08}s both` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-navy-950/70 backdrop-blur-md text-cyan-300 text-xs font-bold border border-cyan-400/20">
                  {project.category}
                </div>

                {/* Link icon */}
                {project.link && project.link !== '#' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 left-3 w-9 h-9 rounded-full bg-royal-500/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-royal-500 hover:scale-110"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Bottom gradient line */}
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-l from-royal-500 to-cyan-400 transition-all duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
