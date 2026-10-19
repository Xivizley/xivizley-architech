// ============================================================
// XIVIZLEY — Press & Media Kit Page (/press)
// Obsidian Violet & DIN 40719 Editorial Standard
// Institutional Presentation for Journalists, Partners & Media
// ============================================================

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/shared/PublicNav';
import { HtmlLangSync } from '@/components/shared/HtmlLangSync';
import { PRESS_KIT } from '@/lib/data/press';

export const metadata: Metadata = {
  title: 'Basın & Tanıtım Kiti — XIVIZLEY',
  description:
    'XIVIZLEY resmi basın kiti, proje özeti, kurucu bilgileri, doğrulanmış altyapı telemetrisi ve medya varlıkları. TÜBİTAK 2204-A Lise Araştırma Projesi.',
  openGraph: {
    title: 'Basın & Tanıtım Kiti — XIVIZLEY',
    description:
      'Proje özeti, kurucu bilgileri, doğrulanmış altyapı telemetrisi ve medya varlıkları ile XIVIZLEY resmi basın kiti.',
    url: 'https://xivizley.com.tr/press',
    siteName: 'XIVIZLEY',
    type: 'website',
    images: [
      {
        url: 'https://xivizley.com.tr/api/og',
        width: 1200,
        height: 630,
        alt: 'XIVIZLEY Basın ve Tanıtım Kiti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basın & Tanıtım Kiti — XIVIZLEY',
    description:
      'Proje özeti, kurucu bilgileri, doğrulanmış altyapı telemetrisi ve medya varlıkları ile XIVIZLEY resmi basın kiti.',
    creator: '@xivizley',
    images: ['https://xivizley.com.tr/api/og'],
  },
  alternates: {
    canonical: 'https://xivizley.com.tr/press',
    languages: {
      'tr-TR': 'https://xivizley.com.tr/press',
      'en-US': 'https://xivizley.com.tr/en/press',
      'x-default': 'https://xivizley.com.tr/en/press',
    },
  },
};

export default function PressPage() {
  const kit = PRESS_KIT;

  return (
    <div className="flex min-h-screen flex-col bg-[#090514] text-[#F5F3FF] selection:bg-[#8B5CF6]/30 selection:text-white font-sans antialiased">
      <PublicNav lang="tr" altHref="/en/press" />
      <HtmlLangSync lang="tr" />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-12">
        {/* DIN 40719 Header */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8 relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#C084FC]">
              [ RESMİ BASIN & MEDYA KİTİ ]
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#A78BFA]">
              TÜBİTAK 2204-A PROJESİ
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold text-[#F5F3FF] tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            XIVIZLEY Basın & Tanıtım Dosyası
          </h1>
          <p className="text-base text-[#A19BAF] max-w-3xl leading-relaxed mb-4">
            {kit.tagline}
          </p>

          <div className="border-t border-[#2B1A42]/60 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[12px]">
            <div>
              <span className="text-[#8B7D9E] block">PROJE GELİŞTİRİCİSİ:</span>
              <span className="text-[#F5F3FF] font-bold">{kit.founder.name}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">EĞİTİM / KAPSAM:</span>
              <span className="text-[#F5F3FF]">{kit.founder.title}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">LOKASYON:</span>
              <span className="text-[#F5F3FF]">{kit.founder.location}</span>
            </div>
          </div>
        </div>

        {/* 1 Paragraflık Özet (Gazeteciler & Editörler İçin) */}
        <div className="border border-[#2B1A42] bg-[#120A21] rounded-[2px] p-6 mb-8">
          <span className="font-mono text-[11px] text-[#A78BFA] uppercase tracking-wider block mb-2">
            [ EDİTÖR ÖZETİ // 1 PARAGRAF ]
          </span>
          <p className="text-sm sm:text-base text-[#F5F3FF] leading-relaxed italic border-l-2 border-[#8B5CF6] pl-4 py-1">
            &ldquo;{kit.oneParagraphSummary}&rdquo;
          </p>
        </div>

        {/* Temel Gerçekler Tablosu (Key Facts) */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-4"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Temel Proje Göstergeleri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kit.keyFacts.map((fact, idx) => (
              <div key={idx} className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
                <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
                  {fact.label}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400 block mb-1">
                  {fact.value}
                </span>
                <p className="text-xs text-[#A19BAF] leading-relaxed">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ürün Ailesi & Modüler Ekosistem Mimarisi */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-4"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            XIVIZLEY Ürün Mimarisi ve Ekosistem Direkleri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kit.products?.map((prod, idx) => (
              <div key={idx} className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold font-mono text-[#F5F3FF] text-sm">
                    {prod.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#C084FC] px-1.5 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42]">
                    {prod.badge}
                  </span>
                </div>
                <p className="text-xs text-[#A19BAF] leading-relaxed">{prod.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Doğrulanan Test Ortamı Kartı */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-xl font-bold text-[#F5F3FF]"
              style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
            >
              Bağımsız Test ve Doğrulama Ortamı
            </h2>
            <Link
              href="/benchmark"
              className="font-mono text-[11px] text-[#A78BFA] hover:text-[#C084FC] underline"
            >
              Tam Benchmark Raporunu İncele ➔
            </Link>
          </div>

          <div className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4 font-mono text-[12px] space-y-2">
            <div className="flex flex-wrap justify-between gap-2 border-b border-[#2B1A42]/50 pb-2">
              <span className="text-[#8B7D9E]">TEST EDİLEN ALTYAPI:</span>
              <span className="text-[#F5F3FF] font-bold">{kit.verifiedTestingEnvironment.provider}</span>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-b border-[#2B1A42]/50 pb-2">
              <span className="text-[#8B7D9E]">VERİ MERKEZİ:</span>
              <span className="text-[#F5F3FF]">{kit.verifiedTestingEnvironment.datacenter}</span>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-b border-[#2B1A42]/50 pb-2">
              <span className="text-[#8B7D9E]">DOĞRULANAN DEĞERLER:</span>
              <span className="text-emerald-400">{kit.verifiedTestingEnvironment.verifiedThroughput}</span>
            </div>
            <p className="text-[11px] text-[#8B7D9E] pt-1">
              {kit.verifiedTestingEnvironment.note}
            </p>
          </div>
        </div>

        {/* Açık Kaynak CLI ve İndirmeler */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-3"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Açık Kaynak CLI ve Medya Varlıkları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">
                İnteraktif CLI Motoru (NPM / NPX)
              </span>
              <p className="text-xs text-[#8B7D9E] mb-2">
                Açık kaynaklı komut satırı arayüzü:
              </p>
              <pre className="border border-[#2B1A42] bg-[#06030D] p-2 rounded-[2px] font-mono text-[12px] text-emerald-400 mb-2">
                {kit.openSourceCli.quickCommand}
              </pre>
              <a
                href={kit.openSourceCli.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-[#A78BFA] hover:underline"
              >
                GitHub Deposu ➔
              </a>
            </div>

            <div className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">
                Görsel Varlıklar & Logo
              </span>
              <p className="text-xs text-[#8B7D9E] mb-3">
                Basın ve yayın organları için vektörel SVG logomuz:
              </p>
              <a
                href="https://xivizley.com.tr/icon.svg"
                download="xivizley-logo.svg"
                className="inline-flex items-center justify-center py-2 px-3 border border-[#8B5CF6] bg-[#120A21] hover:bg-[#1E1235] text-[#C084FC] font-mono text-[12px] rounded-[2px] transition-colors"
              >
                📥 Vektörel Logo İndir (.svg)
              </a>
            </div>
          </div>
        </div>

        {/* İletişim Kanalları (app/contact ile birebir uyumlu) */}
        <div className="border border-[#2B1A42] bg-[#120A21] rounded-[2px] p-6">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-2"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Resmi İletişim Kanalları
          </h2>
          <p className="text-xs text-[#A19BAF] mb-4">
            Röportaj, basın bülteni veya akademik iş birliği talepleri için resmi iletişim adreslerimiz:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kit.contacts.map((c, i) => (
              <div key={i} className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
                <span className="font-mono text-[11px] text-[#A78BFA] block mb-1">{c.type}</span>
                <a
                  href={`mailto:${c.email}`}
                  className="font-mono text-sm text-[#F5F3FF] hover:text-[#C084FC] font-bold block mb-1"
                >
                  {c.email}
                </a>
                <p className="text-xs text-[#8B7D9E]">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
