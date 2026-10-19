// ============================================================
// XIVIZLEY — Public Documentation Header
// components/shared/PublicNav.tsx
// Shared by /benchmark, /press and /en/* static pages.
// Server component: no client state, no tracking.
// ============================================================

import React from 'react';
import Link from 'next/link';
import { Code2, Languages, LayoutGrid, Activity, FileText } from 'lucide-react';

interface PublicNavProps {
  lang: 'tr' | 'en';
  /** Counterpart URL for the language toggle (e.g. /en/benchmark <-> /benchmark). */
  altHref: string;
}

export function PublicNav({ lang, altHref }: PublicNavProps) {
  const isEn = lang === 'en';

  return (
    <header className="sticky top-0 z-40 border-b border-[#2B1A42] bg-[#090514]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-[#F5F3FF]">
          <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#8B5CF6]/60 bg-[#120A21] text-[#C084FC]">
            X
          </span>
          <span className="tracking-tight">XIVIZLEY</span>
          <span className="hidden text-[10px] font-normal uppercase tracking-wider text-[#8B7D9E] sm:inline">
            {isEn ? 'Architech' : 'Architech'}
          </span>
        </Link>

        <nav className="flex items-center gap-1 font-mono text-[11px] sm:gap-2 sm:text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-[2px] px-2 py-1.5 text-[#A19BAF] transition-colors hover:text-[#C084FC]"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            {isEn ? 'Canvas' : 'Tuval'}
          </Link>
          {isEn ? (
            <>
              <Link
                href="/en/benchmark"
                className="flex items-center gap-1.5 rounded-[2px] px-2 py-1.5 text-[#A19BAF] transition-colors hover:text-[#C084FC]"
              >
                <Activity className="h-3.5 w-3.5" />
                Benchmark
              </Link>
              <Link
                href="/en/press"
                className="flex items-center gap-1.5 rounded-[2px] px-2 py-1.5 text-[#A19BAF] transition-colors hover:text-[#C084FC]"
              >
                <FileText className="h-3.5 w-3.5" />
                Press
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/benchmark"
                className="flex items-center gap-1.5 rounded-[2px] px-2 py-1.5 text-[#A19BAF] transition-colors hover:text-[#C084FC]"
              >
                <Activity className="h-3.5 w-3.5" />
                Benchmark
              </Link>
              <Link
                href="/press"
                className="flex items-center gap-1.5 rounded-[2px] px-2 py-1.5 text-[#A19BAF] transition-colors hover:text-[#C084FC]"
              >
                <FileText className="h-3.5 w-3.5" />
                Basın
              </Link>
            </>
          )}

          <Link
            href={altHref}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2 py-1.5 text-[#C084FC] transition-colors hover:border-[#8B5CF6]"
            aria-label={isEn ? 'Türkçeye geç' : 'Switch to English'}
          >
            <Languages className="h-3.5 w-3.5" />
            {isEn ? 'TR' : 'EN'}
          </Link>

          <a
            href="https://github.com/Xivizley/xivizley-architech"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2 py-1.5 text-[#F5F3FF] transition-colors hover:border-[#8B5CF6]"
            aria-label="GitHub repository"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
