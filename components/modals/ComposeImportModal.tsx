'use client';

// ============================================================
// XIVIZLEY — Reverse Compose Studio Component
// Obsidian Violet & DIN 40719 Industrial Hardware Spec
// Parses docker-compose.yml into visual schematic canvas
// ============================================================

import React, { useState, useMemo } from 'react';
import { useArchitectStore } from '@/store/useArchitectStore';
import { parseDockerComposeYaml } from '@/lib/parsers/composeParser';
import { useI18nStore } from '@/lib/i18n/store';
import { X, FileCode2, Upload, Sparkles, CheckCircle2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComposeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

const SAMPLE_STACKS = [
  {
    label: 'WP + MySQL + Nginx',
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
      WORDPRESS_DB_HOST: mysql-db:3306
      WORDPRESS_DB_NAME: wp_data
  mysql-db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret_root_pass`,
  },
  {
    label: 'Nextcloud + Redis + Postgres',
    yaml: `version: '3.8'
services:
  nextcloud:
    image: nextcloud:latest
    ports:
      - "8080:80"
    environment:
      REDIS_HOST: redis-cache
      POSTGRES_HOST: postgres-db
  redis-cache:
    image: redis:alpine
  postgres-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: super_secure_db_pass`,
  },
];

export function ComposeImportModal({ isOpen, onClose, onToast }: ComposeImportModalProps) {
  const { lang } = useI18nStore();
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const [yamlText, setYamlText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const loadCustomStack = useArchitectStore((s) => s.loadCustomStack);

  // Live dry-run preview metrics
  const previewAnalysis = useMemo(() => {
    if (!yamlText.trim()) return null;
    try {
      const parsed = parseDockerComposeYaml(yamlText);
      return parsed;
    } catch {
      return null;
    }
  }, [yamlText]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setYamlText(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!yamlText.trim()) {
      setError(
        isTr
          ? 'Lütfen bir docker-compose.yml içeriği yapıştırın veya dosya yükleyin.'
          : isPt
          ? 'Por favor, cole o conteúdo do docker-compose.yml ou carregue um arquivo.'
          : 'Please paste docker-compose.yml content or upload a file.'
      );
      return;
    }

    const result = parseDockerComposeYaml(yamlText);

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
      isTr ? 'Compose İçe Aktarıldı!' : isPt ? 'Compose Importado!' : 'Compose Imported!',
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
      <div className="w-full max-w-2xl overflow-hidden rounded-[2px] border border-[#2B1A42] bg-[#0D0719] shadow-2xl text-[#F5F3FF]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B1A42] px-6 py-4 bg-[#120A21]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[2px] bg-[#1E1235] text-[#C084FC] border border-[#2B1A42]">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <h2
                className="text-base font-bold text-[#F5F3FF] flex items-center gap-2"
                style={{ fontFamily: 'var(--font-serif, Georgia, serif)' }}
              >
                {isTr
                  ? 'Reverse Compose // YAML İçe Aktar'
                  : isPt
                  ? 'Reverse Compose // Importar YAML'
                  : 'Reverse Compose // Import YAML'}
                <span className="rounded-[2px] bg-[#1E1235] px-2 py-0.5 text-[9px] font-mono font-bold text-[#C084FC] border border-[#2B1A42]">
                  DIN 40719
                </span>
              </h2>
              <p className="text-xs text-[#8B7D9E] font-mono">
                {isTr
                  ? 'Mevcut docker-compose.yml dosyanızı 3 katmanlı görsel şemaya dönüştürün.'
                  : isPt
                  ? 'Converta seu arquivo docker-compose.yml em um esquema visual de 3 camadas.'
                  : 'Convert your docker-compose.yml into a 3-tier visual architectural schematic.'}
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
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-[#8B7D9E] uppercase tracking-wider">
                {isTr ? 'Örnekler:' : isPt ? 'Exemplos:' : 'Presets:'}
              </span>
              {SAMPLE_STACKS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setYamlText(s.yaml);
                    setError(null);
                  }}
                  className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2 py-0.5 text-[10px] font-mono text-[#A19BAF] hover:border-[#8B5CF6] hover:text-[#F5F3FF] transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-3 py-1 text-xs font-mono text-[#F5F3FF] hover:border-[#8B5CF6] hover:text-[#C084FC] transition-all">
              <Upload className="h-3.5 w-3.5 text-[#C084FC]" />
              <span>{isTr ? 'Dosya Seç (.yml)' : isPt ? 'Arquivo (.yml)' : 'Select File (.yml)'}</span>
              <input
                type="file"
                accept=".yml,.yaml,text/yaml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* YAML Editor Textarea */}
          <div className="relative">
            <textarea
              value={yamlText}
              onChange={(e) => {
                setYamlText(e.target.value);
                setError(null);
              }}
              placeholder={`version: '3.8'\nservices:\n  traefik:\n    image: traefik:v2.10\n    ports:\n      - "80:80"\n      - "443:443"\n  api:\n    image: node:18-alpine\n    ports:\n      - "3000:3000"\n    environment:\n      DATABASE_URL: postgres://user:pass@db:5432/app\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_PASSWORD: secret`}
              rows={9}
              className="w-full rounded-[2px] border border-[#2B1A42] bg-[#06030D] p-3.5 text-xs font-mono text-[#C4B5FD] placeholder-[#8B7D9E]/40 focus:outline-none focus:border-[#8B5CF6] resize-none scrollbar-thin scrollbar-thumb-[#2B1A42]"
            />

            {/* Live Telemetry Pill Overlay */}
            {previewAnalysis && previewAnalysis.errors.length === 0 && previewAnalysis.detectedServicesCount > 0 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-[2px] border border-[#2B1A42] bg-[#0D0719]/90 px-2.5 py-1 text-[10px] font-mono backdrop-blur-md">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  {previewAnalysis.detectedServicesCount} {isTr ? 'Servis' : 'Services'}
                </span>
                <span className="text-[#8B7D9E]">•</span>
                <span className="flex items-center gap-1 text-[#C084FC]">
                  <Sparkles className="h-3 w-3" />
                  {previewAnalysis.implicitDependenciesCount} {isTr ? 'Gizli Bağıntı' : 'Implicit Edges'}
                </span>
                <span className="text-[#8B7D9E]">•</span>
                <span className="text-[#A19BAF]">
                  3 {isTr ? 'Katmanlı Dizilim' : 'Tier Layout'}
                </span>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2 rounded-[2px] border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <pre className="whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}

          {/* Technical Spec Callout */}
          <div className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] p-3 text-xs font-mono text-[#8B7D9E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#8B5CF6]" />
              <span>
                {isTr
                  ? 'Otomatik Dizilim: [1] Proxy (x:100) ➔ [2] App (x:520) ➔ [3] DB/Cache (x:940)'
                  : 'Auto Layout: [1] Ingress (x:100) ➔ [2] App (x:520) ➔ [3] DB/Storage (x:940)'}
              </span>
            </div>
            <span className="text-[10px] text-[#A19BAF] hidden sm:inline">
              DIN 40719 Schematics
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2B1A42] bg-[#120A21] px-6 py-3.5">
          <p className="text-[11px] font-mono text-[#8B7D9E]">
            {isTr ? 'Tüm portlar otomatik röntgenden geçirilir.' : 'Ports are verified for collisions upon import.'}
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
