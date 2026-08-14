import { useState, useRef } from 'react';
import { Upload, Loader as Loader2, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('تعذر رفع الصورة. حاول مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange('');
    setError('');
  };

  return (
    <div className={className}>
      {label && <label className="block text-slate-300 text-xs mb-1.5">{label}</label>}
      <div className="flex gap-4">
        <div className="w-28 h-20 rounded-lg overflow-hidden bg-navy-800 flex-shrink-0 border border-white/10">
          {value ? (
            <div className="relative w-full h-full group">
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-slate-600" />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex-1 min-h-[80px] rounded-lg border-2 border-dashed border-white/10 hover:border-royal-400/50 bg-navy-950/50 flex items-center justify-center cursor-pointer transition-all group"
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                جارٍ الرفع...
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-slate-300 transition-colors">
                <Upload className="w-5 h-5" />
                <span className="text-xs">اسحب صورة هنا أو اضغط للاختيار</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
}
