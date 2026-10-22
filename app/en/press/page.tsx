// ============================================================
// XIVIZLEY — Press & Media Kit Page (/en/press)
// Obsidian Violet & DIN EN 61082-1 Editorial Standard
// Institutional Presentation for Journalists, Partners & Media
// ============================================================

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { PRESS_KIT } from '@/lib/data/press';

export const metadata: Metadata = {
  title: 'Press & Media Kit — XIVIZLEY',
  description:
    'Official media kit, project overview, founder background, verified infrastructure telemetry, and brand assets for XIVIZLEY.',
  openGraph: {
    title: 'Press & Media Kit — XIVIZLEY',
    description:
      'Official project overview, founder background, and verified hardware telemetry for XIVIZLEY.',
    url: 'https://xivizley.com.tr/en/press',
    siteName: 'XIVIZLEY',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://xivizley.com.tr/api/og?lang=en',
        width: 1200,
        height: 630,
        alt: 'XIVIZLEY Press and Media Kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Press & Media Kit — XIVIZLEY',
    description:
      'Official project overview, founder background, and verified hardware telemetry for XIVIZLEY.',
    creator: '@xivizley',
    images: ['https://xivizley.com.tr/api/og?lang=en'],
  },
  alternates: {
    canonical: 'https://xivizley.com.tr/en/press',
    languages: {
      'en-US': 'https://xivizley.com.tr/en/press',
      'tr-TR': 'https://xivizley.com.tr/press',
      'x-default': 'https://xivizley.com.tr/en/press',
    },
  },
};

export default function EnglishPressPage() {
  const kit = PRESS_KIT;

  return (
    <div className="flex min-h-screen flex-col bg-[#090514] text-[#F5F3FF] selection:bg-[#8B5CF6]/30 selection:text-white font-sans antialiased">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-12">
        {/* DIN EN 61082-1 Header */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8 relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#C084FC]">
              [ OFFICIAL PRESS & MEDIA KIT ]
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#A78BFA]">
              TÜBİTAK 2204-A PROJECT
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold text-[#F5F3FF] tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            XIVIZLEY Media Dossier & Press Kit
          </h1>
          <p className="text-base text-[#A19BAF] max-w-3xl leading-relaxed mb-4">
            Visual Design and Deployment Station for 134+ Docker Services and 33 Pre-Engineered Stacks
          </p>

          <div className="border-t border-[#2B1A42]/60 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[12px]">
            <div>
              <span className="text-[#8B7D9E] block">LEAD ARCHITECT:</span>
              <span className="text-[#F5F3FF] font-bold">{kit.founder.name}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">EDUCATION / SCOPE:</span>
              <span className="text-[#F5F3FF]">9th Grade High School Student (Bursa)</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">RESEARCH ACCREDITATION:</span>
              <span className="text-[#F5F3FF]">TÜBİTAK 2204-A National Research</span>
            </div>
          </div>
        </div>

        {/* 1-Paragraph Summary for Journalists */}
        <div className="border border-[#2B1A42] bg-[#120A21] rounded-[2px] p-6 mb-8">
          <span className="font-mono text-[11px] text-[#A78BFA] uppercase tracking-wider block mb-2">
            [ EXECUTIVE SUMMARY // 1 PARAGRAPH ]
          </span>
          <p className="text-sm sm:text-base text-[#F5F3FF] leading-relaxed italic border-l-2 border-[#8B5CF6] pl-4 py-1">
            &ldquo;XIVIZLEY is an open-source (MIT) system architecture platform developed under the TÜBİTAK 2204-A research program. It connects 134 popular Docker services on a visual drag-and-drop schematic canvas, deterministically solves port conflicts before server deployment, and exports industrial DIN EN 61082-1 specification sheets, Kubernetes manifests, Helm 3 packages, and automated disaster recovery scripts for Linux and homelab servers.&rdquo;
          </p>
        </div>

        {/* Key Product Facts */}
        <div className="mb-8">
          <h2
            className="text-xl sm:text-2xl font-bold text-[#F5F3FF] mb-4"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Key Project Milestones & Technical Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">Catalog Scope</span>
              <span className="text-lg font-bold font-mono text-[#F5F3FF] block mb-1">134 Modules & 33 Stacks</span>
              <p className="text-xs text-[#A19BAF] font-mono">
                From Nextcloud, Vaultwarden, and Jellyfin to PostgreSQL, Supabase, and Ollama AI.
              </p>
            </div>
            <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">Conflict Resolver</span>
              <span className="text-lg font-bold font-mono text-[#F5F3FF] block mb-1">Deterministic Zero-Collision</span>
              <p className="text-xs text-[#A19BAF] font-mono">
                Catches overlapping ports and network collisions in browser before touching the host.
              </p>
            </div>
            <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">Industrial Export</span>
              <span className="text-lg font-bold font-mono text-[#F5F3FF] block mb-1">DIN EN 61082-1, K8s & Helm 3</span>
              <p className="text-xs text-[#A19BAF] font-mono">
                Produces printable engineering blueprints and cloud-native Kubernetes packages.
              </p>
            </div>
            <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">Open Source License</span>
              <span className="text-lg font-bold font-mono text-[#F5F3FF] block mb-1">100% MIT License</span>
              <p className="text-xs text-[#A19BAF] font-mono">
                Zero data collection, client-side Zustand state, fully auditable codebase.
              </p>
            </div>
          </div>
        </div>

        {/* Media & Press Inquiries */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-3"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Direct Media & Editorial Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-[#120A21] border border-[#2B1A42] p-4 rounded-[2px]">
              <span className="text-[#8B7D9E] block mb-1">General Inquiries & Press:</span>
              <a href="mailto:alperen@xivizley.com.tr" className="text-[#C084FC] font-bold hover:underline">
                alperen@xivizley.com.tr
              </a>
              <p className="text-[#8B7D9E] text-[11px] mt-1">Direct contact with the founder.</p>
            </div>
            <div className="bg-[#120A21] border border-[#2B1A42] p-4 rounded-[2px]">
              <span className="text-[#8B7D9E] block mb-1">Technical Support & Community:</span>
              <a href="mailto:destek@xivizley.com.tr" className="text-[#C084FC] font-bold hover:underline">
                destek@xivizley.com.tr
              </a>
              <p className="text-[#8B7D9E] text-[11px] mt-1">Platform and architecture questions.</p>
            </div>
          </div>
        </div>

        {/* Navigation & Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#2B1A42]">
          <Link
            href="/en"
            className="font-mono text-xs text-[#A19BAF] hover:text-[#C084FC] transition-colors"
          >
            ← Return to Homepage
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/en/benchmark"
              className="px-4 py-2 font-mono text-xs border border-[#2B1A42] bg-[#120A21] text-[#F5F3FF] hover:border-[#8B5CF6] hover:text-[#C084FC] transition-colors rounded-[2px]"
            >
              Hardware Benchmark Spec →
            </Link>
            <Link
              href="/architect"
              className="px-5 py-2 font-mono text-xs font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors rounded-[2px]"
            >
              Open Architecture Canvas →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
