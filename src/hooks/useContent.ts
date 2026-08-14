import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultContent, type SiteContent } from '@/types';

const TABLE = 'site_content';

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Counter of in-flight local writes whose realtime echoes we should skip.
  // A counter (not boolean) handles multiple rapid writes correctly.
  const pendingWrites = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      pendingWrites.current = 0;
    }, 5000);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data')
        .eq('id', 1)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data?.data) {
        setContent(mergeContent(defaultContent, data.data as Partial<SiteContent>));
      }
      setLoading(false);
    };

    fetchContent();

    const channel = supabase
      .channel('site_content_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload) => {
          if (!mounted) return;
          // Skip echoes of our own writes
          if (pendingWrites.current > 0) {
            pendingWrites.current--;
            return;
          }
          const newData = (payload.new as { data?: Partial<SiteContent> })?.data;
          if (newData) {
            setContent(mergeContent(defaultContent, newData));
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (resetTimer.current) clearTimeout(resetTimer.current);
      supabase.removeChannel(channel);
    };
  }, [scheduleReset]);

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const next = updater(prev);
      pendingWrites.current++;
      scheduleReset();
      (async () => {
        const { error: upErr } = await supabase
          .from(TABLE)
          .upsert({ id: 1, data: next }, { onConflict: 'id' });
        if (upErr) {
          console.error('Failed to save content:', upErr.message);
        }
      })();
      return next;
    });
  }, [scheduleReset]);

  const resetContent = useCallback(async () => {
    pendingWrites.current++;
    scheduleReset();
    const { error: upErr } = await supabase
      .from(TABLE)
      .upsert({ id: 1, data: defaultContent }, { onConflict: 'id' });
    if (upErr) {
      console.error('Failed to reset content:', upErr.message);
    }
    setContent(defaultContent);
  }, [scheduleReset]);

  return { content, updateContent, resetContent, loading, error };
}

function mergeContent(base: SiteContent, override: Partial<SiteContent>): SiteContent {
  return {
    ...base,
    ...override,
    hero: { ...base.hero, ...override.hero },
    about: { ...base.about, ...override.about },
    portfolio: { ...base.portfolio, ...override.portfolio },
    contact: {
      ...base.contact,
      ...override.contact,
      info: { ...base.contact.info, ...override.contact?.info },
    },
    footer: { ...base.footer, ...override.footer },
  };
}
