import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import { useContent } from '@/hooks/useContent';
import { Loader as Loader2 } from 'lucide-react';

export default function App() {
  const { content, updateContent, resetContent, loading, error } = useContent();
  const [adminOpen, setAdminOpen] = useState(false);

  // Open admin via /admin hash
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') setAdminOpen(true);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleAdminClose = () => {
    setAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-slate-400 text-sm">جارٍ تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 overflow-x-hidden">
      <Header />

      <main>
        <Hero content={content.hero} onContactClick={scrollToContact} />
        <About content={content.about} />
        <Portfolio content={content.portfolio} />
        <Contact content={content.contact} />
      </main>

      <Footer content={content.footer} contactInfo={content.contact.info} onAdminClick={() => setAdminOpen(true)} />

      {adminOpen && (
        <AdminPanel
          content={content}
          updateContent={updateContent}
          resetContent={resetContent}
          onClose={handleAdminClose}
        />
      )}
    </div>
  );
}
