'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/shared/Navbar';
import { ModuleSidebar } from '@/components/sidebar/ModuleSidebar';
import { OutputPanel } from '@/components/output/OutputPanel';
import { useArchitectStore } from '@/store/useArchitectStore';
import { Loader2 } from 'lucide-react';
import { ToastContainer } from '@/components/shared/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { MobileNoticeBanner } from '@/components/shared/MobileNoticeBanner';
import { useI18nStore } from '@/lib/i18n/store';

import { BlueprintModal } from '@/components/modals/BlueprintModal';
import { ComposeImportModal } from '@/components/modals/ComposeImportModal';
import { CustomContainerModal } from '@/components/modals/CustomContainerModal';
import { AIDoctorModal } from '@/components/modals/AIDoctorModal';
import { TerminalSimulatorModal } from '@/components/modals/TerminalSimulatorModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { StoryCardModal } from '@/components/modals/StoryCardModal';
import { QuickStackPacksModal } from '@/components/canvas/QuickStackPacksModal';
import { CommandPalette } from '@/components/canvas/CommandPalette';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

function CanvasLoading() {
  const { lang } = useI18nStore();
  const text = lang === 'tr' ? 'Tuval yükleniyor...' : lang === 'pt' ? 'Carregando tela...' : 'Loading canvas...';
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#090514]">
      <div className="flex flex-col items-center gap-3 text-[#8B7D9E]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
        <p className="text-sm font-mono font-medium text-[#A19BAF]">{text}</p>
      </div>
    </div>
  );
}

const ArchitectCanvas = dynamic(
  () => import('@/components/canvas/ArchitectCanvas').then((m) => m.ArchitectCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoading />,
  },
);

export default function ArchitectPage() {
  const conflictCount = useArchitectStore((s) => s.conflictMap.size);
  const isPanelOpen = useArchitectStore((s) => s.isPanelOpen);
  const togglePanel = useArchitectStore((s) => s.togglePanel);

  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isCustomContainerOpen, setIsCustomContainerOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isStoryCardOpen, setIsStoryCardOpen] = useState(false);
  const [isStackPacksOpen, setIsStackPacksOpen] = useState(false);

  const { toasts, toast, dismiss } = useToast();
  const loadFromJson = useArchitectStore((s) => s.loadFromJson);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load from URL param or autosave on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const canvasParam = params.get('canvas');
    if (canvasParam) {
      try {
        const decoded = decodeURIComponent(atob(canvasParam));
        loadFromJson(decoded);
        toast('success', 'Mimari Yüklendi', 'URL üzerinden paylaşılan tuval yüklendi.');
        return;
      } catch {
        // Fall through
      }
    }

    // Try autosave
    const saved = localStorage.getItem('xivizley_architech_autosave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.nodes.length > 0) {
          loadFromJson(saved);
        }
      } catch {
        // Ignore
      }
    }
  }, [loadFromJson, toast]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#090514]">
      <MobileNoticeBanner />

      <Navbar
        conflictCount={conflictCount}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAIDoctor={() => setIsDoctorOpen(true)}
        onOpenCustomContainer={() => setIsCustomContainerOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenStackPacks={() => setIsStackPacksOpen(true)}
        onToast={toast}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <ModuleSidebar />

        <main className="relative @container flex-1 overflow-hidden">
          <ArchitectCanvas />
        </main>

        <OutputPanel isOpen={isPanelOpen} onToggle={togglePanel} />
      </div>

      {/* Modals */}
      <BlueprintModal isOpen={isBlueprintOpen} onClose={() => setIsBlueprintOpen(false)} />
      <ComposeImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onToast={toast} />
      <CustomContainerModal isOpen={isCustomContainerOpen} onClose={() => setIsCustomContainerOpen(false)} />
      <AIDoctorModal isOpen={isDoctorOpen} onClose={() => setIsDoctorOpen(false)} onToast={toast} />
      <TerminalSimulatorModal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} onToast={toast} />
      <StoryCardModal isOpen={isStoryCardOpen} onClose={() => setIsStoryCardOpen(false)} />
      <QuickStackPacksModal isOpen={isStackPacksOpen} onClose={() => setIsStackPacksOpen(false)} />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenDeploy={() => togglePanel()}
        onOpenPro={() => {}}
        onExportPng={() => {}}
        onExportSvg={() => {}}
        onToast={toast}
      />

      <OnboardingTour />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
