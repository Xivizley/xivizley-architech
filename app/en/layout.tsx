// ============================================================
// XIVIZLEY — English International Layout (SEO & Hreflang)
// app/en/layout.tsx
// ============================================================

import type { Metadata } from 'next';
import { HtmlLangSync } from '@/components/shared/HtmlLangSync';

export const metadata: Metadata = {
  title: 'XIVIZLEY — Visual Docker Architecture & Deterministic Port Conflict Radar',
  description:
    'Visual Docker Compose architect with deterministic port conflict detection, DIN EN 61082-1 hardware sizing radar, and 1-click SSH deployment for 134+ containers. Free & MIT open-source.',
  keywords: [
    'visual docker compose builder',
    'docker compose generator',
    'docker compose gui',
    'docker port conflict resolver',
    'homelab architecture builder',
    'din en 61082-1 architecture spec',
    'self-hosted apps docker',
    'visual homelab designer',
    '1-click vds deploy',
    'self-host docker stacks',
    'supabase self hosted docker compose',
    'pterodactyl docker compose',
    'rustdesk relay docker compose',
  ],
  alternates: {
    canonical: 'https://xivizley.com.tr/en',
    languages: {
      'en-US': 'https://xivizley.com.tr/en',
      'tr-TR': 'https://xivizley.com.tr',
      'x-default': 'https://xivizley.com.tr/en',
    },
  },
  openGraph: {
    title: 'XIVIZLEY — Visual Docker Architecture & Deterministic Port Conflict Radar',
    description:
      'Drag-and-drop 134+ Docker services, resolve port conflicts before they break your server, and generate 1-click SSH deploy scripts.',
    url: 'https://xivizley.com.tr/en',
    siteName: 'XIVIZLEY',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://xivizley.com.tr/api/og?lang=en',
        width: 1200,
        height: 630,
        alt: 'XIVIZLEY — Visual Docker Architecture & Deterministic Port Conflict Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XIVIZLEY — Visual Docker Architecture & Deterministic Port Conflict Radar',
    description:
      'Drag-and-drop 134+ Docker services, resolve port conflicts deterministically, and generate 1-click SSH deploy scripts.',
    creator: '@xivizley',
    images: ['https://xivizley.com.tr/api/og?lang=en'],
  },
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const englishPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://xivizley.com.tr/en#webpage',
    url: 'https://xivizley.com.tr/en',
    name: 'XIVIZLEY — Visual Docker Architecture & Deterministic Port Conflict Radar',
    inLanguage: 'en-US',
    isPartOf: { '@id': 'https://xivizley.com.tr/#website' },
    about: { '@id': 'https://xivizley.com.tr/#webapp' },
    description:
      'XIVIZLEY is a free, MIT-licensed visual Docker Compose architect: 134 self-hosted modules, 33 curated stacks, deterministic port conflict resolution, and 1-click SSH deployment.',
  };

  return (
    <>
      <HtmlLangSync lang="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(englishPageSchema) }}
      />
      {children}
    </>
  );
}
