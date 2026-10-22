// ============================================================
// XIVIZLEY — ReactFlow Architecture Canvas (Production Grade with History, Snap & Shortcuts)
// components/canvas/ArchitectCanvas.tsx
// ============================================================

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type ReactFlowInstance,
} from 'reactflow';
import { NodeCard } from './NodeCard';
import { HardwareEstimator } from './HardwareEstimator';
import { QuickSearchModal } from './QuickSearchModal';
import { QuickStackPacksModal, STACK_PACKS } from './QuickStackPacksModal';
import { useArchitectStore, selectCanUndo, selectCanRedo } from '@/store/useArchitectStore';
import { StoryCardModal } from '@/components/modals/StoryCardModal';
import { MODULE_CATALOG } from '@/lib/data/modules';
import type { ModuleNodeData } from '@/lib/types';
import { useTranslation, useI18nStore } from '@/lib/i18n/store';
import { cn } from '@/lib/utils';
import {
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Grid,
  Maximize2,
  ImageDown,
  FileCode2,
  Keyboard,
  X,
  Sparkles,
  Shield,
  Palette,
  Wand2,
  Package,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { auditStackSecurity, generateSecureSecret } from '@/lib/utils/securityAuditor';
import { downloadProjectZip } from '@/lib/generators/zipGenerator';
import { generateCode } from '@/lib/generators/composeGenerator';
import { generateEnvFile } from '@/lib/generators/envGenerator';
import { generateVdsDeployScript } from '@/lib/generators/deploymentGenerator';
import { CyberEdge } from './CyberEdge';
import { parseDockerComposeYaml } from '@/lib/parsers/composeParser';

// ─── Custom Node & Edge Types ────────────────────────────────

const nodeTypes = { moduleNode: NodeCard };
const edgeTypes = {
  cyberEdge: CyberEdge,
  default: CyberEdge,
};

// Quick preset modules for empty canvas
const QUICK_PRESETS = [
  { templateId: 'adguard', moduleId: 'adguard-home', emoji: '🛡️', label: 'AdGuard Home' },
  { templateId: 'nginx', moduleId: 'nginx-proxy-manager', emoji: '🔀', label: 'Nginx Proxy' },
  { templateId: 'nextcloud', moduleId: 'nextcloud', emoji: '☁️', label: 'Nextcloud' },
  { templateId: 'jellyfin', moduleId: 'jellyfin', emoji: '🎬', label: 'Jellyfin' },
  { templateId: 'vaultwarden', moduleId: 'vaultwarden', emoji: '🔐', label: 'Vaultwarden' },
];

// ─── Floating Canvas Command Dock (Bottom Center, Zero-Overlap) ──────────────

interface CanvasBottomDockProps {
  hasNodes: boolean;
  securityAudit: ReturnType<typeof auditStackSecurity>;
  onAutoHarden: () => void;
  onOpenStoryCard?: () => void;
}

function CanvasBottomDock({
  hasNodes,
  securityAudit,
  onAutoHarden,
  onOpenStoryCard,
}: CanvasBottomDockProps) {
  const { nodes, edges } = useArchitectStore();
  const [isZipping, setIsZipping] = useState(false);
  const lang = useI18nStore((s) => s.lang);
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const download = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const handlePng = async () => {
    const el = document.querySelector<HTMLElement>('.react-flow__viewport');
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { backgroundColor: '#090514', quality: 0.95 });
      download(dataUrl, `xivizley-${Date.now()}.png`);
    } catch (e) {
      console.error('PNG export failed', e);
    }
  };

  const handleSvg = async () => {
    const el = document.querySelector<HTMLElement>('.react-flow__viewport');
    if (!el) return;
    try {
      const dataUrl = await toSvg(el, { backgroundColor: '#090514' });
      download(dataUrl, `xivizley-${Date.now()}.svg`);
    } catch (e) {
      console.error('SVG export failed', e);
    }
  };

  const handleZip = async () => {
    try {
      setIsZipping(true);
      const { dockerCompose } = generateCode(nodes, edges);
      const envContent = generateEnvFile(nodes);
      const deployScript = generateVdsDeployScript(nodes, edges);
      await downloadProjectZip({
        composeYaml: dockerCompose,
        envContent,
        bashScript: deployScript,
        nodes,
      });
    } catch (e) {
      console.error('ZIP export failed', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="pointer-events-auto absolute bottom-3 inset-x-0 mx-auto w-max z-20 flex items-center gap-1 sm:gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/95 backdrop-blur-md p-1 shadow-2xl max-w-[calc(100%-2rem)] overflow-x-auto scrollbar-none font-mono">
      {/* Live Security Pod (when nodes exist) */}
      {hasNodes && (
        <>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] select-none shrink-0">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-[1px] font-bold text-[10px] shadow-inner',
                securityAudit.score >= 85
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                  : securityAudit.score >= 60
                  ? 'bg-amber-950/70 text-amber-400 border border-amber-500/40'
                  : 'bg-rose-950/70 text-rose-400 border border-rose-500/40'
              )}
            >
              {securityAudit.grade}
            </div>
            <div className="flex items-center gap-1 text-[10.5px]">
              <Shield className="h-3 w-3 text-[#C084FC]" />
              <span className="hidden md:inline text-[#8B7D9E]">{isTr ? 'Güvenlik:' : isPt ? 'Segurança:' : 'Security:'}</span>
              <span
                className={cn(
                  'font-bold',
                  securityAudit.score >= 85
                    ? 'text-emerald-400'
                    : securityAudit.score >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                )}
              >
                %{securityAudit.score}
              </span>
            </div>
            {securityAudit.issues.some((i) => i.autoFixable) && (
              <button
                onClick={onAutoHarden}
                className="ml-1 flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-[10px] font-bold text-white transition-all active:scale-95 shadow-sm"
                title={isTr ? 'Zayıf parolaları otomatik sağlamlaştır' : 'Auto harden weak passwords'}
              >
                <Wand2 className="h-2.5 w-2.5" />
                <span className="hidden md:inline">{isTr ? 'Sağlamlaştır' : 'Harden'}</span>
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-[#2B1A42] shrink-0" />
        </>
      )}

      {/* 9:16 Story Card Generator */}
      <button
        onClick={onOpenStoryCard}
        className="flex h-7 items-center gap-1.5 px-2.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] text-[10px] font-bold text-[#F5F3FF] hover:border-[#8B5CF6] hover:bg-[#1E1235] transition-all active:scale-95 shadow-sm shrink-0"
        title={isTr ? 'Instagram Story Formatında (9:16) Self-Host Kimlik Kartı' : '9:16 Self-Host Story Card'}
      >
        <Sparkles className="h-3 w-3 text-[#C084FC]" />
        <span>{isTr ? 'Story' : isPt ? 'Story' : 'Story'}</span>
      </button>

      <div className="h-4 w-px bg-[#2B1A42] shrink-0" />

      {/* PNG */}
      <button
        onClick={handlePng}
        className="flex h-7 items-center gap-1 px-2 rounded-[2px] border border-[#2B1A42] bg-[#120A21] text-[10px] font-semibold text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] transition-all active:scale-95 shrink-0"
        title={isTr ? 'PNG olarak indir' : 'Download as PNG'}
      >
        <ImageDown className="h-3 w-3 text-[#8B5CF6]" />
        <span>PNG</span>
      </button>

      <div className="h-4 w-px bg-[#2B1A42] shrink-0" />

      {/* SVG */}
      <button
        onClick={handleSvg}
        className="flex h-7 items-center gap-1 px-2 rounded-[2px] border border-[#2B1A42] bg-[#120A21] text-[10px] font-semibold text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] transition-all active:scale-95 shrink-0"
        title={isTr ? 'SVG olarak indir' : 'Download as SVG'}
      >
        <FileCode2 className="h-3 w-3 text-[#A78BFA]" />
        <span>SVG</span>
      </button>

      <div className="h-4 w-px bg-[#2B1A42] shrink-0" />

      {/* ZIP */}
      <button
        onClick={handleZip}
        disabled={isZipping}
        className="flex h-7 items-center gap-1 px-2.5 rounded-[2px] border border-[#2B1A42] bg-[#1E1235] text-[10px] font-bold text-[#C084FC] hover:border-[#8B5CF6] hover:text-[#F5F3FF] transition-all active:scale-95 disabled:opacity-50 shrink-0"
        title={isTr ? "Tüm mimariyi tek tıkla ZIP olarak indir" : "Download full stack as ZIP"}
      >
        <Package className="h-3 w-3 text-[#8B5CF6]" />
        <span>{isZipping ? (isTr ? 'Paketleniyor...' : 'Zipping...') : 'Stack .ZIP'}</span>
      </button>
    </div>
  );
}

// ─── Floating Canvas Action Toolbar ──────────────────────────

function CanvasToolbar({ onOpenStackPacks }: { onOpenStackPacks?: () => void }) {
  const { fitView } = useReactFlow();
  const lang = useI18nStore((s) => s.lang);
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';
  const canUndo = useArchitectStore(selectCanUndo);
  const canRedo = useArchitectStore(selectCanRedo);
  const undo = useArchitectStore((s) => s.undo);
  const redo = useArchitectStore((s) => s.redo);
  const duplicateSelected = useArchitectStore((s) => s.duplicateSelected);
  const deleteSelected = useArchitectStore((s) => s.deleteSelected);
  const snapToGrid = useArchitectStore((s) => s.snapToGrid);
  const toggleSnapToGrid = useArchitectStore((s) => s.toggleSnapToGrid);
  const autoLayout = useArchitectStore((s) => s.autoLayout);
  const nodes = useArchitectStore((s) => s.nodes);
  const isSimulating = useArchitectStore((s) => s.isSimulating);
  const toggleSimulation = useArchitectStore((s) => s.toggleSimulation);
  const selectedNodeId = useArchitectStore((s) => s.selectedNodeId);
  const hasSelection = useArchitectStore((s) => s.nodes.some((n) => n.selected) || Boolean(selectedNodeId));
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleFitView = useCallback(() => {
    try {
      fitView({ padding: 0.2, duration: 300 });
    } catch {
      // Safe fallback
    }
  }, [fitView]);

  return (
    <div className="relative min-w-0 max-w-full">
      <div className="pointer-events-auto flex flex-nowrap items-center gap-1 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/95 backdrop-blur-md p-1 shadow-2xl max-w-full overflow-x-auto scrollbar-none @min-[480px]:flex-wrap @min-[480px]:overflow-visible font-mono">
        {/* Studio HUD Badge Pod */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[10px] font-mono font-bold text-[#C084FC] mr-0.5 select-none shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8B5CF6]" />
          </span>
          <span>STUDIO</span>
        </div>

        <div className="hidden 2xl:block h-4 w-px bg-[#2B1A42] shrink-0" />

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-[2px] border border-transparent transition-all shrink-0',
            canUndo
              ? 'text-[#A19BAF] hover:bg-[#1E1235] hover:text-[#F5F3FF] hover:border-[#8B5CF6] active:scale-95'
              : 'text-[#8B7D9E]/30 cursor-not-allowed opacity-40'
          )}
          title={isTr ? 'Geri Al (Ctrl+Z)' : isPt ? 'Desfazer (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
          aria-label={isTr ? 'Geri Al' : isPt ? 'Desfazer' : 'Undo'}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={!canRedo}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-[2px] border border-transparent transition-all shrink-0',
            canRedo
              ? 'text-[#A19BAF] hover:bg-[#1E1235] hover:text-[#F5F3FF] hover:border-[#8B5CF6] active:scale-95'
              : 'text-[#8B7D9E]/30 cursor-not-allowed opacity-40'
          )}
          title={isTr ? 'İleri Al (Ctrl+Shift+Z / Ctrl+Y)' : isPt ? 'Refazer (Ctrl+Shift+Z / Ctrl+Y)' : 'Redo (Ctrl+Shift+Z / Ctrl+Y)'}
          aria-label={isTr ? 'İleri Al' : isPt ? 'Refazer' : 'Redo'}
        >
          <Redo2 className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-[#2B1A42] shrink-0" />

        {/* Duplicate Selected */}
        <button
          onClick={duplicateSelected}
          disabled={!hasSelection}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-[2px] border border-transparent transition-all shrink-0',
            hasSelection
              ? 'text-[#A19BAF] hover:bg-[#1E1235] hover:text-[#F5F3FF] hover:border-[#8B5CF6] active:scale-95'
              : 'text-[#8B7D9E]/30 cursor-not-allowed opacity-40'
          )}
          title={isTr ? 'Seçiliyi Çoğalt (Ctrl+D)' : isPt ? 'Duplicar Seleção (Ctrl+D)' : 'Duplicate Selected (Ctrl+D)'}
          aria-label={isTr ? 'Seçiliyi Çoğalt' : isPt ? 'Duplicar Seleção' : 'Duplicate Selected'}
        >
          <Copy className="h-3.5 w-3.5" />
        </button>

        {/* Delete Selected */}
        <button
          onClick={deleteSelected}
          disabled={!hasSelection}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-[2px] border border-transparent transition-all shrink-0',
            hasSelection
              ? 'text-[#A19BAF] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/50 active:scale-95'
              : 'text-[#8B7D9E]/30 cursor-not-allowed opacity-40'
          )}
          title={isTr ? 'Sil (Delete / Backspace)' : isPt ? 'Excluir (Delete / Backspace)' : 'Delete (Delete / Backspace)'}
          aria-label={isTr ? 'Seçiliyi Sil' : isPt ? 'Excluir Seleção' : 'Delete Selected'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-[#2B1A42] shrink-0" />

        {/* Snap to Grid */}
        <button
          onClick={toggleSnapToGrid}
          className={cn(
            'flex h-7 items-center gap-1 px-2 rounded-[2px] text-[10px] font-semibold transition-all shrink-0 border',
            snapToGrid
              ? 'bg-[#1E1235] text-[#C084FC] border-[#8B5CF6]'
              : 'text-[#8B7D9E] border-transparent hover:bg-[#120A21] hover:text-[#F5F3FF]'
          )}
          title={snapToGrid ? (isTr ? 'Grid Snap Açık (20px)' : 'Grid Snap On (20px)') : (isTr ? 'Grid Snap Kapalı' : 'Grid Snap Off')}
          aria-label="Grid Snap"
        >
          <Grid className="h-3 w-3" />
          <span className="hidden sm:inline">Snap</span>
        </button>

        {/* Live Simulation Radar Toggle */}
        <button
          onClick={toggleSimulation}
          className={cn(
            'flex h-7 items-center gap-1.5 px-2.5 rounded-[2px] text-[10px] font-mono font-bold transition-all active:scale-95 shadow-sm shrink-0',
            isSimulating
              ? 'bg-[#7C3AED] text-white border border-[#C084FC] shadow-[0_0_12px_rgba(139,92,246,0.5)]'
              : 'border border-[#2B1A42] bg-[#120A21] text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF]'
          )}
          title={
            isSimulating
              ? isTr
                ? 'Canlı Simülasyon Radarı Açık — Durdurmak için tıkla'
                : 'Live Simulation Radar Active — Click to pause'
              : isTr
              ? 'Canlı Simülasyon Radarı (Deterministik Paket Akışı)'
              : 'Live Simulation Radar (Deterministic Packet Flow)'
          }
          aria-label="Simulation Radar"
        >
          <Zap className={cn('h-3.5 w-3.5', isSimulating ? 'text-amber-300 animate-pulse' : 'text-[#8B5CF6]')} />
          <span className="hidden sm:inline">{isSimulating ? (isTr ? 'SİMÜLATÖR [AÇIK]' : 'RADAR [ON]') : (isTr ? 'SİMÜLATÖR' : 'RADAR')}</span>
        </button>

        {/* Auto Layout */}
        <button
          onClick={() => {
            autoLayout();
            setTimeout(() => handleFitView(), 50);
          }}
          disabled={nodes.length === 0}
          className="flex h-7 items-center gap-1.5 px-2.5 rounded-[2px] text-[10px] font-bold border border-[#2B1A42] bg-[#120A21] text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] hover:bg-[#1E1235] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm shrink-0"
          title={isTr ? 'Modülleri Otomatik Hizala & Düzenle (Auto-Layout)' : 'Auto Align & Layout Modules'}
          aria-label="Auto Layout"
        >
          <Sparkles className="h-3 w-3 text-[#A78BFA]" />
          <span className="hidden sm:inline">{isTr ? 'Düzenle' : isPt ? 'Organizar' : 'Layout'}</span>
        </button>

        {/* Stack Packs Button */}
        {onOpenStackPacks && (
          <button
            onClick={onOpenStackPacks}
            className="flex h-7 items-center gap-1.5 px-2.5 rounded-[2px] text-[10px] font-bold border border-[#2B1A42] bg-[#120A21] text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] hover:bg-[#1E1235] transition-all active:scale-95 shadow-sm shrink-0"
            title={isTr ? 'Hazır Mimari Paketleri' : 'Ready Architecture Packs'}
            aria-label={isTr ? 'Hazır Paketler' : 'Ready Packs'}
          >
            <Package className="h-3 w-3 text-[#C084FC]" />
            <span className="hidden sm:inline">{isTr ? 'Paketler' : isPt ? 'Pacotes' : 'Packs'}</span>
          </button>
        )}

        {/* Fit View */}
        <button
          onClick={handleFitView}
          className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[#8B7D9E] hover:bg-[#1E1235] hover:text-[#F5F3FF] transition-all active:scale-95 shrink-0"
          title={isTr ? 'Görünümü Ekrana Sığdır (Fit View)' : 'Fit to Screen (Fit View)'}
          aria-label="Fit View"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>

        <div className="hidden md:block h-4 w-px bg-[#2B1A42] shrink-0" />

        {/* Theme Selector */}
        <div className="relative group hidden md:block shrink-0">
          <button
            className="flex h-7 items-center gap-1 px-2 rounded-[2px] text-[10px] font-medium text-[#8B7D9E] hover:bg-[#120A21] hover:text-[#C084FC] transition-all"
            title={isTr ? 'Görsel Tuval Teması' : 'Canvas Theme'}
            aria-label={isTr ? 'Tuval Teması' : 'Canvas Theme'}
          >
            <Palette className="h-3 w-3" />
            <span>{isTr ? 'Tema' : 'Theme'}</span>
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-col w-36 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/98 p-1 shadow-2xl backdrop-blur-md z-50 text-[11px] font-mono">
            <button
              onClick={() => localStorage.setItem('xivizley_theme', 'cyberpunk')}
              className="px-2 py-1.5 text-left rounded-[2px] hover:bg-[#1E1235] text-[#C084FC] font-medium transition-colors"
            >
              🌌 Cyberpunk
            </button>
            <button
              onClick={() => localStorage.setItem('xivizley_theme', 'matrix')}
              className="px-2 py-1.5 text-left rounded-[2px] hover:bg-emerald-950/40 text-emerald-400 font-medium transition-colors"
            >
              🟢 Matrix
            </button>
            <button
              onClick={() => localStorage.setItem('xivizley_theme', 'violet')}
              className="px-2 py-1.5 text-left rounded-[2px] hover:bg-[#1E1235] text-[#C084FC] font-medium transition-colors"
            >
              🟣 Hyper Violet
            </button>
            <button
              onClick={() => localStorage.setItem('xivizley_theme', 'blueprint')}
              className="px-2 py-1.5 text-left rounded-[2px] hover:bg-blue-950/40 text-blue-300 font-medium transition-colors"
            >
              📐 Blueprint
            </button>
          </div>
        </div>

        <div className="h-4 w-px bg-[#2B1A42] shrink-0" />

        {/* Shortcuts Help */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-[2px] transition-all shrink-0',
            showShortcuts
              ? 'bg-[#1E1235] text-[#C084FC] border border-[#8B5CF6]'
              : 'text-[#8B7D9E] hover:bg-[#1E1235] hover:text-[#F5F3FF]'
          )}
          title={isTr ? 'Klavye Kısayolları' : 'Keyboard Shortcuts'}
          aria-label={isTr ? 'Klavye Kısayolları' : 'Keyboard Shortcuts'}
        >
          <Keyboard className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Shortcuts Modal Card */}
      {showShortcuts && (
        <div className="absolute top-10 left-0 z-50 w-72 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/98 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 font-mono">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2B1A42]">
            <span className="text-xs font-bold text-[#F5F3FF] flex items-center gap-1.5">
              <Keyboard className="h-3.5 w-3.5 text-[#C084FC]" /> {isTr ? 'Klavye Kısayolları' : 'Keyboard Shortcuts'}
            </span>
            <button onClick={() => setShowShortcuts(false)} className="text-[#8B7D9E] hover:text-[#F5F3FF]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#A19BAF]">
            <div className="flex items-center justify-between py-0.5">
              <span>{isTr ? 'Komut Paleti' : 'Command Palette'}</span>
              <kbd className="px-1.5 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[10px] text-[#F5F3FF]">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span>{isTr ? 'Geri Al' : 'Undo'}</span>
              <kbd className="px-1.5 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[10px] text-[#F5F3FF]">Ctrl + Z</kbd>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span>{isTr ? 'İleri Al' : 'Redo'}</span>
              <kbd className="px-1.5 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[10px] text-[#F5F3FF]">Ctrl + Y</kbd>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span>{isTr ? 'Seçiliyi Çoğalt' : 'Duplicate'}</span>
              <kbd className="px-1.5 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[10px] text-[#F5F3FF]">Ctrl + D</kbd>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span>{isTr ? 'Seçiliyi Sil' : 'Delete'}</span>
              <kbd className="px-1.5 py-0.5 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[10px] text-[#F5F3FF]">Del / ⌫</kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CanvasContentProps {
  onInit?: (instance: ReactFlowInstance) => void;
  onOpenStoryCard?: () => void;
  onOpenStackPacks?: () => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
  isEmbed?: boolean;
}

function CanvasContent({ onInit, onOpenStoryCard, onOpenStackPacks, onToast, isEmbed = false }: CanvasContentProps) {
  const { t } = useTranslation();
  const lang = useI18nStore((s) => s.lang);
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';
  const nodes = useArchitectStore((s) => s.nodes);
  const edges = useArchitectStore((s) => s.edges);
  const snapToGrid = useArchitectStore((s) => s.snapToGrid);
  const onNodesChange = useArchitectStore((s) => s.onNodesChange);
  const onEdgesChange = useArchitectStore((s) => s.onEdgesChange);
  const onConnect = useArchitectStore((s) => s.onConnect);
  const onNodeDragStart = useArchitectStore((s) => s.onNodeDragStart);
  const addModule = useArchitectStore((s) => s.addModule);
  const undo = useArchitectStore((s) => s.undo);
  const redo = useArchitectStore((s) => s.redo);
  const duplicateSelected = useArchitectStore((s) => s.duplicateSelected);
  const deleteSelected = useArchitectStore((s) => s.deleteSelected);
  const loadTemplate = useArchitectStore((s) => s.loadTemplate);
  const loadCustomStack = useArchitectStore((s) => s.loadCustomStack);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = React.useRef(0);

  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isStackPacksOpen, setIsStackPacksOpen] = useState(false);
  const [isInternalStoryOpen, setIsInternalStoryOpen] = useState(false);

  const handleStoryCardTrigger = onOpenStoryCard || (() => setIsInternalStoryOpen(true));
  const handleStackPacksTrigger = onOpenStackPacks || (() => setIsStackPacksOpen(true));

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Safety check for input, textarea, contenteditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          Boolean(target.closest('input, textarea, [contenteditable="true"]')));

      if (isInput) return;

      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // Quick Search: Ctrl/Cmd + K
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen((prev) => !prev);
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z OR Ctrl/Cmd + Y
      if ((mod && e.key.toLowerCase() === 'z' && e.shiftKey) || (mod && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
        return;
      }

      // Duplicate: Ctrl/Cmd + D
      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Delete / Backspace: Delete selected nodes/edges
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateSelected, deleteSelected]);

  // Drag and drop listeners for external compose files (.yml) & internal sidebar modules
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item && item.kind === 'file') {
          setIsDraggingFile(true);
          break;
        }
      }
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDraggingFile(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounter.current = 0;
      setIsDraggingFile(false);

      // 1. Check if user dropped a file (e.g. docker-compose.yml)
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (!file) return;

        const fileName = (file.name || '').toLowerCase();
        const fileType = file.type || '';
        const isYaml =
          fileName.endsWith('.yml') ||
          fileName.endsWith('.yaml') ||
          fileType.includes('yaml') ||
          fileType.includes('text') ||
          fileName.includes('compose');

        if (!isYaml) {
          onToast?.(
            'error',
            isTr ? 'Desteklenmeyen Dosya Türü' : isPt ? 'Tipo de Arquivo Não Suportado' : 'Unsupported File Type',
            isTr
              ? 'Lütfen geçerli bir .yml veya .yaml Docker Compose dosyası sürükleyin.'
              : isPt
              ? 'Por favor, solte um arquivo .yml ou .yaml Docker Compose válido.'
              : 'Please drop a valid .yml or .yaml Docker Compose file.'
          );
          return;
        }

        try {
          const yamlText = await file.text();
          const result = parseDockerComposeYaml(yamlText);

          if (result.errors.length > 0) {
            onToast?.(
              'error',
              isTr ? 'YAML Ayrıştırma Hatası' : isPt ? 'Erro ao Analisar YAML' : 'YAML Parsing Error',
              result.errors[0]
            );
            return;
          }

          if (result.stackNodes.length === 0) {
            onToast?.(
              'error',
              isTr ? 'Geçerli Servis Bulunamadı' : isPt ? 'Nenhum Serviço Válido' : 'No Valid Services Found',
              isTr
                ? 'Dosya içinde ayrıştırılabilecek bir Docker servisi bulunamadı.'
                : isPt
                ? 'Nenhum serviço Docker analisável foi encontrado no arquivo.'
                : 'No parsable Docker services found in the file.'
            );
            return;
          }

          loadCustomStack(result.stackNodes, result.stackEdges);

          onToast?.(
            'success',
            isTr ? 'Compose İçe Aktarıldı! 🚀' : isPt ? 'Compose Importado! 🚀' : 'Compose Imported! 🚀',
            isTr
              ? `${result.stackNodes.length} servis tuvale yerleştirildi ve bağımlılıklar bağlandı.`
              : isPt
              ? `${result.stackNodes.length} serviços posicionados no canvas com dependências conectadas.`
              : `${result.stackNodes.length} services successfully placed on canvas.`
          );
          return;
        } catch (err: any) {
          onToast?.(
            'error',
            isTr ? 'Dosya Okunamadı' : isPt ? 'Erro ao Ler Arquivo' : 'Failed to Read File',
            err?.message ||
              (isTr ? 'Dosya okunurken bir hata oluştu.' : isPt ? 'Ocorreu um erro ao ler o arquivo.' : 'An error occurred while reading the file.')
          );
          return;
        }
      }

      // 2. Fallback to sidebar module drag
      const moduleId = event.dataTransfer.getData('application/xivizley-module');
      if (!moduleId) return;

      const target = event.currentTarget.getBoundingClientRect();
      const rawX = event.clientX - target.left - 100;
      const rawY = event.clientY - target.top - 40;

      const position = snapToGrid
        ? { x: Math.round(rawX / 20) * 20, y: Math.round(rawY / 20) * 20 }
        : { x: rawX, y: rawY };

      addModule(moduleId, position);
    },
    [snapToGrid, addModule, loadCustomStack, onToast, isTr, isPt]
  );

  // Minimap node colour based on module category
  const minimapNodeColor = useCallback((node: { data?: ModuleNodeData }) => {
    if (!node.data) return '#334155';
    const mod = MODULE_CATALOG.find((m) => m.id === node.data?.moduleId);
    return mod?.color ?? '#334155';
  }, []);

  const securityAudit = React.useMemo(() => auditStackSecurity(nodes), [nodes]);
  const updateEnvOverride = useArchitectStore((s) => s.updateEnvOverride);

  const handleAutoHarden = useCallback(() => {
    securityAudit.issues.forEach((issue) => {
      if (issue.autoFixable && issue.nodeId !== 'global' && issue.field) {
        const strongPass = generateSecureSecret(32);
        updateEnvOverride(issue.nodeId, issue.field, strongPass);
      }
    });
  }, [securityAudit, updateEnvOverride]);

  return (
    <div
      className="relative h-full w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {/* High-Tech Drag & Drop Glowing Overlay */}
      {isDraggingFile && (
        <div className="pointer-events-none absolute inset-4 z-50 flex flex-col items-center justify-center rounded-[2px] border-2 border-dashed border-[#8B5CF6] bg-[#090514]/92 text-[#F5F3FF] shadow-[0_0_30px_rgba(139,92,246,0.2)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-[2px] border border-[#2B1A42] bg-[#120A21] ring-1 ring-[#8B5CF6]/50 shadow-2xl">
            <div className="absolute inset-0 rounded-[2px] bg-[#8B5CF6]/20 blur-xl animate-pulse" />
            <FileCode2 className="h-12 w-12 text-[#C084FC] animate-bounce" />
          </div>
          <div className="text-center px-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-[#C084FC] text-xs font-mono font-bold mb-3 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>DOCKER COMPOSE REVERSE ENGINEER</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5F3FF] tracking-tight">
              {isTr
                ? 'Docker Compose Dosyanızı Buraya Bırakın'
                : isPt
                ? 'Solte o Arquivo Docker Compose Aqui'
                : 'Drop Your Docker Compose File Here'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A19BAF] max-w-md mx-auto leading-relaxed">
              {isTr
                ? '.yml veya .yaml dosyanız saniyeler içinde görsel tuval mimarisine ve port bağlantı haritasına dönüştürülecektir.'
                : isPt
                ? 'Seu arquivo .yml ou .yaml será convertido em segundos na arquitetura visual e mapa de conexões.'
                : 'Your .yml or .yaml file will be converted into visual canvas topology and port map in seconds.'}
            </p>
          </div>
        </div>
      )}

      {/* ─── Top Floating Canvas Header Dock (Zero-Overlap Responsive Flex) ─── */}
      {!isEmbed && (
        <div className="pointer-events-none absolute top-3 inset-x-3 z-30 flex flex-wrap items-start justify-between gap-2.5">
          {/* Left: Action Toolbar */}
          <CanvasToolbar onOpenStackPacks={handleStackPacksTrigger} />

          {/* Right: Hardware Estimator */}
          <div className="pointer-events-auto ml-auto flex flex-col items-end gap-1.5 shrink-0">
            <HardwareEstimator />
          </div>
        </div>
      )}

      {/* ─── Bottom Floating Command Dock (Zero-Overlap Integrated Dock) ─── */}
      {!isEmbed && (
        <CanvasBottomDock
          hasNodes={nodes.length > 0}
          securityAudit={securityAudit}
          onAutoHarden={handleAutoHarden}
          onOpenStoryCard={handleStoryCardTrigger}
        />
      )}

      {/* Embed Mode HUD */}
      {isEmbed && (
        <>
          {/* Top-left Branding Pill */}
          <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-2 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/95 backdrop-blur-md px-3.5 py-1.5 shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
            </span>
            <span className="text-xs font-extrabold text-[#F5F3FF] tracking-wider font-mono">XIVIZLEY</span>
            <span className="text-[10px] font-mono text-[#C084FC] border-l border-[#2B1A42] pl-2">
              {nodes.length} {isTr ? 'Servis' : isPt ? 'Serviços' : 'Services'}
            </span>
          </div>

          {/* Bottom-right Action Pill */}
          <div className="absolute bottom-3.5 right-3.5 z-30 flex items-center gap-2">
            <a
              href={`/architect${typeof window !== 'undefined' ? window.location.search : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] hover:border-[#8B5CF6] backdrop-blur-md px-3.5 py-1.5 text-xs font-bold font-mono text-[#C084FC] hover:text-[#F5F3FF] transition-all shadow-xl active:scale-95 group"
            >
              <span>{isTr ? 'Tuvali Stüdyoda Aç' : isPt ? 'Abrir no Studio' : 'Open in Studio'}</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#8B5CF6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onInit={onInit}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[20, 20]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#8B5CF6', strokeWidth: 2, opacity: 0.85 },
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-[#08090e]"
      >
        {/* Layer 1: High-Tech Cyber Grid Matrix */}
        <Background
          id="bg-cyber-lines"
          variant={BackgroundVariant.Lines}
          gap={48}
          size={1}
          color="rgba(14, 165, 233, 0.07)"
        />
        {/* Layer 2: Precision Crosshairs */}
        <Background
          id="bg-cyber-cross"
          variant={BackgroundVariant.Cross}
          gap={24}
          size={1}
          color="rgba(99, 102, 241, 0.12)"
        />

        {/* Ambient radial glow aura */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_35%,rgba(6,182,212,0.06),rgba(99,102,241,0.03),transparent_75%)] z-0"
          aria-hidden="true"
        />

        {/* Controls panel */}
        <Controls
          className="[&>button]:!bg-[#120A21] [&>button]:!border-[#2B1A42] [&>button]:!text-[#A19BAF]
                     [&>button:hover]:!bg-[#1E1235] [&>button:hover]:!text-[#F5F3FF]
                     [&>button]:transition-colors !border !border-[#2B1A42] !rounded-[2px] overflow-hidden shadow-xl"
          showInteractive={false}
        />

        {/* Minimap */}
        <MiniMap
          nodeColor={minimapNodeColor as (node: object) => string}
          maskColor="rgba(9,5,20,0.85)"
          className="hidden md:block !bg-[#0D0719]/95 !border !border-[#2B1A42] !rounded-[2px] shadow-xl"
          nodeStrokeWidth={2}
          zoomable
          pannable
        />

        {/* Empty state overlay */}
        {nodes.length === 0 && (
          <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 sm:px-6 max-w-4xl mx-auto overflow-y-auto py-8 z-10">
            <div className="text-center">
              <div className="mb-3">
                <span className="inline-flex p-3 rounded-[2px] bg-[#120A21] border border-[#2B1A42] text-3xl shadow-lg">
                  🖥️
                </span>
              </div>
              <p className="text-xl sm:text-3xl font-extrabold tracking-tight">
                <span className="text-[#F5F3FF]">{isTr ? 'Görsel Self-Host ' : isPt ? 'Estúdio Visual de ' : 'Visual Self-Host '}</span>
                <span className="text-[#C084FC]">{isTr ? 'Mimarlık Stüdyosu' : isPt ? 'Arquitetura Self-Host' : 'Architecture Studio'}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-[#A19BAF] max-w-md mx-auto leading-relaxed font-mono">
                {isTr
                  ? 'Soldaki modülleri tuvale sürükleyin veya tek tıkla optimize edilmiş hazır bir mimari yığınını başlatın:'
                  : isPt
                  ? 'Arraste os módulos da barra lateral para o canvas ou inicie uma stack otimizada com 1 clique:'
                  : 'Drag modules from the sidebar to the canvas or launch an optimized architecture stack with 1 click:'}
              </p>

              {/* Compose Drag & Drop Tip Pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] text-[11px] font-medium font-mono text-[#C084FC] shadow-inner">
                <FileCode2 className="h-3.5 w-3.5 text-[#8B5CF6]" />
                <span>
                  {isTr
                    ? '💡 İpucu: Elinizdeki docker-compose.yml dosyasını doğrudan tuvale sürükleyip bırakabilirsiniz!'
                    : isPt
                    ? '💡 Dica: Você pode arrastar e soltar seu arquivo docker-compose.yml diretamente aqui!'
                    : '💡 Tip: You can drag & drop your docker-compose.yml file directly onto the canvas!'}
                </span>
              </div>
            </div>

            {/* 1-Click Stack Packs Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STACK_PACKS.slice(0, 6).map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => loadTemplate(pack.templateId)}
                  className="group flex flex-col justify-between rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/95 backdrop-blur-md p-4 text-left transition-all hover:border-[#8B5CF6] hover:bg-[#120A21] hover:shadow-xl cursor-pointer active:scale-[0.98]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-2xl">{pack.emoji}</span>
                      <span className={cn('text-[9px] font-mono font-semibold px-2 py-0.5 rounded-[2px] border', pack.badgeColor)}>
                        {pack.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F5F3FF] group-hover:text-[#C084FC] transition-colors font-mono">
                      {pack.name}
                    </h4>
                    <p className="text-[11px] text-[#A19BAF] mt-1 line-clamp-2 leading-relaxed">
                      {pack.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2B1A42] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#8B7D9E]">{pack.sponsorText.split(' ')[1]}</span>
                    <span className="text-[#C084FC] font-bold group-hover:underline">{isTr ? '1-Tık Kur →' : isPt ? 'Instalar com 1-Clique →' : '1-Click Install →'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Stack Packs CTA */}
            <div className="flex items-center justify-center w-full pt-1">
              <button
                onClick={handleStackPacksTrigger}
                className="flex items-center gap-2 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-5 py-2.5 text-xs font-bold font-mono text-[#F5F3FF] hover:border-[#8B5CF6] hover:bg-[#1E1235] hover:text-[#C084FC] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
                <span>{isTr ? `Tüm Hazır Paketleri İncele (${STACK_PACKS.length}) →` : isPt ? `Ver Todos os Pacotes (${STACK_PACKS.length}) →` : `Browse All Ready Packs (${STACK_PACKS.length}) →`}</span>
              </button>
            </div>

            {/* Quick-start single module presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-[#2B1A42] w-full font-mono">
              <span className="text-[11px] text-[#8B7D9E] mr-1">{isTr ? 'Tekil Modüller:' : isPt ? 'Módulos Individuais:' : 'Single Modules:'}</span>
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.templateId}
                  onClick={() => addModule(preset.moduleId)}
                  className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-3 py-1 text-[11px] font-medium text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF] active:scale-95"
                >
                  <span className="text-xs">{preset.emoji}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </ReactFlow>

      {/* Cmd/Ctrl + K Quick Search Modal */}
      {!isEmbed && <QuickSearchModal isOpen={isQuickSearchOpen} onClose={() => setIsQuickSearchOpen(false)} />}

      {/* Hazır Mimari Paketleri Modalı */}
      {!isEmbed && <QuickStackPacksModal isOpen={isStackPacksOpen} onClose={() => setIsStackPacksOpen(false)} />}

      {/* 9:16 Instagram Story Homelab Kimlik Kartı Modalı */}
      {!isEmbed && <StoryCardModal isOpen={isInternalStoryOpen} onClose={() => setIsInternalStoryOpen(false)} onToast={onToast} />}
    </div>
  );
}

// ─── Exported ArchitectCanvas with Provider ──────────────────

export interface ArchitectCanvasProps {
  onInit?: (instance: ReactFlowInstance) => void;
  onOpenStoryCard?: () => void;
  onOpenStackPacks?: () => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
  isEmbed?: boolean;
}

export function ArchitectCanvas(props: ArchitectCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasContent {...props} />
    </ReactFlowProvider>
  );
}
