'use client';

// ============================================================
// XIVIZLEY — Universal Reverse Engineering Studio
// Obsidian Violet & DIN EN 61082-1 Industrial Hardware Spec
// Parses docker-compose.yml, docker run commands & bash scripts
// ============================================================

import React, { useState, useMemo } from 'react';
import { useArchitectStore } from '@/store/useArchitectStore';
import { parseDockerComposeYaml } from '@/lib/parsers/composeParser';
import { useI18nStore } from '@/lib/i18n/store';
import {
  X,
  FileCode2,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Terminal,
  Zap,
  ShieldAlert,
  Server,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComposeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

const SAMPLE_STACKS = [
  {
    label: 'WP + MariaDB + Nginx',
    tag: 'Web/Proxy',
    yaml: `version: '3.8'
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - wordpress
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mariadb:3306
      WORDPRESS_DB_NAME: wp_data
  mariadb:
    image: mariadb:10.11
    environment:
      MYSQL_ROOT_PASSWORD: secret_root_pass`,
  },
  {
    label: 'Nextcloud + Postgres + Traefik',
    tag: 'Cloud/Ingress',
    yaml: `version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    ports:
      - "80:80"
      - "443:443"
  nextcloud:
    image: nextcloud:latest
    ports:
      - "8080:80"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nextcloud.rule=Host(\`cloud.local\`)"
    environment:
      POSTGRES_HOST: postgres-db
      REDIS_HOST: redis-cache
  redis-cache:
    image: redis:alpine
  postgres-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: super_secure_db_pass`,
  },
  {
    label: 'Jellyfin + qBit + Gluetun VPN',
    tag: 'Media/VPN',
    yaml: `version: '3.8'
services:
  gluetun:
    image: qmcgaw/gluetun
    ports:
      - "8080:8080"
    environment:
      VPN_SERVICE_PROVIDER: custom
  qbittorrent:
    image: linuxserver/qbittorrent
    network_mode: "service:gluetun"
    environment:
      WEBUI_PORT: 8080
  jellyfin:
    image: jellyfin/jellyfin
    ports:
      - "8096:8096"
    volumes:
      - "/media:/media"`,
  },
  {
    label: 'Docker Run CLI Komutları',
    tag: 'CLI Run',
    yaml: `docker run -d --name vaultwarden -p 8080:80 -v vw_data:/data --restart unless-stopped vaultwarden/server:latest
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=secret -v pg_data:/var/lib/postgresql/data postgres:16-alpine
docker run -d --name redis -p 6379:6379 redis:alpine`,
  },
];

export function ComposeImportModal({ isOpen, onClose, onToast }: ComposeImportModalProps) {
  const { lang } = useI18nStore();
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const loadCustomStack = useArchitectStore((s) => s.loadCustomStack);

  // Live dry-run preview metrics
  const previewAnalysis = useMemo(() => {
    if (!inputText.trim()) return null;
    try {
      const parsed = parseDockerComposeYaml(inputText);
      return parsed;
    } catch {
      return null;
    }
  }, [inputText]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!inputText.trim()) {
      setError(
        isTr
          ? 'Lütfen bir docker-compose.yml içeriği, docker run komutu veya bash scripti yapıştırın.'
          : isPt
          ? 'Por favor, cole o conteúdo do docker-compose.yml, comandos docker run ou script bash.'
          : 'Please paste docker-compose.yml content, docker run commands, or a bash script.'
      );
      return;
    }

    const result = parseDockerComposeYaml(inputText);

    if (result.errors.length > 0) {
      setError(result.errors.join('\n'));
      return;
    }

    if (result.stackNodes.length === 0) {
      setError(
        isTr
          ? 'Ayrıştırılabilecek geçerli bir servis bulunamadı.'
          : isPt
          ? 'Nenhum serviço válido encontrado para importar.'
          : 'No valid services found to parse.'
      );
      return;
    }

    loadCustomStack(result.stackNodes, result.stackEdges);

    onToast?.(
      'success',
      isTr ? 'Tersine Mühendislik Tamamlandı!' : isPt ? 'Engenharia Reversa Concluída!' : 'Reverse Engineering Complete!',
      isTr
        ? `${result.stackNodes.length} servis ve ${result.stackEdges.length} bağlantı tuvale başarıyla dizildi.`
        : isPt
        ? `${result.stackNodes.length} serviços e ${result.stackEdges.length} conexões posicionados na tela.`
        : `${result.stackNodes.length} services and ${result.stackEdges.length} connections placed on canvas.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090514]/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2px] border border-[#2B1A42] bg-[#0D0719] shadow-2xl text-[#F5F3FF]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B1A42] px-6 py-4 bg-[#120A21]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#1E1235] text-[#C084FC] border border-[#2B1A42]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2
                className="text-base font-bold text-[#F5F3FF] flex items-center gap-2"
                style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
              >
                {isTr
                  ? 'Tersine Mühendislik // Mimari Röntgen Stüdyosu'
                  : isPt
                  ? 'Engenharia Reversa // Estúdio de Raio-X'
                  : 'Universal Reverse Engineering Studio'}
                <span className="rounded-[2px] bg-[#1E1235] px-2 py-0.5 text-[9px] font-mono font-bold text-[#C084FC] border border-[#2B1A42]">
                  DIN EN 61082-1
                </span>
                <span className="rounded-[2px] bg-[#090514] px-1.5 py-0.5 text-[9px] font-mono text-[#8B7D9E] border border-[#2B1A42]">
                  MULTI-FORMAT
                </span>
              </h2>
              <p className="text-xs text-[#8B7D9E] font-mono mt-0.5">
                {isTr
                  ? 'docker-compose.yml, docker run CLI komutları veya bash kurulum scriptlerini 3 katmanlı görsel şemaya dönüştürün.'
                  : isPt
                  ? 'Converta docker-compose.yml, comandos docker run ou scripts bash em um esquema visual de 3 camadas.'
                  : 'Convert docker-compose.yml, docker run commands, or bash scripts into 3-tier visual architectural schematics.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-[2px] p-1.5 text-[#8B7D9E] hover:bg-[#1E1235] hover:text-[#F5F3FF] border border-transparent hover:border-[#2B1A42] transition-colors"
            aria-label={isTr ? 'Kapat' : isPt ? 'Fechar' : 'Close'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Top Bar: Sample presets + File Upload */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-[#8B7D9E] uppercase tracking-wider">
                {isTr ? 'Hazır Örnekler:' : isPt ? 'Exemplos:' : 'Presets:'}
              </span>
              {SAMPLE_STACKS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(s.yaml);
                    setError(null);
                  }}
                  className="flex items-center gap-1 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 text-[10px] font-mono text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] transition-colors"
                >
                  <span>{s.label}</span>
                  <span className="text-[9px] text-[#8B7D9E] bg-[#090514] px-1 rounded-[1px]">
                    {s.tag}
                  </span>
                </button>
              ))}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-3 py-1 text-xs font-mono text-[#F5F3FF] hover:border-[#8B5CF6] hover:text-[#C084FC] transition-all shrink-0">
              <Upload className="h-3.5 w-3.5 text-[#C084FC]" />
              <span>{isTr ? 'Dosya Yükle (.yml / .sh)' : isPt ? 'Carregar (.yml / .sh)' : 'Upload File (.yml / .sh)'}</span>
              <input
                type="file"
                accept=".yml,.yaml,.sh,.bash,text/yaml,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Code Input Area */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              placeholder={
                isTr
                  ? `# 1. docker-compose.yml dosyanızı yapıştırın:\nversion: '3.8'\nservices:\n  traefik:\n    image: traefik:v2.10\n    ports: ["80:80", "443:443"]\n  api:\n    image: node:20-alpine\n    ports: ["3000:3000"]\n    environment: [DATABASE_URL=postgres://user:pass@db:5432/app]\n  db:\n    image: postgres:16-alpine\n\n# 2. VEYA tek/çoklu docker run komutlarını yapıştırın:\n# docker run -d --name nextcloud -p 8080:80 nextcloud:latest\n# docker run -d --name redis -p 6379:6379 redis:alpine`
                  : `# Paste your docker-compose.yml OR docker run CLI commands here:`
              }
              rows={9}
              className="w-full rounded-[2px] border border-[#2B1A42] bg-[#06030D] p-3.5 text-xs font-mono text-[#C4B5FD] placeholder-[#8B7D9E]/40 focus:outline-none focus:border-[#8B5CF6] resize-none scrollbar-thin scrollbar-thumb-[#2B1A42]"
            />

            {/* Live Telemetry Pill Overlay */}
            {previewAnalysis && previewAnalysis.errors.length === 0 && previewAnalysis.detectedServicesCount > 0 && (
              <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/95 px-3 py-1.5 text-[10px] font-mono backdrop-blur-md shadow-xl">
                {/* Format tag */}
                <span className="rounded-[1px] bg-[#120A21] border border-[#2B1A42] px-1.5 py-0.5 text-[#C084FC] font-bold">
                  {previewAnalysis.detectedFormat === 'docker-run'
                    ? '[⚡ DOCKER RUN CLI]'
                    : previewAnalysis.detectedFormat === 'bash-script'
                    ? '[📜 BASH SCRIPT]'
                    : '[📦 COMPOSE YAML]'}
                </span>

                <span className="text-[#8B7D9E]">•</span>

                {/* Services Count */}
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  {previewAnalysis.detectedServicesCount} {isTr ? 'Servis' : 'Services'}
                </span>

                <span className="text-[#8B7D9E]">•</span>

                {/* Edges & Routes */}
                <span className="flex items-center gap-1 text-[#C084FC]">
                  <Sparkles className="h-3 w-3" />
                  {previewAnalysis.stackEdges.length} {isTr ? 'Bağlantı' : 'Edges'}
                </span>

                {/* Ingress / VPN tags */}
                {((previewAnalysis.ingressRoutesCount || 0) > 0 || (previewAnalysis.vpnTunnelsCount || 0) > 0) && (
                  <>
                    <span className="text-[#8B7D9E]">•</span>
                    <span className="text-cyan-400">
                      {(previewAnalysis.ingressRoutesCount || 0) > 0 && `[ROUTER: ${previewAnalysis.ingressRoutesCount}] `}
                      {(previewAnalysis.vpnTunnelsCount || 0) > 0 && `[VPN: ${previewAnalysis.vpnTunnelsCount}]`}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Port Collision Warning Radar */}
          {previewAnalysis && previewAnalysis.portConflicts && previewAnalysis.portConflicts.length > 0 && (
            <div className="rounded-[2px] border border-amber-500/50 bg-amber-950/30 p-3 text-xs font-mono text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200">
                  {isTr ? '[DİKKAT] Host Port Çakışması Algılandı:' : '[WARNING] Host Port Collision Detected:'}
                </p>
                <div className="space-y-0.5 mt-1 text-[11px] text-amber-300/90">
                  {previewAnalysis.portConflicts.map((c, idx) => (
                    <p key={idx}>
                      • Host Port <span className="font-bold underline">{c.port}</span>: {c.services.join(' & ')} servisleri tarafından aynı anda kullanılmak isteniyor. (Tuvale aktarıldığında port röntgeninde işaretlenecektir).
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Detected Services Preview Matrix (Chips) */}
          {previewAnalysis && previewAnalysis.detectedServicesCount > 0 && (
            <div className="rounded-[2px] border border-[#2B1A42] bg-[#06030D] p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8B7D9E] uppercase">
                <span>{isTr ? 'Röntgen Önizlemesi (Tespit Edilen Düğümler):' : 'X-Ray Preview (Detected Nodes):'}</span>
                <span>3-Tier DIN EN 61082-1</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2B1A42]">
                {previewAnalysis.stackNodes.map((n, idx) => (
                  <div
                    key={n.id || idx}
                    className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2 py-1 text-[11px] font-mono text-[#F5F3FF]"
                  >
                    <Server className="h-3 w-3 text-[#C084FC]" />
                    <span className="font-semibold">{n.label}</span>
                    <span className="text-[9px] text-[#8B7D9E] bg-[#090514] px-1 rounded-[1px]">
                      {n.isCustom ? (n.customImage || 'custom') : n.moduleId}
                    </span>
                    <span className="text-[9px] text-[#C4B5FD]">
                      x:{n.x}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2 rounded-[2px] border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <pre className="whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}

          {/* Technical Spec Callout */}
          <div className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] p-3 text-xs font-mono text-[#8B7D9E] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#8B5CF6] shrink-0" />
              <span>
                {isTr
                  ? 'Otomatik Şematik Dizilim: [1] Proxy/VPN (x:100) ➔ [2] App (x:520) ➔ [3] DB/Depolama (x:940)'
                  : 'Auto Layout: [1] Ingress/VPN (x:100) ➔ [2] App (x:520) ➔ [3] DB/Storage (x:940)'}
              </span>
            </div>
            <span className="text-[10px] text-[#A19BAF] shrink-0">
              DIN EN 61082-1 Schematics
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2B1A42] bg-[#120A21] px-6 py-3.5">
          <p className="text-[11px] font-mono text-[#8B7D9E]">
            {isTr
              ? 'Tüm portlar, gizli ortam değişkeni bağlantıları ve proxy yönlendirmeleri otomatik çözülür.'
              : 'Ports, implicit environment references, and proxy routes are verified automatically.'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-[2px] border border-[#2B1A42] bg-[#090514] px-3.5 py-1.5 text-xs font-mono font-medium text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] transition-all"
            >
              {isTr ? 'Vazgeç' : isPt ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 rounded-[2px] bg-[#8B5CF6] hover:bg-[#7C3AED] px-4 py-1.5 text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>{isTr ? 'Tuvale Yansıt & Röntgen Çek' : isPt ? 'Projetar na Tela' : 'Project to Canvas'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
