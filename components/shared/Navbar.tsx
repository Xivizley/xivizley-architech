'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  UploadCloud,
  Camera,
  Share2,
  Sparkles,
  Plus,
  Boxes,
  Globe,
  Check,
  Save,
} from 'lucide-react';
import { useI18nStore, useTranslation } from '@/lib/i18n/store';
import { useArchitectStore } from '@/store/useArchitectStore';
import { exportCanvasAsPng } from '@/lib/utils/exportCanvasImage';

interface NavbarProps {
  conflictCount?: number;
  onOpenDeploy?: () => void;
  onOpenBlueprint?: () => void;
  onOpenImport?: () => void;
  onOpenAIDoctor?: () => void;
  onOpenCustomContainer?: () => void;
  onOpenShare?: () => void;
  onOpenStackPacks?: () => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export function Navbar({
  conflictCount = 0,
  onOpenBlueprint,
  onOpenImport,
  onOpenAIDoctor,
  onOpenCustomContainer,
  onOpenShare,
  onOpenStackPacks,
  onToast,
}: NavbarProps) {
  const { lang, setLang } = useI18nStore();
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const isTr = lang === 'tr';
  const isPt = lang === 'pt';

  const nodes = useArchitectStore((s) => s.nodes);

  const handleExportPng = async () => {
    setIsExporting(true);
    try {
      await exportCanvasAsPng('xivizley-architech.png');
      onToast?.(
        'success',
        isTr ? 'Görsel İndirildi' : isPt ? 'Imagem Baixada' : 'Image Downloaded',
        isTr ? 'Yüksek çözünürlüklü şematik kaydedildi.' : 'High-res schematic exported.'
      );
    } catch {
      onToast?.(
        'error',
        isTr ? 'Dışa Aktarma Hatası' : 'Export Failed',
        isTr ? 'Tuval görseli oluşturulamadı.' : 'Could not generate canvas image.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    try {
      const state = useArchitectStore.getState();
      const payload = JSON.stringify({
        nodes: state.nodes,
        edges: state.edges,
        timestamp: Date.now(),
      });
      localStorage.setItem('xivizley_architech_autosave', payload);
      onToast?.(
        'success',
        isTr ? 'Kaydedildi' : isPt ? 'Salvo' : 'Saved',
        isTr ? `${nodes.length} servis yerel tarayıcıya yedeklendi.` : `${nodes.length} services saved to local storage.`
      );
    } catch {
      onToast?.('error', 'Kayıt Hatası', 'Local storage error.');
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-13 w-full items-center justify-between border-b border-[#2B1A42] bg-[#090514]/95 px-4 backdrop-blur-md">
      {/* Brand & DIN 40719 Industrial Stamp */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#8B5CF6]/50 bg-[#120A21] text-[#C084FC] shadow-sm">
            <Boxes className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-black tracking-wider text-[#F5F3FF]">
                XIVIZLEY <span className="text-[#8B5CF6]">ARCHITECH</span>
              </span>
              <span className="rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#A78BFA]">
                DIN 40719
              </span>
              <span className="hidden sm:inline rounded-[2px] border border-emerald-500/30 bg-emerald-950/40 px-1 py-0.2 font-mono text-[9px] text-emerald-400">
                v1.0.0 CORE
              </span>
            </div>
            <span className="hidden md:inline font-mono text-[9px] text-[#8B7D9E]">
              {isTr ? 'Açık Kaynak Deterministik Docker Mimarisi' : 'Open-Source Deterministic Docker Engine'}
            </span>
          </div>
        </div>

        {/* Conflict Warning Badge if any */}
        {conflictCount > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 rounded-[2px] border border-rose-500/50 bg-rose-950/40 px-2 py-0.5 text-[11px] font-mono text-rose-300 animate-pulse">
            <span>⚠️</span>
            <span>{conflictCount} {isTr ? 'Port Çakışması' : 'Port Conflicts'}</span>
          </div>
        )}
      </div>

      {/* Center Canvas Tools */}
      <div className="hidden xl:flex items-center gap-1.5">
        {onOpenStackPacks && (
          <button
            onClick={onOpenStackPacks}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          >
            <Boxes className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>{isTr ? 'Şablonlar (33 Stack)' : 'Templates (33 Stacks)'}</span>
          </button>
        )}

        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          >
            <UploadCloud className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{isTr ? 'Compose İçe Aktar' : 'Import Compose'}</span>
          </button>
        )}

        {onOpenBlueprint && (
          <button
            onClick={onOpenBlueprint}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          >
            <FileText className="h-3.5 w-3.5 text-[#C084FC]" />
            <span>DIN // BLUEPRINT</span>
          </button>
        )}

        {onOpenCustomContainer && (
          <button
            onClick={onOpenCustomContainer}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isTr ? 'Özel Konteyner' : 'Custom Container'}</span>
          </button>
        )}

        {onOpenAIDoctor && (
          <button
            onClick={onOpenAIDoctor}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{isTr ? 'AI Doktor' : 'AI Doctor'}</span>
          </button>
        )}
      </div>

      {/* Right Controls: Save, PNG, Share, Language, GitHub */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          title={isTr ? 'Tarayıcıya Kaydet' : 'Save to Browser'}
        >
          <Save className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isTr ? 'Kaydet' : 'Save'}</span>
        </button>

        <button
          onClick={handleExportPng}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          title={isTr ? 'Yüksek Çözünürlüklü PNG' : 'High-Res PNG'}
        >
          <Camera className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">PNG</span>
        </button>

        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
            title={isTr ? 'Mimarini Paylaş' : 'Share Architecture'}
          >
            <Share2 className="h-3.5 w-3.5 text-[#C084FC]" />
            <span className="hidden sm:inline">{isTr ? 'Paylaş' : 'Share'}</span>
          </button>
        )}

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2 py-1 font-mono text-xs text-[#A19BAF] transition-all hover:border-[#8B5CF6] hover:text-[#F5F3FF]"
          >
            <Globe className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span className="uppercase">{lang}</span>
          </button>
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-1 w-24 rounded-[2px] border border-[#2B1A42] bg-[#0D0719] shadow-2xl py-1 z-50">
              {(['tr', 'en', 'pt'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setIsLangMenuOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-1 font-mono text-xs text-left transition-colors',
                    lang === l ? 'bg-[#1E1235] text-[#C084FC]' : 'text-[#A19BAF] hover:bg-[#120A21] hover:text-[#F5F3FF]'
                  )}
                >
                  <span className="uppercase">{l}</span>
                  {lang === l && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/Xivizley/xivizley-architech"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-[2px] border border-[#2B1A42] bg-[#120A21] px-2.5 py-1 font-mono text-xs text-[#F5F3FF] transition-all hover:border-[#8B5CF6] hover:bg-[#1E1235]"
          title="GitHub Repository (MIT)"
        >
          <svg className="h-3.5 w-3.5 fill-[#C084FC]" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="hidden md:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
