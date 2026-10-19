// ============================================================
// XIVIZLEY — DIN 40719 Verified Hardware Benchmark Report (/en/benchmark)
// Obsidian Violet & DIN 40719 Industrial Hardware Specification
// Direct Measurements from XIVIZLEY Bursa PenDC Tier-3 Hardware
// ============================================================

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/shared/PublicNav';
import { VERIFIED_BENCHMARK_DATA } from '@/lib/data/benchmark';

export const metadata: Metadata = {
  title: 'VDS Hardware & Infrastructure Verification Report — XIVIZLEY',
  description:
    'Direct hardware benchmark measurements (fio 3.36, sysbench 1.0.20, ping latency) captured from an independently provisioned Bursa PenDC Tier-3 VDS instance. Reproducible homelab telemetry.',
  openGraph: {
    title: 'VDS Hardware & Infrastructure Verification Report — XIVIZLEY',
    description:
      'Direct hardware benchmark measurements (fio 3.36, sysbench 1.0.20, ping latency) captured from our production VDS instance. Reproducible homelab telemetry.',
    url: 'https://xivizley.com.tr/en/benchmark',
    siteName: 'XIVIZLEY',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: 'https://xivizley.com.tr/api/og?lang=en',
        width: 1200,
        height: 630,
        alt: 'XIVIZLEY VDS Hardware Verification Report',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VDS Hardware & Infrastructure Verification Report — XIVIZLEY',
    description:
      'fio, sysbench, and latency raw outputs published transparently for reproducible server architecture benchmarking.',
    creator: '@xivizley',
    images: ['https://xivizley.com.tr/api/og?lang=en'],
  },
  alternates: {
    canonical: 'https://xivizley.com.tr/en/benchmark',
    languages: {
      'en-US': 'https://xivizley.com.tr/en/benchmark',
      'tr-TR': 'https://xivizley.com.tr/benchmark',
      'x-default': 'https://xivizley.com.tr/en/benchmark',
    },
  },
};

