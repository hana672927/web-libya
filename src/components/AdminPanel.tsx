import { useState } from 'react';
import { X, Lock, ShieldAlert, LayoutDashboard, Image as ImageIcon, FolderOpen, Save, Trash2, Plus, CreditCard as Edit3, RotateCcw, LogOut, Type, Phone, TriangleAlert as AlertTriangle, Eye, EyeOff } from 'lucide-react';
import type { SiteContent, PortfolioProject } from '@/types';
import { defaultContent } from '@/types';

interface AdminPanelProps {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  onClose: () => void;
}

type Tab = 'text' | 'portfolio' | 'images' | 'contact' | 'security';

export default function AdminPanel({ content, updateContent, resetContent, onClose }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('text');
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeMsg, setPasscodeMsg] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramMsg, setTelegramMsg] = useState('');
  const [telegramSaving, setTelegramSaving] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === content.adminPasscode) {
      setAuthed(true);
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('كلمة المرور غير صحيحة');
    }
  };

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const tabs: { id: Tab; label: string; icon: typeof Type }[] = [
    { id: 'text', label: 'النصوص', icon: Type },
    { id: 'portfolio', label: 'الأعمال', icon: FolderOpen },
    { id: 'images', label: 'الصور', icon: ImageIcon },
    { id: 'contact', label: 'التواصل', icon: Phone },
    { id: 'security', label: 'الأمان', icon: ShieldAlert },
  ];

  // --- Login screen ---
  if (!authed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500 to-cyan-400 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-extrabold text-xl">لوحة الإدارة</h2>
                  <p className="text-slate-400 text-sm">ويب ليبيا</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-navy-950/50 border border-white/10 text-white placeholder-slate-500 focus:border-royal-400 focus:outline-none focus:ring-2 focus:ring-royal-500/20 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {authError}
                  </p>
                )}
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                دخول
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  const updateField = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    updateContent((prev) => ({ ...prev, [key]: value }));
    flashSaved();
  };

  const handleSaveProject = (project: PortfolioProject) => {
    updateContent((prev) => {
      const exists = prev.portfolio.projects.some((p) => p.id === project.id);
      const projects = exists
        ? prev.portfolio.projects.map((p) => (p.id === project.id ? project : p))
        : [...prev.portfolio.projects, project];
      return { ...prev, portfolio: { ...prev.portfolio, projects } };
    });
    setEditingProject(null);
    flashSaved();
  };

  const handleDeleteProject = (id: string) => {
    updateContent((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        projects: prev.portfolio.projects.filter((p) => p.id !== id),
      },
    }));
    flashSaved();
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramSaving(true);
    setTelegramMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-telegram-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          adminPasscode: content.adminPasscode,
          botToken: telegramToken,
          chatId: telegramChatId,
        }),
      });

      if (!response.ok) throw new Error('Telegram settings save failed');
      setTelegramToken('');
      setTelegramChatId('');
      setTelegramMsg('تم حفظ إعدادات Telegram بأمان');
      flashSaved();
    } catch (error) {
      console.error(error);
      setTelegramMsg('تعذر حفظ إعدادات Telegram');
    } finally {
      setTelegramSaving(false);
    }
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.length < 4) {
      setPasscodeMsg('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      return;
    }
    updateContent((prev) => ({ ...prev, adminPasscode: newPasscode }));
    setNewPasscode('');
    setPasscodeMsg('تم تغيير كلمة المرور بنجاح');
    setTimeout(() => setPasscodeMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-navy-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl h-[92vh] glass-card flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-navy-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-cyan-400 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg">لوحة تحكم الإدارة</h2>
              <p className="text-slate-400 text-xs">إدارة محتوى موقع ويب ليبيا</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedFlash && (
              <span className="text-green-300 text-sm flex items-center gap-1.5 animate-fade-in">
                <Save className="w-4 h-4" />
                تم الحفظ
              </span>
            )}
            <button
              onClick={() => {
                if (confirm('هل تريد تسجيل الخروج؟')) {
                  setAuthed(false);
                  onClose();
                }
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="خروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="إغلاق">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
          {/* Tabs sidebar */}
          <nav className="sm:w-48 flex sm:flex-col gap-1 p-3 border-b sm:border-b-0 sm:border-l border-white/10 overflow-x-auto sm:overflow-x-visible bg-navy-950/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-l from-royal-500/30 to-cyan-400/20 text-white border border-royal-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* TEXT TAB */}
            {activeTab === 'text' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Type className="w-5 h-5 text-cyan-400" />
                  تعديل النصوص
                </h3>

                <div className="glass-card p-5 space-y-4">
                  <h4 className="text-royal-300 font-bold text-sm">القسم الرئيسي (Hero)</h4>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">العنوان</label>
                    <input
                      type="text"
                      value={content.hero.title}
                      onChange={(e) => updateContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">النص الفرعي</label>
                    <textarea
                      value={content.hero.subtitle}
                      onChange={(e) => updateContent((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">نص زر التواصل</label>
                    <input
                      type="text"
                      value={content.hero.ctaText}
                      onChange={(e) => updateContent((p) => ({ ...p, hero: { ...p.hero, ctaText: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="glass-card p-5 space-y-4">
                  <h4 className="text-royal-300 font-bold text-sm">قسم "من نحن"</h4>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">العنوان</label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) => updateContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">الوصف</label>
                    <textarea
                      value={content.about.description}
                      onChange={(e) => updateContent((p) => ({ ...p, about: { ...p.about, description: e.target.value } }))}
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">المميزات (سطر لكل ميزة)</label>
                    <textarea
                      value={content.about.features.join('\n')}
                      onChange={(e) => updateContent((p) => ({ ...p, about: { ...p.about, features: e.target.value.split('\n').filter(Boolean) } }))}
                      rows={6}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="glass-card p-5 space-y-4">
                  <h4 className="text-royal-300 font-bold text-sm">عناوين الأقسام</h4>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">عنوان قسم الأعمال</label>
                    <input
                      type="text"
                      value={content.portfolio.title}
                      onChange={(e) => updateContent((p) => ({ ...p, portfolio: { ...p.portfolio, title: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">وصف قسم الأعمال</label>
                    <input
                      type="text"
                      value={content.portfolio.subtitle}
                      onChange={(e) => updateContent((p) => ({ ...p, portfolio: { ...p.portfolio, subtitle: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">عنوان قسم التواصل</label>
                    <input
                      type="text"
                      value={content.contact.title}
                      onChange={(e) => updateContent((p) => ({ ...p, contact: { ...p.contact, title: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">وصف قسم التواصل</label>
                    <input
                      type="text"
                      value={content.contact.subtitle}
                      onChange={(e) => updateContent((p) => ({ ...p, contact: { ...p.contact, subtitle: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5">نص حقوق النشر</label>
                    <input
                      type="text"
                      value={content.footer.copyright}
                      onChange={(e) => updateContent((p) => ({ ...p, footer: { ...p.footer, copyright: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                    إدارة الأعمال
                  </h3>
                  <button
                    onClick={() => setEditingProject({
                      id: `p${Date.now()}`,
                      title: '',
                      description: '',
                      image: '',
                      link: '',
                      category: '',
                    })}
                    className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    مشروع جديد
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {content.portfolio.projects.map((project) => (
                    <div key={project.id} className="glass-card overflow-hidden">
                      <div className="relative h-32">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-navy-950/70 text-cyan-300 text-xs font-bold">
                          {project.category}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-white font-bold text-sm mb-1">{project.title}</h4>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-3">{project.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="flex-1 py-2 rounded-lg glass hover:bg-white/10 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IMAGES TAB */}
            {activeTab === 'images' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                  إدارة الصور
                </h3>

                {[
                  { label: 'صورة القسم الرئيسي (Hero)', value: content.hero.image, onChange: (v: string) => updateContent((p) => ({ ...p, hero: { ...p.hero, image: v } })) },
                  { label: 'صورة قسم "من نحن"', value: content.about.image, onChange: (v: string) => updateContent((p) => ({ ...p, about: { ...p.about, image: v } })) },
                ].map((img, i) => (
                  <div key={i} className="glass-card p-5 space-y-3">
                    <h4 className="text-royal-300 font-bold text-sm">{img.label}</h4>
                    <div className="flex gap-4">
                      <div className="w-28 h-20 rounded-lg overflow-hidden bg-navy-800 flex-shrink-0">
                        {img.value ? (
                          <img src={img.value} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-slate-300 text-xs mb-1.5">رابط الصورة (URL)</label>
                        <input
                          type="text"
                          value={img.value}
                          onChange={(e) => img.onChange(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  معلومات التواصل
                </h3>

                <div className="glass-card p-5 space-y-4">
                  {[
                    { key: 'facebook', label: 'فيسبوك' },
                    { key: 'instagram', label: 'انستغرام' },
                    { key: 'tiktok', label: 'تيك توك' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-slate-300 text-xs mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        value={content.contact.info[field.key as keyof typeof content.contact.info]}
                        onChange={(e) => updateContent((p) => ({
                          ...p,
                          contact: {
                            ...p.contact,
                            info: { ...p.contact.info, [field.key]: e.target.value },
                          },
                        }))}
                        className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                        dir="ltr"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  الأمان والإعدادات
                </h3>

                <div className="glass-card p-5 space-y-4">
                  <h4 className="text-royal-300 font-bold text-sm">إعدادات استقبال الطلبات</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">تُحفظ هذه البيانات في مكان خاص ولا تظهر لزوار الموقع. ستصل الطلبات إلى المحادثة المرتبطة بالبوت مباشرة.</p>
                  <form onSubmit={handleSaveTelegram} className="space-y-3">
                    <div>
                      <label className="block text-slate-300 text-xs mb-1.5">Telegram Bot Token</label>
                      <input
                        type="password"
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        placeholder="أدخل رمز البوت"
                        required
                        className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-xs mb-1.5">Telegram Chat ID</label>
                      <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="أدخل رقم المحادثة"
                        required
                        className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                        dir="ltr"
                      />
                    </div>
                    <button type="submit" disabled={telegramSaving} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 w-fit disabled:opacity-50">
                      <Save className="w-4 h-4" />
                      {telegramSaving ? 'جارٍ الحفظ...' : 'حفظ إعدادات Telegram'}
                    </button>
                    {telegramMsg && <p className="text-sm text-cyan-300">{telegramMsg}</p>}
                  </form>
                </div>

                <div className="glass-card p-5 space-y-4">
                  <h4 className="text-royal-300 font-bold text-sm">تغيير كلمة المرور</h4>
                  <form onSubmit={handleChangePasscode} className="space-y-3">
                    <div>
                      <label className="block text-slate-300 text-xs mb-1.5">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
                      />
                    </div>
                    <button type="submit" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 w-fit">
                      <Save className="w-4 h-4" />
                      حفظ كلمة المرور
                    </button>
                    {passcodeMsg && (
                      <p className="text-sm text-cyan-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        {passcodeMsg}
                      </p>
                    )}
                  </form>
                </div>

                <div className="glass-card p-5 space-y-3 border-red-400/20">
                  <h4 className="text-red-300 font-bold text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    إعادة الضبط
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    سيؤدي هذا إلى حذف جميع التعديلات واستعادة المحتوى الافتراضي. لا يمكن التراجع عن هذا الإجراء.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد؟ سيتم حذف جميع التعديلات والعودة للمحتوى الافتراضي.')) {
                        resetContent();
                        flashSaved();
                      }
                    }}
                    className="px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    إعادة ضبط المحتوى
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project editor modal */}
      {editingProject && (
        <ProjectEditor
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}

// --- Project editor sub-component ---
function ProjectEditor({
  project,
  onSave,
  onCancel,
}: {
  project: PortfolioProject;
  onSave: (p: PortfolioProject) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(project);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-cyan-400" />
            {project.title ? 'تعديل مشروع' : 'مشروع جديد'}
          </h3>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs mb-1.5">عنوان المشروع</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-xs mb-1.5">التصنيف</label>
            <input
              type="text"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="مثال: مطاعم، تجارة إلكترونية..."
              className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-xs mb-1.5">الوصف</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-xs mb-1.5">رابط الصورة (URL)</label>
            <input
              type="text"
              value={draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              placeholder="https://..."
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
            />
            {draft.image && (
              <div className="mt-2 h-24 rounded-lg overflow-hidden bg-navy-800">
                <img src={draft.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-slate-300 text-xs mb-1.5">رابط المشروع (اختياري)</label>
            <input
              type="text"
              value={draft.link}
              onChange={(e) => setDraft({ ...draft, link: e.target.value })}
              placeholder="https://..."
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-lg bg-navy-950/50 border border-white/10 text-white text-sm focus:border-royal-400 focus:outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onSave(draft)}
              disabled={!draft.title}
              className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              حفظ
            </button>
            <button onClick={onCancel} className="px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-slate-200 text-sm font-bold transition-all">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
