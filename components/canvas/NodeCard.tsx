'use client';

// ============================================================
// XIVIZLEY — NodeCard Component (Production Grade)
// components/canvas/NodeCard.tsx
// ============================================================

import React, { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { ConflictBadge } from './ConflictBadge';
import { MODULE_CATALOG } from '@/lib/data/modules';
import { resolveModuleResources } from '@/lib/utils/hardwareEstimator';
import { useArchitectStore } from '@/store/useArchitectStore';
import { useI18nStore } from '@/lib/i18n/store';
import {
  X,
  ChevronRight,
  Settings,
  Copy,
  Server,
  Cpu,
  Box,
  Home,
  ShieldCheck,
  Globe,
  Cloud,
  Image,
  Play,
  Lock,
  KeyRound,
  Gamepad2,
  Car,
  ShieldBan,
  Shield,
  Network,
  LayoutDashboard,
  Tv,
  Download,
  Activity,
  LayoutGrid,
  FolderSync,
  Film,
  Video,
  Workflow,
  Headphones,
  ChefHat,
  HardDrive,
  Bot,
  Sparkles,
  Flame,
  Database,
  BookOpen,
  Palette,
  Search,
  Wallet,
  Coins,
  Bookmark,
  type LucideIcon,
} from 'lucide-react';
import type { ModuleNodeData } from '@/lib/types';

// ─── Icon Map ────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Server, Cpu, Container: Box, Box, Home, ShieldCheck, Globe, Cloud,
  FolderCloud: Cloud, Image, Play, Lock, KeyRound, Gamepad2, Car,
  ShieldBan, Shield, Network, LayoutDashboard, Tv, Download, Activity,
  LayoutGrid, FolderSync, Film, Video, Workflow, Headphones, ChefHat, HardDrive,
  Bot, Sparkles, Flame, Database, BookOpen, Palette,
  Search, Wallet, Coins, Bookmark,
};


// ─── NodeCard ────────────────────────────────────────────────

