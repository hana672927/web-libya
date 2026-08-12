import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultContent, type SiteContent } from '@/types';

const TABLE = 'site_content';

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const skipNextUpdate = useRef(false);

  // Fetch content from Supabase on mount
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
        const merged = mergeContent(defaultContent, data.data as Partial<SiteContent>);
        setContent(merged);
      }
      setLoading(false);
    };

    fetchContent();

    // Realtime: listen for changes from other devices/sessions
    const channel = supabase
      .channel('site_content_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload) => {
          if (!mounted) return;
          if (skipNextUpdate.current) {
            skipNextUpdate.current = false;
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
      supabase.removeChannel(channel);
    };
  }, []);

  // Update content locally and persist to Supabase
  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const next = updater(prev);
      // Persist to DB without blocking UI
      skipNextUpdate.current = true;
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
  }, []);

  const resetContent = useCallback(async () => {
    skipNextUpdate.current = true;
    const { error: upErr } = await supabase
      .from(TABLE)
      .upsert({ id: 1, data: defaultContent }, { onConflict: 'id' });
    if (upErr) {
      console.error('Failed to reset content:', upErr.message);
    }
    setContent(defaultContent);
  }, []);

  return { content, updateContent, resetContent, loading, error };
}

// Deep-merge fetched data over defaults so missing fields are filled
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
