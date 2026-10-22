// ============================================================
// XIVIZLEY — English Overview (/en)
// Self-contained landing for the MIT-licensed public core.
// No tracking, no external API calls, no client state.
// ============================================================

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/shared/PublicNav';
import { PRESS_KIT } from '@/lib/data/press';

export const metadata: Metadata = {
  title: 'XIVIZLEY Architech — Visual Docker Compose Architect (MIT)',
  description:
    'Open-source visual Docker Compose architect with deterministic port conflict resolution, DIN 40719 hardware sizing and 1-click SSH deployment for 134+ self-hosted services.',
  alternates: {
    canonical: 'https://xivizley.com.tr/en',
    languages: {
      'en-US': 'https://xivizley.com.tr/en',
      'tr-TR': 'https://xivizley.com.tr',
      'x-default': 'https://xivizley.com.tr/en',
    },
  },
};

const pillars = [
  {
    title: '134+ Docker Modules',
    detail: 'Pre-configured environment templates, volumes and default ports for self-hosted services.',
  },
  {
    title: 'Deterministic Port Engine',
    detail: 'Host port collisions are detected across TCP/UDP before anything touches your server.',
  },
  {
    title: '33 Curated Stacks',
    detail: 'Media, DevOps, privacy, storage and gaming architectures loaded with one click.',
  },
  {
    title: 'Offline & Client-Side',
    detail: 'State lives in your browser. The core works without an account or backend.',
  },
];

export default function EnglishHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#090514] font-sans text-[#F5F3FF] antialiased selection:bg-[#8B5CF6]/30 selection:text-white">
      <PublicNav lang="en" altHref="/" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6">
        <div className="mb-8 border border-[#2B1A42] bg-[#0D0719] p-6">
          <span className="mb-3 inline-block rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2 py-0.5 font-mono text-[11px] text-[#C084FC]">
            [ MIT LICENSED · SELF-HOSTABLE ]
          </span>
          <h1
            className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Visual Docker architecture, verified before deployment
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-[#A19BAF]">
            XIVIZLEY Architech turns a browser canvas into production-ready Docker Compose
            architecture. Connect 134 self-hosted services, let the deterministic engine resolve
            port collisions, size the host hardware against verified benchmarks, and export
            blueprints, Kubernetes manifests and deployment scripts — without sending project data
            to a backend.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-[2px] bg-[#8B5CF6] px-5 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#7C3AED]"
            >
              Open the Canvas →
            </Link>
            <Link
              href="/en/benchmark"
              className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-5 py-2 font-mono text-xs text-[#F5F3FF] transition-colors hover:border-[#8B5CF6] hover:text-[#C084FC]"
            >
              Hardware Benchmark →
            </Link>
            <Link
              href="/en/press"
              className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-5 py-2 font-mono text-xs text-[#F5F3FF] transition-colors hover:border-[#8B5CF6] hover:text-[#C084FC]"
            >
              Press Kit →
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[2px] border border-[#2B1A42] bg-[#0D0719] p-5">
              <h2 className="mb-1 font-mono text-sm font-bold text-[#F5F3FF]">{pillar.title}</h2>
              <p className="text-xs leading-relaxed text-[#A19BAF]">{pillar.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] p-6">
          <h2
            className="mb-2 text-xl font-bold text-[#F5F3FF]"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Run it locally
          </h2>
          <p className="mb-4 text-sm text-[#A19BAF]">
            Clone the repository and start the container — no cloud dependency required.
          </p>
          <pre className="overflow-x-auto rounded-[2px] border border-[#2B1A42] bg-[#06030D] p-3 font-mono text-[12px] text-emerald-400">
{`git clone https://github.com/Xivizley/xivizley-architect.git
cd xivizley-architect
docker compose up -d`}
          </pre>
        </div>
      </main>

      <footer className="border-t border-[#2B1A42] py-6">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 font-mono text-[11px] text-[#8B7D9E] sm:px-6">
          <span>MIT License · Built by {PRESS_KIT.founder.name}</span>
          <span>
            Turkish edition:{' '}
            <Link href="/" className="text-[#A78BFA] hover:underline">
              xivizley.com.tr
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
