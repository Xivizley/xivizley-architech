'use client';

// ============================================================
// XIVIZLEY — Pro Studio Cyber Edge Component
// Obsidian Violet & DIN 40719 Industrial Hardware Spec
// Flowing electric violet data lines with deterministic protocol telemetry
// ============================================================

import React, { memo, useMemo } from 'react';
import {
  getBezierPath,
  type EdgeProps,
  EdgeLabelRenderer,
} from 'reactflow';
import { useArchitectStore } from '@/store/useArchitectStore';
import { useI18nStore } from '@/lib/i18n/store';
import { X, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArchitectNode } from '@/lib/types';

interface ProtocolInfo {
  protocol: string;
  wireLabel: string;
  isConflict: boolean;
}

function getDeterministicProtocolInfo(sourceNode?: ArchitectNode, targetNode?: ArchitectNode): ProtocolInfo {
  // If either source or target has a conflict
  const hasConflict = Boolean(sourceNode?.data?.hasConflict || targetNode?.data?.hasConflict);
  const conflictPort = sourceNode?.data?.conflicts?.[0]?.hostPort || targetNode?.data?.conflicts?.[0]?.hostPort;

  if (hasConflict && conflictPort) {
    return {
      protocol: 'TCP',
      wireLabel: `🔴 PORT ÇAKIŞMASI :${conflictPort}`,
      isConflict: true,
    };
  }

  // Destination node (target) holds the receiving port
  const dest = targetNode || sourceNode;
  const label = (dest?.data?.label || '').toLowerCase();
  const image = (dest?.data?.customImage || dest?.data?.moduleId || '').toLowerCase();

  // 1. PostgreSQL Wire
  if (label.includes('postgres') || image.includes('postgres')) {
    return {
      protocol: 'TCP',
      wireLabel: '⚡ TCP :5432 • Postgres Wire',
      isConflict: false,
    };
  }

  // 2. MySQL / MariaDB Wire
  if (label.includes('mysql') || image.includes('mysql') || label.includes('mariadb') || image.includes('mariadb')) {
    return {
      protocol: 'TCP',
      wireLabel: '⚡ TCP :3306 • MySQL Wire',
      isConflict: false,
    };
  }

  // 3. Redis / Valkey RESP Protocol
  if (label.includes('redis') || image.includes('redis') || label.includes('valkey') || image.includes('valkey')) {
    return {
      protocol: 'TCP',
      wireLabel: '⚡ TCP :6379 • RESP Protocol',
      isConflict: false,
    };
  }

  // 4. MongoDB Wire
  if (label.includes('mongo') || image.includes('mongo')) {
    return {
      protocol: 'TCP',
      wireLabel: '⚡ TCP :27017 • Mongo Wire',
      isConflict: false,
    };
  }

  // 5. MinIO S3 API
  if (label.includes('minio') || image.includes('minio')) {
    return {
      protocol: 'HTTP',
      wireLabel: '📦 S3/REST :9000 • Object Storage',
      isConflict: false,
    };
  }

  // 6. RabbitMQ AMQP
  if (label.includes('rabbitmq') || image.includes('rabbitmq')) {
    return {
      protocol: 'AMQP',
      wireLabel: '🐇 AMQP :5672 • Message Queue',
      isConflict: false,
    };
  }

  // 7. Kafka Stream
  if (label.includes('kafka') || image.includes('kafka')) {
    return {
      protocol: 'TCP',
      wireLabel: '⚡ TCP :9092 • Kafka Broker',
      isConflict: false,
    };
  }

  // 8. DNS Resolver
  if (label.includes('dns') || label.includes('pihole') || label.includes('adguard')) {
    return {
      protocol: 'UDP',
      wireLabel: '📡 UDP :53 • DNS Query',
      isConflict: false,
    };
  }

  // 9. Reverse Proxy Flow
  const isSourceProxy = ['nginx', 'caddy', 'traefik', 'haproxy'].some((p) =>
    (sourceNode?.data?.label || '').toLowerCase().includes(p)
  );
  if (isSourceProxy) {
    const targetPort = targetNode?.data?.customPorts?.[0]?.container || 80;
    return {
      protocol: 'HTTP/1.1',
      wireLabel: `🔒 PROXY -> :${targetPort}`,
      isConflict: false,
    };
  }

  // Fallback to internal container port
  const targetPort = targetNode?.data?.customPorts?.[0]?.container || 80;
  return {
    protocol: 'TCP',
    wireLabel: `⚡ TCP/IP :${targetPort}`,
    isConflict: false,
  };
}

