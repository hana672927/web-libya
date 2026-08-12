import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'من نحن', href: '#about' },
    { label: 'أعمالنا', href: '#portfolio' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-950/80 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-royal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-royal-500/30 group-hover:shadow-royal-500/50 transition-all duration-300 group-hover:scale-105">
            <Globe className="w-6 h-6 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-royal-400 to-cyan-300 opacity-0 group-hover:opacity-30 blur-md transition-opacity" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-extrabold text-lg tracking-tight">ويب ليبيا</span>
            <span className="text-cyan-400/70 text-[10px] font-medium tracking-widest">WEB LIBYA</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-5 py-2.5 text-slate-200 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute bottom-1 right-1/2 translate-x-1/2 w-0 h-0.5 bg-gradient-to-l from-royal-400 to-cyan-400 group-hover:w-6 transition-all duration-300 rounded-full" />
            </button>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white glass rounded-lg"
          aria-label="القائمة"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-max px-4 pt-4 pb-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-right px-5 py-3 text-slate-200 hover:text-white font-medium rounded-xl glass hover:bg-white/10 transition-all"
            >
              {link.label}
            </button>
          ))}

        </nav>
      </div>
    </header>
  );
}
