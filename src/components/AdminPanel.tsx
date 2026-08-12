import React, { useState, useEffect } from 'react';
import { Lock, Save, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedToken = localStorage.getItem('tg_bot_token') || '';
      const savedChatId = localStorage.getItem('tg_chat_id') || '';
      setBotToken(savedToken);
      setChatId(savedChatId);

      supabase
        .from('settings')
        .select('*')
        .single()
        .then(({ data }) => {
          if (data) {
            if (data.telegram_bot_token) setBotToken(data.telegram_bot_token);
            if (data.telegram_chat_id) setChatId(data.telegram_chat_id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    localStorage.setItem('tg_bot_token', botToken);
    localStorage.setItem('tg_chat_id', chatId);

    try {
      await supabase.from('settings').upsert({
        id: 1,
        telegram_bot_token: botToken,
        telegram_chat_id: chatId,
        updated_at: new Date().toISOString(),
      });
      setStatus('success');
      setMessage('تم حفظ إعدادات Telegram بنجاح!');
    } catch (err) {
      setStatus('success');
      setMessage('تم حفظ إعدادات Telegram محلياً بنجاح!');
    }

    setTimeout(() => setStatus('idle'), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white dir-rtl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">إعدادات استقبال الطلبات (Telegram)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Telegram Bot Token</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Telegram Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="123456789"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {status === 'success' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{status === 'saving' ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
