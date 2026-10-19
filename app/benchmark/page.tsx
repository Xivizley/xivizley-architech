// ============================================================
// XIVIZLEY — DIN 40719 Verified Hardware Benchmark Report (/benchmark)
// Obsidian Violet & DIN 40719 Industrial Hardware Specification
// Direct Measurements from XIVIZLEY Bursa PenDC Tier-3 Hardware
// ============================================================

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/shared/PublicNav';
import { HtmlLangSync } from '@/components/shared/HtmlLangSync';
import { VERIFIED_BENCHMARK_DATA } from '@/lib/data/benchmark';

export const metadata: Metadata = {
  title: 'VDS Donanım ve Altyapı Doğrulama Şartnamesi — XIVIZLEY',
  description:
    'Bursa PenDC Tier-3 test sunucusu üzerinde doğrudan çalıştırılmış fio, sysbench ve ağ gecikmesi ölçüm raporu. Bağımsız ve yeniden üretilebilir donanım telemetrisi.',
  openGraph: {
    title: 'VDS Donanım ve Altyapı Doğrulama Şartnamesi — XIVIZLEY',
    description:
      'fio, sysbench ve ağ gecikmesi ölçümlerinin ham çıktılarıyla birlikte yayınlandığı, yeniden üretilebilir donanım doğrulama raporu.',
    url: 'https://xivizley.com.tr/benchmark',
    siteName: 'XIVIZLEY',
    type: 'article',
    images: [
      {
        url: 'https://xivizley.com.tr/api/og',
        width: 1200,
        height: 630,
        alt: 'XIVIZLEY VDS Donanım Doğrulama Raporu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VDS Donanım ve Altyapı Doğrulama Şartnamesi — XIVIZLEY',
    description:
      'fio, sysbench ve ağ gecikmesi ölçümlerinin ham çıktılarıyla birlikte yayınlandığı, yeniden üretilebilir donanım doğrulama raporu.',
    creator: '@xivizley',
    images: ['https://xivizley.com.tr/api/og'],
  },
  alternates: {
    canonical: 'https://xivizley.com.tr/benchmark',
    languages: {
      'tr-TR': 'https://xivizley.com.tr/benchmark',
      'en-US': 'https://xivizley.com.tr/en/benchmark',
      'x-default': 'https://xivizley.com.tr/en/benchmark',
    },
  },
};

export default function BenchmarkPage() {
  const data = VERIFIED_BENCHMARK_DATA;

  return (
    <div className="flex min-h-screen flex-col bg-[#090514] text-[#F5F3FF] selection:bg-[#8B5CF6]/30 selection:text-white font-sans antialiased">
      <PublicNav lang="tr" altHref="/en/benchmark" />
      <HtmlLangSync lang="tr" />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
        {/* DIN 40719 Title Block / Header */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 border-l border-b border-[#2B1A42] bg-[#120A21] px-3 py-1 font-mono text-[10px] text-[#A78BFA] uppercase tracking-wider">
            DIN 40719 // SPEC-2026-R1
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#C084FC]">
              [ BAĞIMSIZ DONANIM RAPORU ]
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              ● DOĞRULANMIŞ CANLI VERİ
            </span>
            <span className="font-mono text-[11px] text-[#8B7D9E]">
              Test Tarihi: {data.testEnvironment.testDate}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-4xl font-bold text-[#F5F3FF] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            VDS Donanım ve Sistem Altyapısı Doğrulama Şartnamesi
          </h1>
          <p className="text-sm sm:text-base text-[#A19BAF] max-w-3xl leading-relaxed">
            Bu belge, XIVIZLEY sistem mimarisi motorunun ve 134 Docker servisinin Linux VDS üzerindeki
            gerçek donanım davranışını belgelemek amacıyla, canlı sunucu üzerinde doğrudan çalıştırılan
            <span className="font-mono text-[#C084FC]"> fio 3.36</span>,{' '}
            <span className="font-mono text-[#C084FC]">sysbench 1.0.20</span> ve ağ gecikmesi ölçüm
            sonuçlarını içerir.
          </p>

          <div className="mt-4 pt-4 border-t border-[#2B1A42]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
            <div>
              <span className="text-[#8B7D9E] block">TEST EDİLEN IP:</span>
              <span className="text-[#F5F3FF] font-bold">{data.testEnvironment.ipAddress}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">ALTYAPI SAĞLAYICI:</span>
              <span className="text-[#F5F3FF]">{data.testEnvironment.organization}</span>
              <span className="text-[#8B7D9E] block mt-0.5">ASN: {data.testEnvironment.asn}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">VERİ MERKEZİ:</span>
              <span className="text-[#F5F3FF]">{data.testEnvironment.datacenter}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">İŞLETİM SİSTEMİ:</span>
              <span className="text-[#F5F3FF]">{data.testEnvironment.os}</span>
            </div>
          </div>
        </div>

        {/* Tarafsızlık Bildirimi */}
        <div className="border border-[#2B1A42] bg-[#120A21] rounded-[2px] p-4 mb-8 font-mono text-[12px] text-[#A19BAF] flex items-start gap-3">
          <span className="text-[#8B5CF6] text-base">ℹ️</span>
          <div>
            <strong className="text-[#F5F3FF]">Mühendislik ve Tarafsızlık İlkesi:</strong> Bu rapordaki ölçümler,
            araştırma ekibimiz tarafından bağımsız olarak kiralanan sunucu üzerinde bizzat koşturulmuştur.
            Sunucu sağlayıcısıyla herhangi bir resmi ortaklık, reklam veya ticari onay ilişkisi içermez.
            Test metodolojisi tamamen şeffaf ve herkes tarafından yeniden üretilebilir biçimde sunulmuştur.
          </div>
        </div>

        {/* 4 Ana Metrik Kartı Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. CPU Throughput */}
          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              [ CPU HESAPLAMA GÜCÜ ]
            </span>
            <div className="text-2xl font-bold font-mono text-[#F5F3FF] mb-1">
              {data.metrics.cpuSysbenchEventsPerSec.toLocaleString('tr-TR')} <span className="text-sm font-normal text-[#8B7D9E]">evt/s</span>
            </div>
            <p className="text-[12px] text-[#A19BAF]">
              4 vCPU paralel işleme kapasitesi (sysbench prime 10.000). Ortalama gecikme: <span className="font-mono text-[#C084FC]">{data.metrics.cpuAvgLatencyMs} ms</span>.
            </p>
          </div>

          {/* 2. 4K Random IOPS */}
          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              [ DİSK 4K TOPLAM IOPS ]
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
              {data.metrics.diskTotal4kIops.toLocaleString('tr-TR')} <span className="text-sm font-normal text-[#8B7D9E]">IOPS</span>
            </div>
            <p className="text-[12px] text-[#A19BAF]">
              libaio iodepth=16 ile ölçülen 4K rastgele okuma ({data.metrics.disk4kRandomReadIops.toLocaleString('tr-TR')}) ve yazma ({data.metrics.disk4kRandomWriteIops.toLocaleString('tr-TR')}) toplamı.
            </p>
          </div>

          {/* 3. Sequential Write / Read */}
          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              [ ARDIŞIK DİSK VERİMİ ]
            </span>
            <div className="text-2xl font-bold font-mono text-[#C084FC] mb-1">
              {data.metrics.diskSeqWriteMBs} <span className="text-sm font-normal text-[#8B7D9E]">MB/s</span>
            </div>
            <p className="text-[12px] text-[#A19BAF]">
              1M blok boyutuyla doğrudan ardışık yazma hızı. Ardışık okuma hızı: <span className="font-mono text-[#F5F3FF]">{data.metrics.diskSeqReadMBs} MB/s</span>.
            </p>
          </div>

          {/* 4. Network Latency */}
          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              [ AĞ GECİKMESİ (RTT) ]
            </span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mb-1">
              {data.metrics.networkAvgLatencyMs} <span className="text-sm font-normal text-[#8B7D9E]">ms</span>
            </div>
            <p className="text-[12px] text-[#A19BAF]">
              Bursa PenDC çıkışlı yerel omurga bağlantısı üzerinden 1.1.1.1 paket gidiş-dönüş süresi.
            </p>
          </div>
        </div>

        {/* Ayrıntılı Ölçüm Tablosu */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-4"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Ayrıntılı Donanım ve Telemetri Matrisi
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-[#2B1A42] text-[#8B7D9E]">
                  <th className="py-2.5 px-3">BİLEŞEN</th>
                  <th className="py-2.5 px-3">PARAMETRE</th>
                  <th className="py-2.5 px-3">DOĞRULANAN DEĞER</th>
                  <th className="py-2.5 px-3">ÖLÇÜM YÖNTEMİ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B1A42]/50 text-[#F5F3FF]">
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">İşlemci</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Model / vCPU</td>
                  <td className="py-2.5 px-3">{data.hardware.cpuModel} ({data.hardware.vCpuCount} Çekirdek)</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">lscpu</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">İşlemci</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Sysbench İş Hacmi</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{data.metrics.cpuSysbenchEventsPerSec.toLocaleString('tr-TR')} olay/sn</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">sysbench --threads=4 --time=5</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Bellek (RAM)</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Toplam / Kullanılan</td>
                  <td className="py-2.5 px-3">{data.hardware.ramTotalGB} GB Toplam / {data.hardware.ramUsedGB} GB Aktif</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">free -h</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Depolama</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Aygıt & Kapasite</td>
                  <td className="py-2.5 px-3">{data.hardware.diskDevice} ({data.hardware.diskTotalGB} GB)</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">lsblk / df -h</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Depolama</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">4K Rastgele Okuma IOPS</td>
                  <td className="py-2.5 px-3 text-emerald-400">{data.metrics.disk4kRandomReadIops.toLocaleString('tr-TR')} IOPS ({data.metrics.disk4kRandomReadBwMB} MB/s)</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">fio libaio iodepth=16</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Depolama</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">4K Rastgele Yazma IOPS</td>
                  <td className="py-2.5 px-3 text-emerald-400">{data.metrics.disk4kRandomWriteIops.toLocaleString('tr-TR')} IOPS ({data.metrics.disk4kRandomWriteBwMB} MB/s)</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">fio libaio iodepth=16</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Depolama</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Ardışık Okuma (1M)</td>
                  <td className="py-2.5 px-3 text-[#C084FC]">{data.metrics.diskSeqReadMBs} MB/s</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">fio direct=1 bs=1M</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Depolama</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Ardışık Yazma (1M)</td>
                  <td className="py-2.5 px-3 text-[#C084FC]">{data.metrics.diskSeqWriteMBs} MB/s</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">fio direct=1 bs=1M</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Ağ</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Paket Gidiş-Dönüş (RTT)</td>
                  <td className="py-2.5 px-3 text-cyan-400">{data.metrics.networkAvgLatencyMs} ms</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">ping -c 5 1.1.1.1</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#A78BFA]">Konteyner</td>
                  <td className="py-2.5 px-3 text-[#A19BAF]">Docker Durumu</td>
                  <td className="py-2.5 px-3 text-emerald-400">{data.metrics.dockerStatus}</td>
                  <td className="py-2.5 px-3 text-[#8B7D9E]">docker info</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Kanıt Kaydı: Ham Terminal Çıktıları */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-xl font-bold text-[#F5F3FF]"
              style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
            >
              Terminal Kanıt Kaydı (Raw Verification Logs)
            </h2>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-[2px]">
              SHA-256 DOĞRULANABİLİR
            </span>
          </div>
          <p className="text-xs text-[#A19BAF] mb-4">
            Aşağıdaki loglar, 16 Ekim 2026 tarihinde sunucu terminalinden doğrudan kaydedilmiş ham test
            çıktılarıdır. Herhangi bir düzenleme yapılmamıştır.
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-mono text-[11px] text-[#A78BFA] block mb-1">
                1. sysbench CPU Testi Ham Çıktısı:
              </span>
              <pre className="border border-[#2B1A42] bg-[#06030D] rounded-[2px] p-3 font-mono text-[11px] text-[#C4B5FD] overflow-x-auto leading-relaxed">
                {data.rawLogs.sysbenchOutput}
              </pre>
            </div>

            <div>
              <span className="font-mono text-[11px] text-[#A78BFA] block mb-1">
                2. fio 4K Random Read/Write Testi Ham Çıktısı:
              </span>
              <pre className="border border-[#2B1A42] bg-[#06030D] rounded-[2px] p-3 font-mono text-[11px] text-[#C4B5FD] overflow-x-auto leading-relaxed">
                {data.rawLogs.fioRandRwOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* Güvenli ve Şeffaf Kurulum Rehberi (curl | bash içermez) */}
        <div className="border border-[#2B1A42] bg-[#120A21] rounded-[2px] p-6">
          <h2
            className="text-xl font-bold text-[#F5F3FF] mb-2"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            Açık Kaynak ve Denetlenebilir Kurulum
          </h2>
          <p className="text-sm text-[#A19BAF] mb-4">
            XIVIZLEY, güvenlik ilkeleri gereğince körü körüne komut çalıştırma (ör. borulama yöntemi) yerine,
            her satırı açıkça incelenebilir açık kaynaklı paketler sunar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">
                Yöntem A: XIVIZLEY Engine (Resmi NPM / NPX Dağıtım Motoru)
              </span>
              <p className="text-xs text-[#8B7D9E] mb-2">
                Açık kaynaklı dağıtım motorunu doğrudan terminalinizde güvenle başlatın:
              </p>
              <pre className="border border-[#2B1A42] bg-[#06030D] p-2.5 rounded-[2px] font-mono text-[12px] text-emerald-400">
                npx xivizley
              </pre>
              <span className="text-[10px] text-[#8B7D9E] block mt-2 font-mono">
                Kaynak Kod:{' '}
                <a
                  href="https://github.com/Xivizley/xivizley-cli"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A78BFA] hover:underline"
                >
                  github.com/Xivizley/xivizley-cli
                </a>
              </span>
            </div>

            <div className="border border-[#2B1A42] bg-[#090514] rounded-[2px] p-4">
              <span className="font-mono text-[11px] text-[#C084FC] block mb-1">
                Yöntem B: XIVIZLEY Architech (Görsel Mimarlık Tuvali)
              </span>
              <p className="text-xs text-[#8B7D9E] mb-2">
                Herhangi bir yazılım kurmadan tarayıcınızda 134 servisi görsel tuvalde bağlayın:
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full py-2 px-3 border border-[#8B5CF6] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-mono text-[12px] rounded-[2px] transition-colors"
              >
                XIVIZLEY Architech Tuvalini Aç ➔
              </Link>
              <span className="text-[10px] text-[#8B7D9E] block mt-2 font-mono">
                Sıfır Kurulum Gerektirir • Tamamen İstemci Taraflı
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
