'use client';

// ============================================================
// XIVIZLEY — Hardware Resource Estimator Component
// components/canvas/HardwareEstimator.tsx
// ============================================================

import React, { useState, useMemo } from 'react';
import { useArchitectStore } from '@/store/useArchitectStore';
import { calculateHardwareEstimate } from '@/lib/utils/hardwareEstimator';
import { useI18nStore } from '@/lib/i18n/store';
import { cn } from '@/lib/utils';
import { Cpu, HardDrive, MemoryStick, ChevronDown, ChevronUp, AlertCircle, Sparkles, Server } from 'lucide-react';

export function HardwareEstimator() {
  const lang = useI18nStore((s) => s.lang);
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const nodes = useArchitectStore((s) => s.nodes);
  const [isExpanded, setIsExpanded] = useState(false);

  const estimate = useMemo(() => calculateHardwareEstimate(nodes, lang), [nodes, lang]);

  if (nodes.length === 0) return null;

  return (
    <div className="relative flex flex-col items-end">
      {/* Mini Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        className={cn(
          'group flex items-center gap-2.5 sm:gap-3 rounded-[2px] border border-[#2B1A42] bg-[#120A21]/95 px-3 py-1.5 select-none cursor-pointer transition-all duration-200 font-mono shadow-lg',
          'hover:border-[#8B5CF6] hover:bg-[#150C28]',
          isExpanded && 'border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.25)]'
        )}
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F3FF]">
          <Server className="h-3.5 w-3.5 text-[#C084FC] animate-pulse" />
          <span className="hidden sm:inline text-[10.5px] text-[#8B7D9E]">
            {isTr ? 'Donanım:' : isPt ? 'Hardware:' : 'Hardware:'}
          </span>
          <span className="text-[#C084FC] text-[11px] font-bold tracking-tight">{estimate.recommendation.title.split('/')[0]}</span>
        </div>

        <div className="h-3.5 w-px bg-[#2B1A42]" />

        {/* RAM */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#F5F3FF]">
          <MemoryStick className="h-3 w-3 text-emerald-400" />
          <span className="font-semibold text-emerald-400">{estimate.totalRamGB} GB</span>
        </div>

        {/* CPU */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#F5F3FF]">
          <Cpu className="h-3 w-3 text-[#C084FC]" />
          <span className="font-semibold text-[#C084FC]">{estimate.totalCpuCores}C</span>
        </div>

        {/* Storage */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#F5F3FF]">
          <HardDrive className="h-3 w-3 text-amber-400" />
          <span className="font-semibold text-amber-400">{estimate.totalDiskGB} GB</span>
        </div>

        <div className="text-[#8B7D9E] group-hover:text-[#F5F3FF] transition-colors ml-0.5">
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </div>

      {/* Expanded Details Card */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-1.5 w-80 sm:w-96 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/98 p-4 shadow-2xl backdrop-blur-xl z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#2B1A42]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C084FC]" />
              <span className="text-xs font-semibold text-[#F5F3FF] font-mono">
                {isTr ? 'Sistem Kaynak Analizi' : isPt ? 'Análise de Recursos do Sistema' : 'System Resource Analysis'}
              </span>
            </div>
            <span className={cn('text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[2px] border', estimate.recommendation.badgeBg, estimate.recommendation.badgeColor, estimate.recommendation.badgeBorder)}>
              {estimate.recommendation.category}
            </span>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-2 mb-3 font-mono">
            <div className="rounded-[2px] bg-[#06030D] border border-[#2B1A42] p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#8B7D9E] mb-0.5">
                <MemoryStick className="h-3 w-3 text-emerald-400" /> RAM
              </div>
              <p className="text-xs font-bold font-mono text-[#F5F3FF]">{estimate.totalRamGB} GB</p>
              <p className="text-[9px] text-[#8B7D9E] font-mono">({estimate.totalRamMB} MB)</p>
            </div>

            <div className="rounded-[2px] bg-[#06030D] border border-[#2B1A42] p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#8B7D9E] mb-0.5">
                <Cpu className="h-3 w-3 text-[#C084FC]" /> CPU
              </div>
              <p className="text-xs font-bold font-mono text-[#F5F3FF]">{estimate.totalCpuCores} {isTr ? 'Çekirdek' : isPt ? 'Núcleos' : 'Cores'}</p>
              <p className="text-[9px] text-[#8B7D9E] font-mono">{isTr ? 'Önerilen' : isPt ? 'Recomendado' : 'Recommended'}</p>
            </div>

            <div className="rounded-[2px] bg-[#06030D] border border-[#2B1A42] p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#8B7D9E] mb-0.5">
                <HardDrive className="h-3 w-3 text-amber-400" /> {isTr ? 'Depolama' : isPt ? 'Armazenamento' : 'Storage'}
              </div>
              <p className="text-xs font-bold font-mono text-[#F5F3FF]">{estimate.totalDiskGB} GB</p>
              <p className="text-[9px] text-[#8B7D9E] font-mono">{isTr ? 'Min. Alan' : isPt ? 'Espaço Mín.' : 'Min. Space'}</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] p-3 mb-2.5">
            <p className="text-xs font-mono font-semibold text-[#C084FC] mb-1">
              [ÖNERİ] {isTr ? 'Önerilen Cihaz:' : isPt ? 'Dispositivo Recomendado:' : 'Recommended Device:'} {estimate.recommendation.title}
            </p>
            <p className="text-[11px] leading-relaxed text-[#A19BAF]">
              {estimate.recommendation.description}
            </p>
          </div>

          {/* Top Resource Consumers Breakdown */}
          {estimate.topConsumers.length > 0 && (
            <div className="rounded-[2px] border border-[#2B1A42] bg-[#06030D] p-2.5 mb-2.5 font-mono">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8B7D9E] mb-1.5">
                {isTr ? 'En Çok Kaynak Tüketenler' : isPt ? 'Maiores Consumidores de Recursos' : 'Top Resource Consumers'}
              </p>
              <div className="space-y-1">
                {estimate.topConsumers.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#F5F3FF] truncate max-w-[140px]">{c.name}</span>
                    <span className="text-[10px] font-mono text-[#C084FC]">
                      {c.ramMB >= 1024 ? `${(c.ramMB / 1024).toFixed(1)} GB` : `${c.ramMB} MB`} RAM
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OWEB TR Cloud 10 Gbps VDS Compatibility Badge */}
          <div className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] p-2.5 mb-2 flex items-center justify-between shadow-md">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F3FF] font-mono">
                <span>OWEB (TR Cloud 10 Gbps NVMe)</span>
                <span className="text-[10px] font-semibold text-[#C084FC]">
                  ({estimate.totalRamGB} GB / 8.0 GB)
                </span>
              </div>
              <p className="text-[10px] text-[#8B7D9E] mt-0.5">
                {parseFloat(estimate.totalRamGB) <= 8.0
                  ? (isTr ? '✓ 10 Gbps Port & Datacenter NVMe ile %100 sıfır gecikme.' : isPt ? '✓ 100% zero latência com porta 10 Gbps e Datacenter NVMe.' : '✓ 100% zero latency with 10 Gbps Port & Datacenter NVMe.')
                  : (isTr ? '⚠ OWEB TR Cloud 16 GB+ Datacenter NVMe VDS paketi önerilir.' : isPt ? '⚠ Recomenda-se plano OWEB TR Cloud 16 GB+ Datacenter NVMe VDS.' : '⚠ OWEB TR Cloud 16 GB+ Datacenter NVMe VDS plan recommended.')}
              </p>
            </div>
            <a
              href="https://www.oweb.net.tr/aff.php?aff=975"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="rounded-[2px] bg-[#8B5CF6] hover:bg-[#7C3AED] px-2.5 py-1 text-[10px] font-bold font-mono text-white transition-all shrink-0 ml-2 shadow-sm"
            >
              TR Cloud
            </a>
          </div>

          {/* Hosting.com.tr VPS Partner Badge */}
          <div className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] p-2.5 mb-2.5 flex items-center justify-between shadow-md">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F3FF] font-mono">
                <span>Hosting.com.tr VDS</span>
                <span className="text-[10px] font-semibold text-[#A78BFA]">
                  {parseFloat(estimate.totalRamGB) <= 2.0 ? 'VDS 1' : parseFloat(estimate.totalRamGB) <= 4.0 ? 'VDS 2' : 'VDS 3'}
                </span>
              </div>
              <p className="text-[10px] text-[#8B7D9E] mt-0.5">
                {parseFloat(estimate.totalRamGB) <= 2.0
                  ? (isTr ? '✓ 2 GB RAM Otomatik Kurulumlu VDS 1 tam uyumlu.' : isPt ? '✓ 100% compatível com VDS 1 (2 GB RAM) com auto-deploy.' : '✓ 100% compatible with VDS 1 (2 GB RAM) auto-deploy.')
                  : parseFloat(estimate.totalRamGB) <= 4.0
                  ? (isTr ? '✓ 4 GB RAM Otomatik Kurulumlu VDS 2 tam uyumlu.' : isPt ? '✓ 100% compatível com VDS 2 (4 GB RAM) com auto-deploy.' : '✓ 100% compatible with VDS 2 (4 GB RAM) auto-deploy.')
                  : (isTr ? '✓ 8 GB RAM Otomatik Kurulumlu VDS 3 tam uyumlu.' : isPt ? '✓ 100% compatível com VDS 3 (8 GB RAM) com auto-deploy.' : '✓ 100% compatible with VDS 3 (8 GB RAM) auto-deploy.')}
              </p>
            </div>
            <a
              href="https://www.hosting.com.tr/aff.php?aff=1702"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] border border-[#2B1A42] bg-[#1E1235] hover:border-[#8B5CF6] px-2.5 py-1 text-[10px] font-bold font-mono text-[#C084FC] hover:text-[#F5F3FF] transition-all shrink-0 ml-2 shadow-sm"
            >
              {isTr ? '%50 İndirim ↗' : isPt ? '50% Desconto ↗' : '50% Off ↗'}
            </a>
          </div>

          {/* Warnings */}
          {estimate.warnings.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {estimate.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px] font-mono text-amber-400/90 leading-tight">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