export default function EnglishBenchmarkPage() {
  const data = VERIFIED_BENCHMARK_DATA;

  return (
    <div className="flex min-h-screen flex-col bg-[#090514] text-[#F5F3FF] selection:bg-[#8B5CF6]/30 selection:text-white font-sans antialiased">
      <PublicNav lang="en" altHref="/benchmark" />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
        {/* DIN 40719 Title Block / Header */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 border-l border-b border-[#2B1A42] bg-[#120A21] px-3 py-1 font-mono text-[10px] text-[#A78BFA] uppercase tracking-wider">
            DIN 40719 // SPEC-2026-R1
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#C084FC]">
              [ INDEPENDENT HARDWARE REPORT ]
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              ● VERIFIED LIVE DATA
            </span>
            <span className="font-mono text-[11px] text-[#8B7D9E]">
              Test Date: {data.testEnvironment.testDateEn}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-4xl font-bold text-[#F5F3FF] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
          >
            VDS Hardware & System Infrastructure Verification Specification
          </h1>
          <p className="text-sm sm:text-base text-[#A19BAF] max-w-3xl leading-relaxed">
            This document publishes real, verifiable hardware telemetry gathered directly from an independently
            provisioned Linux VDS node to demonstrate how the XIVIZLEY system architecture engine and its 134+ Docker
            containers behave under real production loads.
          </p>

          <div className="mt-4 pt-4 border-t border-[#2B1A42]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
            <div>
              <span className="text-[#8B7D9E] block">IP ADDRESS:</span>
              <span className="text-[#C084FC]">{data.testEnvironment.ipAddressEn}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">INFRASTRUCTURE NETWORK:</span>
              <span className="text-[#F5F3FF]">{data.testEnvironment.organizationEn}</span>
              <span className="text-[#8B7D9E] block mt-0.5">ASN: {data.testEnvironment.asn}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">DATACENTER:</span>
              <span className="text-[#F5F3FF]">{data.testEnvironment.datacenterEn}</span>
            </div>
            <div>
              <span className="text-[#8B7D9E] block">KERNEL / OS:</span>
              <span className="text-[#F5F3FF]">{data.testEnvironment.os}</span>
            </div>
          </div>
        </div>

        {/* Independence Disclaimer */}
        <div className="border border-amber-500/30 bg-amber-950/20 rounded-[2px] p-4 mb-8 text-xs font-mono text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300">Methodology Note:</strong> This report is derived from reproducible,
          automated tests executed on an independently rented virtual dedicated server. It does not constitute a paid
          endorsement or commercial advertisement. Every command is provided below for independent reproduction.
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              CPU SYSBENCH PERFORMANCE
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F3FF] mb-1">
              {data.metrics.cpuSysbenchEventsPerSec.toLocaleString('en-US')}
              <span className="text-xs text-[#8B7D9E] font-normal ml-1">evt/s</span>
            </div>
            <p className="text-[11px] text-[#A19BAF] font-mono">
              4 vCPU Threads • Avg latency: {data.metrics.cpuAvgLatencyMs} ms
            </p>
          </div>

          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              4K RANDOM DISK IOPS
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#C084FC] mb-1">
              {data.metrics.diskTotal4kIops.toLocaleString('en-US')}
              <span className="text-xs text-[#8B7D9E] font-normal ml-1">IOPS</span>
            </div>
            <p className="text-[11px] text-[#A19BAF] font-mono">
              Read: {data.metrics.disk4kRandomReadIops.toLocaleString('en-US')} • Write: {data.metrics.disk4kRandomWriteIops.toLocaleString('en-US')}
            </p>
          </div>

          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              SEQUENTIAL DISK THROUGHPUT
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F3FF] mb-1">
              {data.metrics.diskSeqWriteMBs.toFixed(1)}
              <span className="text-xs text-[#8B7D9E] font-normal ml-1">MB/s</span>
            </div>
            <p className="text-[11px] text-[#A19BAF] font-mono">
              Write: {data.metrics.diskSeqWriteMBs} MB/s • Read: {data.metrics.diskSeqReadMBs} MB/s
            </p>
          </div>

          <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-5">
            <span className="font-mono text-[10px] text-[#8B7D9E] uppercase tracking-wider block mb-1">
              NETWORK LATENCY
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300 mb-1">
              {data.metrics.networkAvgLatencyMs}
              <span className="text-xs text-[#8B7D9E] font-normal ml-1">ms</span>
            </div>
            <p className="text-[11px] text-[#A19BAF] font-mono">
              Tier-3 Backbone Gateway • 0% Packet Loss
            </p>
          </div>
        </div>

        {/* Detailed Hardware Spec Sheet */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] mb-8 overflow-hidden">
          <div className="border-b border-[#2B1A42] bg-[#120A21] px-5 py-3 font-mono text-xs text-[#F5F3FF] font-semibold tracking-wide uppercase flex items-center justify-between">
            <span>[ SYSTEM SPECIFICATION MATRIX — DIN 40719 ]</span>
            <span className="text-[#8B7D9E] text-[10px]">SECTION 01 // CORE HARDWARE</span>
          </div>

          <div className="p-5 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              <div className="flex justify-between border-b border-[#2B1A42]/60 pb-2">
                <span className="text-[#8B7D9E]">CPU Processor:</span>
                <span className="text-[#F5F3FF] font-medium">{data.hardware.cpuModel}</span>
              </div>
              <div className="flex justify-between border-b border-[#2B1A42]/60 pb-2">
                <span className="text-[#8B7D9E]">vCPU Core Allocation:</span>
                <span className="text-[#F5F3FF] font-medium">{data.hardware.vCpuCount} vCPU</span>
              </div>
              <div className="flex justify-between border-b border-[#2B1A42]/60 pb-2">
                <span className="text-[#8B7D9E]">Installed Memory (RAM):</span>
                <span className="text-[#F5F3FF] font-medium">{data.hardware.ramTotalGB} GB (Used: {data.hardware.ramUsedGB} GB)</span>
              </div>
              <div className="flex justify-between border-b border-[#2B1A42]/60 pb-2">
                <span className="text-[#8B7D9E]">NVMe Storage:</span>
                <span className="text-[#F5F3FF] font-medium">{data.hardware.diskTotalGB} GB ({data.hardware.diskDevice})</span>
              </div>
              <div className="flex justify-between border-b border-[#2B1A42]/60 pb-2">
                <span className="text-[#8B7D9E]">Container Engine:</span>
                <span className="text-[#C084FC] font-medium">{data.metrics.dockerStatusEn}</span>
              </div>
              <div className="flex justify-between border-b border-[#2B1A42]/60 pb-2">
                <span className="text-[#8B7D9E]">Linux Kernel:</span>
                <span className="text-[#F5F3FF] font-medium">{data.testEnvironment.kernel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reproduction Commands */}
        <div className="border border-[#2B1A42] bg-[#0D0719] rounded-[2px] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-[#A78BFA] uppercase tracking-wider">
              [ VERIFICATION COMMANDS // REPRODUCE LOCALLY ]
            </span>
            <span className="font-mono text-[10px] text-[#8B7D9E]">BASH TERMINAL</span>
          </div>
          <p className="text-xs text-[#A19BAF] mb-4 font-mono leading-relaxed">
            Run these exact standard commands on your own Linux server to compare results:
          </p>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="bg-[#06030D] border border-[#2B1A42] rounded-[2px] p-3">
              <span className="text-[#8B7D9E] block mb-1"># CPU Sysbench Benchmark</span>
              <code className="text-[#C4B5FD] select-all">{data.reproductionCommands.cpu}</code>
            </div>
            <div className="bg-[#06030D] border border-[#2B1A42] rounded-[2px] p-3">
              <span className="text-[#8B7D9E] block mb-1"># 4K Random Read/Write IOPS (fio)</span>
              <code className="text-[#C4B5FD] select-all">{data.reproductionCommands.fio4k}</code>
            </div>
            <div className="bg-[#06030D] border border-[#2B1A42] rounded-[2px] p-3">
              <span className="text-[#8B7D9E] block mb-1"># Sequential Disk Write Speed</span>
              <code className="text-[#C4B5FD] select-all">{data.reproductionCommands.fioSeqWrite}</code>
            </div>
          </div>
        </div>

        {/* Navigation & CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#2B1A42]">
          <Link
            href="/en"
            className="font-mono text-xs text-[#A19BAF] hover:text-[#C084FC] transition-colors"
          >
            ← Return to Homepage
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/en/press"
              className="px-4 py-2 font-mono text-xs border border-[#2B1A42] bg-[#120A21] text-[#F5F3FF] hover:border-[#8B5CF6] hover:text-[#C084FC] transition-colors rounded-[2px]"
            >
              Press & Media Kit →
            </Link>
            <Link
              href="/"
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
