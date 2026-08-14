import { useState } from 'react';
import { X, Lock, ShieldAlert, LayoutDashboard, Image as ImageIcon, FolderOpen, Save, Trash2, Plus, CreditCard as Edit3, RotateCcw, LogOut, Type, Phone, TriangleAlert as AlertTriangle, Eye, EyeOff, Inbox, Clock, CircleCheck, XCircle, MessageSquare, User } from 'lucide-react';
import type { SiteContent, PortfolioProject } from '@/types';
import { defaultContent } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import ImageUpload from '@/components/ImageUpload';

interface AdminPanelProps {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  onClose: () => void;
}

type Tab = 'text' | 'portfolio' | 'images' | 'contact' | 'orders' | 'security';

const ORDER_STATUSES = [
  { value: 'new', label: 'جديد', icon: Clock, color: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/20' },
  { value: 'contacted', label: 'تم التواصل', icon: MessageSquare, color: 'text-yellow-300 bg-yellow-500/10 border-yellow-400/20' },
  { value: 'completed', label: 'مكتمل', icon: CircleCheck, color: 'text-green-300 bg-green-500/10 border-green-400/20' },
  { value: 'archived', label: 'مؤرشف', icon: XCircle, color: 'text-slate-400 bg-slate-500/10 border-slate-400/20' },
];

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
  const { orders, loading: ordersLoading, updateOrderStatus, deleteOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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
    { id: 'orders', label: 'الطلبات', icon: Inbox },
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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ar-LY', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Africa/Tripoli',
      });
    } catch {
      return iso;
    }
  };

  const getStatusInfo = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
  };

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

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
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-l from-royal-500/30 to-cyan-400/20 text-white border border-royal-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
                {tab.id === 'orders' && newOrdersCount > 0 && (
                  <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {newOrdersCount}
                  </span>
                )}
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

                <ImageUpload
                  label="صورة القسم الرئيسي (Hero)"
                  value={content.hero.image}
                  onChange={(v) => { updateContent((p) => ({ ...p, hero: { ...p.hero, image: v } })); flashSaved(); }}
                />

                <ImageUpload
                  label="صورة قسم «من نحن»"
                  value={content.about.image}
                  onChange={(v) => { updateContent((p) => ({ ...p, about: { ...p.about, image: v } })); flashSaved(); }}
                />
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

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-cyan-400" />
                  الطلبات الواردة
                  {newOrdersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                      {newOrdersCount} جديد
                    </span>
                  )}
                </h3>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">لا توجد طلبات بعد</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      const isExpanded = expandedOrder === order.id;
                      return (
                        <div key={order.id} className="glass-card overflow-hidden">
                          <div
                            className="p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <span className="text-white font-bold text-sm truncate">
                                    {order.name || 'بدون اسم'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span dir="ltr">{order.whatsapp}</span>
                                  <span className="text-slate-600">•</span>
                                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{formatDate(order.created_at)}</span>
                                </div>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                              {order.store_link && (
                                <div>
                                  <span className="text-slate-500 text-xs">رابط المتجر:</span>
                                  <a href={order.store_link} target="_blank" rel="noopener noreferrer" className="text-cyan-300 text-xs mr-2 hover:underline" dir="ltr">
                                    {order.store_link}
                                  </a>
                                </div>
                              )}
                              {order.details && (
                                <div>
                                  <span className="text-slate-500 text-xs">التفاصيل:</span>
                                  <p className="text-slate-300 text-sm mt-1 leading-relaxed">{order.details}</p>
                                </div>
                              )}
                              {!order.store_link && !order.details && (
                                <p className="text-slate-500 text-xs">لا توجد تفاصيل إضافية</p>
                              )}

                              <div className="flex flex-wrap items-center gap-2 pt-2">
                                <span className="text-slate-500 text-xs">تغيير الحالة:</span>
                                {ORDER_STATUSES.map((s) => (
                                  <button
                                    key={s.value}
                                    onClick={() => updateOrderStatus(order.id, s.value)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                      order.status === s.value
                                        ? s.color
                                        : 'border-white/10 text-slate-400 hover:bg-white/5'
                                    }`}
                                  >
                                    {s.label}
                                  </button>
                                ))}
                                <button
                                  onClick={() => {
                                    if (confirm('هل تريد حذف هذا الطلب؟')) {
                                      deleteOrder(order.id);
                                      setExpandedOrder(null);
                                    }
                                  }}
                                  className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-all mr-auto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  حذف
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
          <ImageUpload
            label="صورة المشروع"
            value={draft.image}
            onChange={(v) => setDraft({ ...draft, image: v })}
          />
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
