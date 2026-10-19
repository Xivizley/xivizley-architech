'use client';

import { useEffect } from 'react';

/**
 * Keeps the root <html lang> attribute in sync with the active locale.
 * The root layout is shared by every route, so /en/* pages inherit lang="tr"
 * from the server render; this component corrects it on mount.
 */
export function HtmlLangSync({
  lang,
  fallback = 'en',
}: {
  lang: string;
  fallback?: string;
}) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = fallback;
      }
    };
  }, [lang, fallback]);

  return null;
}