function CyberEdgeInner({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgesChange = useArchitectStore((s) => s.onEdgesChange);
  const nodes = useArchitectStore((s) => s.nodes);
  const isSimulating = useArchitectStore((s) => s.isSimulating);
  const lang = useI18nStore((s) => s.lang);
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const sourceNode = useMemo(() => nodes.find((n) => n.id === source), [nodes, source]);
  const targetNode = useMemo(() => nodes.find((n) => n.id === target), [nodes, target]);

  const protocolInfo = useMemo(
    () => getDeterministicProtocolInfo(sourceNode, targetNode),
    [sourceNode, targetNode]
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdgesChange([{ type: 'remove', id }]);
  };

  const gradientId = `cyber-gradient-${id}`;

  // Performance throttle for large topologies
  const isThrottled = nodes.length > 15;
  const particleDur = isSimulating ? (isThrottled ? '2.0s' : '1.2s') : '2.4s';

  // Dynamic stroke color based on conflict and simulation state
  const isConflictWire = isSimulating && protocolInfo.isConflict;

  const resolvedStroke = isConflictWire
    ? '#F43F5E'
    : selected
    ? '#C084FC'
    : style?.stroke || `url(#${gradientId})`;

  const cleanStyle: React.CSSProperties = {
    ...style,
    stroke: resolvedStroke,
    strokeWidth: selected ? 2.5 : isSimulating ? 2.5 : 2,
  };

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* Layer 0: Wide invisible click/hover target */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        className="cursor-pointer react-flow__edge-interaction"
      />

      {/* Layer 1: Outer glow aura (Electric violet or flashing red if collision) */}
      <path
        d={edgePath}
        fill="none"
        stroke={isConflictWire ? '#F43F5E' : selected ? '#C084FC' : '#8B5CF6'}
        strokeWidth={selected || isConflictWire ? 5.5 : 3.5}
        strokeOpacity={isConflictWire ? 0.7 : selected ? 0.45 : 0.22}
        className={cn(
          'transition-all duration-200 pointer-events-none',
          isConflictWire && 'animate-pulse'
        )}
        style={{
          filter: isConflictWire
            ? 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))'
            : selected
            ? 'drop-shadow(0 0 6px rgba(192, 132, 252, 0.6))'
            : 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.35))',
        }}
      />

      {/* Layer 2: Clean electric laser/wire path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={resolvedStroke}
        strokeWidth={selected || isConflictWire ? 2.5 : 2}
        className="react-flow__edge-path transition-colors duration-200 pointer-events-none"
        markerEnd={markerEnd}
        style={cleanStyle}
      />

      {/* Layer 3: Flowing animated dashed data pulses */}
      <path
        d={edgePath}
        fill="none"
        stroke={isConflictWire ? '#FECDD3' : '#F5F3FF'}
        strokeWidth={1.5}
        strokeDasharray="8 14"
        strokeLinecap="round"
        className="cyber-flowing-line pointer-events-none opacity-80"
      />

      {/* Layer 4: Flowing photon particles traveling along wire */}
      <circle r={isConflictWire ? 3.5 : 2.5} fill={isConflictWire ? '#FDA4AF' : '#C084FC'} className="pointer-events-none">
        <animateMotion
          dur={particleDur}
          repeatCount="indefinite"
          path={edgePath}
          rotate="auto"
        />
      </circle>

      {!isThrottled && (
        <circle r={isConflictWire ? 2.5 : 1.8} fill={isConflictWire ? '#FFE4E6' : '#E9D5FF'} className="pointer-events-none">
          <animateMotion
            dur={particleDur}
            begin={isSimulating ? '0.6s' : '1.2s'}
            repeatCount="indefinite"
            path={edgePath}
            rotate="auto"
          />
        </circle>
      )}

      {/* Live Simulation Protocol Radar Pill Overlay */}
      {isSimulating && !selected && Number.isFinite(labelX) && Number.isFinite(labelY) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="nodrag nopan z-20"
          >
            <div
              className={cn(
                'flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-bold border shadow-lg backdrop-blur-md transition-all select-none',
                protocolInfo.isConflict
                  ? 'bg-rose-950/90 border-rose-500/70 text-rose-300 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'bg-[#0D0719]/90 border-[#2B1A42] text-[#C084FC] shadow-[0_0_8px_rgba(139,92,246,0.25)]'
              )}
            >
              <span>{protocolInfo.wireLabel}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Selected quick action overlay */}
      {selected && Number.isFinite(labelX) && Number.isFinite(labelY) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan z-30"
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#120A21] border border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.25)] backdrop-blur-md animate-in fade-in zoom-in-90 duration-150 text-[10px]">
              <Activity className="h-3 w-3 text-[#A78BFA] animate-pulse" />
              <span className="font-mono font-bold text-[#F5F3FF]">
                {protocolInfo.isConflict
                  ? protocolInfo.wireLabel
                  : isSimulating
                  ? protocolInfo.wireLabel
                  : isTr
                  ? 'BAĞLANTI'
                  : isPt
                  ? 'CONEXÃO'
                  : 'CONNECTION'}
              </span>
              <button
                onClick={handleDelete}
                className="ml-1 p-0.5 rounded-[1px] hover:bg-rose-950/60 text-[#8B7D9E] hover:text-rose-400 border border-transparent hover:border-rose-500/40 transition-colors"
                title={isTr ? 'Bağlantıyı Sil' : isPt ? 'Excluir Conexão' : 'Delete Connection'}
                aria-label={isTr ? 'Bağlantıyı Sil' : isPt ? 'Excluir Conexão' : 'Delete Connection'}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const CyberEdge = memo(CyberEdgeInner);