function NodeCardInner({ id, data, selected }: NodeProps<ModuleNodeData>) {
  const { removeNode, selectNode, duplicateNode } = useArchitectStore();
  const isSimulating = useArchitectStore((s) => s.isSimulating);
  const { lang } = useI18nStore();
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const moduleDef = MODULE_CATALOG.find((m) => m.id === data.moduleId);

  // Fallback for custom / imported generic containers
  const effectiveDef = moduleDef || {
    id: 'custom',
    name: data.label || (isTr ? 'Özel Konteyner' : isPt ? 'Container Personalizado' : 'Custom Container'),
    description: data.customImage ? `Docker: ${data.customImage}` : (isTr ? 'Özel Docker Servisi' : isPt ? 'Serviço Docker Personalizado' : 'Custom Docker Service'),
    category: 'app' as const,
    dockerImage: data.customImage?.split(':')[0] || 'custom-image',
    defaultTag: data.customImage?.split(':')[1] || 'latest',
    ports: (data.customPorts || []).map((p) => ({
      internal: p.container,
      default: p.host,
      label: p.label || `${p.host}:${p.container}`,
      protocol: p.protocol || 'tcp',
    })),
    environment: Object.entries(data.customEnv || {}).map(([k, v]) => ({
      key: k,
      defaultValue: String(v),
      description: '',
      required: false,
    })),
    volumes: (data.customVolumes || []).map((v) => ({
      hostPath: v.hostPath,
      containerPath: v.containerPath,
      label: v.containerPath,
    })),
    resources: { ramMB: 512, cpuCores: 1, diskGB: 5 },
    notes: [],
    icon: 'Box',
    color: '#8B5CF6',
  };

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeNode(id);
    },
    [id, removeNode],
  );

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateNode(id);
    },
    [id, duplicateNode],
  );

  const handleSelect = useCallback(() => {
    selectNode(id);
  }, [id, selectNode]);

  const ModuleIcon = ICON_MAP[effectiveDef.icon] ?? (data.isCustom ? Box : Server);

  // Compute displayed ports
  const displayPorts: Array<{ hostPort: number; internalPort: number; label: string; isConflicted: boolean }> = [];
  if (data.isCustom && data.customPorts && data.customPorts.length > 0) {
    for (const p of data.customPorts) {
      const isConflicted = data.conflicts.some((c) => c.hostPort === p.host);
      displayPorts.push({
        hostPort: p.host,
        internalPort: p.container,
        label: p.label || `${p.host}:${p.container}`,
        isConflicted,
      });
    }
  } else if (effectiveDef.ports.length > 0) {
    for (const portDef of effectiveDef.ports) {
      const hostPort = data.portOverrides[portDef.internal] ?? portDef.default;
      const isConflicted = data.conflicts.some((c) => c.hostPort === hostPort);
      displayPorts.push({
        hostPort,
        internalPort: portDef.internal,
        label: portDef.label,
        isConflicted,
      });
    }
  }

  const imageString = data.customImage || (effectiveDef.dockerImage ? `${effectiveDef.dockerImage}:${effectiveDef.defaultTag}` : '');

  // Deterministic Simulation Radar Telemetry
  const isDatabaseService =
    effectiveDef.category === 'storage' ||
    ['postgres', 'postgresql', 'mysql', 'mariadb', 'redis', 'mongo', 'couchdb', 'clickhouse'].some(
      (db) =>
        (data.label || '').toLowerCase().includes(db) ||
        (effectiveDef.dockerImage || data.customImage || '').toLowerCase().includes(db)
    );

  const exposedDbHostPort = isDatabaseService
    ? displayPorts.find((p) => p.hostPort !== undefined && p.hostPort > 0)?.hostPort ?? null
    : null;

  const estimatedRam = effectiveDef.resources?.ramMB ?? resolveModuleResources(data.moduleId).ramMB;

  return (
    <div
      onClick={handleSelect}
      className={cn(
        'node-card group relative w-52 rounded-[2px] border border-[#2B1A42] bg-[#120A21] text-[#F5F3FF]',
        'shadow-xl transition-all duration-150 cursor-pointer',
        'hover:border-[#8B5CF6]/70 hover:shadow-[0_4px_20px_rgba(139,92,246,0.15)] hover:-translate-y-0.5',
        selected && 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]',
        data.hasConflict && 'border-rose-500/70 ring-1 ring-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)] animate-pulse',
      )}
      style={{ '--accent': effectiveDef.color } as React.CSSProperties}
    >
      {/* Top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-[2px] opacity-90"
        style={{ background: effectiveDef.color, boxShadow: `0 0 8px ${effectiveDef.color}66` }}
      />

      {/* Subtle DIN corner markings */}
      <div className={cn("absolute top-1 left-1 w-1.5 h-1.5 border-t border-l pointer-events-none transition-colors", selected ? "border-[#8B5CF6]" : "border-[#3F2761] group-hover:border-[#8B5CF6]/70")} />
      <div className={cn("absolute top-1 right-1 w-1.5 h-1.5 border-t border-r pointer-events-none transition-colors", selected ? "border-[#8B5CF6]" : "border-[#3F2761] group-hover:border-[#8B5CF6]/70")} />
      <div className={cn("absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l pointer-events-none transition-colors", selected ? "border-[#8B5CF6]" : "border-[#3F2761] group-hover:border-[#8B5CF6]/70")} />
      <div className={cn("absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r pointer-events-none transition-colors", selected ? "border-[#8B5CF6]" : "border-[#3F2761] group-hover:border-[#8B5CF6]/70")} />

      {/* Connection handles (source Right -> target Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border !border-[#8B5CF6] !bg-[#0D0719] hover:!bg-[#8B5CF6] transition-colors rounded-[1px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !border !border-[#8B5CF6] !bg-[#0D0719] hover:!bg-[#8B5CF6] transition-colors rounded-[1px]"
      />

      {/* Header */}
      <div className="flex items-start gap-2 p-3 pb-2">
        {/* Module icon */}
        <div
          className="mt-0.5 h-7 w-7 shrink-0 rounded-[2px] flex items-center justify-center transition-transform group-hover:scale-105"
          style={{
            background: effectiveDef.color + '1A',
            border: `1px solid ${effectiveDef.color}44`,
          }}
          aria-hidden
        >
          <ModuleIcon className="h-3.5 w-3.5" style={{ color: effectiveDef.color }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p
              className="line-clamp-2 break-words text-xs font-bold text-[#F5F3FF] leading-tight"
              title={data.label}
            >
              {data.label}
            </p>
          </div>
          <p className="text-[10px] font-mono text-[#8B7D9E] uppercase tracking-wider mt-0.5">
            {data.isCustom ? (isTr ? 'Özel Konteyner' : isPt ? 'Container Personalizado' : 'Custom Container') : effectiveDef.category}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleDuplicate}
            className="p-1 text-[#8B7D9E] hover:bg-[#1E1235] hover:text-[#C084FC] hover:border-[#8B5CF6] border border-transparent rounded-[2px] transition-colors"
            aria-label={`${data.label} ${isTr ? 'modülünü çoğalt' : isPt ? 'duplicar nó' : 'duplicate module'}`}
            title={isTr ? 'Düğümü Çoğalt (Ctrl+D)' : isPt ? 'Duplicar Nó (Ctrl+D)' : 'Duplicate Node (Ctrl+D)'}
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={handleRemove}
            className="p-1 text-[#8B7D9E] hover:bg-[#1E1235] hover:text-[#C084FC] hover:border-[#8B5CF6] border border-transparent rounded-[2px] transition-colors"
            aria-label={`${data.label} ${isTr ? 'modülünü kaldır' : isPt ? 'remover módulo' : 'remove module'}`}
            title={isTr ? 'Modülü kaldır' : isPt ? 'Remover módulo' : 'Remove module'}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Description on hover */}
      <div className="mx-3 mb-1 overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-200 ease-in-out">
        <p className="text-[10px] text-[#8B7D9E] leading-tight line-clamp-2">
          {effectiveDef.description}
        </p>
      </div>

      {/* Port pills */}
      {displayPorts.length > 0 && (
        <div className="mx-3 mb-2 flex flex-wrap gap-1">
          {displayPorts.slice(0, 4).map((p, idx) => (
            <span
              key={idx}
              className={cn(
                'px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-[2px] border',
                p.isConflicted
                  ? 'border-rose-500/60 bg-rose-950/60 text-rose-300 animate-pulse'
                  : 'border-[#2B1A42] bg-[#090514] text-[#A78BFA]',
              )}
              title={`${p.label} (${isTr ? 'İç port' : isPt ? 'Porta interna' : 'Internal port'}: ${p.internalPort})`}
            >
              {p.hostPort}:{p.internalPort}
            </span>
          ))}
          {displayPorts.length > 4 && (
            <span className="rounded-[2px] px-1.5 py-0.5 text-[10px] font-mono border border-[#2B1A42] bg-[#090514] text-[#8B7D9E]">
              +{displayPorts.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Docker image badge */}
      {imageString && (
        <div className="mx-3 mb-2">
          <p className="truncate text-[10px] font-mono text-[#8B7D9E]" title={imageString}>
            {imageString}
          </p>
        </div>
      )}

      {/* Conflict badge */}
      {data.hasConflict && data.conflicts.length > 0 && (
        <div className="mx-3 mb-3">
          <ConflictBadge conflicts={data.conflicts} />
        </div>
      )}

      {/* Mini Resource Badge */}
      {effectiveDef.resources && (effectiveDef.resources.ramMB || effectiveDef.resources.cpuCores) && (
        <div className="mx-3 mb-2 flex items-center justify-between text-[9px] font-mono text-[#8B7D9E] bg-[#090514] px-2 py-0.5 rounded-[2px] border border-[#2B1A42]">
          <span>RAM: <span className="text-[#C084FC]">{effectiveDef.resources.ramMB >= 1024 ? `${(effectiveDef.resources.ramMB / 1024).toFixed(effectiveDef.resources.ramMB % 1024 === 0 ? 0 : 1)} GB` : `${effectiveDef.resources.ramMB} MB`}</span></span>
          <span>CPU: <span className="text-[#A78BFA]">{effectiveDef.resources.cpuCores}C</span></span>
        </div>
      )}

      {/* Live Deterministic Simulation Telemetry Badge */}
      {isSimulating && (
        <div className="mx-3 mb-2 animate-in fade-in duration-150">
          {data.hasConflict ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-rose-950/80 border border-rose-500/70 text-rose-300 font-mono text-[9px] font-bold animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.3)]">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>PORT ÇAKIŞMASI :{data.conflicts.map((c) => c.hostPort).join(',')}</span>
            </div>
          ) : exposedDbHostPort ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-amber-950/80 border border-amber-500/70 text-amber-300 font-mono text-[9px] font-bold shadow-[0_0_8px_rgba(245,158,11,0.25)]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>⚠️ UNPROTECTED 0.0.0.0:{exposedDbHostPort}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-[9px] font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>PORT OK • ~{estimatedRam}MB RAM • ROTA: GEÇERLİ</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#2B1A42] px-3 py-1.5 bg-[#0D0719] rounded-b-[2px]">
        <span className="text-[10px] text-[#8B7D9E]/70 font-mono uppercase tracking-wider">{id.slice(0, 8)}</span>
        <button
          onClick={handleSelect}
          className="flex items-center gap-1 text-[10px] font-mono text-[#8B7D9E] hover:bg-[#1E1235] hover:text-[#C084FC] hover:border-[#8B5CF6] border border-transparent px-1.5 py-0.5 rounded-[2px] transition-colors"
          aria-label={isTr ? 'Modülü yapılandır' : isPt ? 'Configurar módulo' : 'Configure module'}
        >
          <Settings className="h-3 w-3" />
          <span>{isTr ? 'Yapılandır' : isPt ? 'Configurar' : 'Configure'}</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export const NodeCard = memo(NodeCardInner);
