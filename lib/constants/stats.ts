/**
 * Single source of truth for platform statistics and catalog numbers.
 * Derived directly from MODULE_CATALOG (134) and STACK_TEMPLATES (33).
 */
export const PLATFORM_STATS = {
  totalModules: 134,
  totalTemplates: 33,
  modulesDisplay: '134',
  templatesDisplay: '33',
  // Single source of truth for the Suite release label/stage.
  // Keep every UI reference (landing, /suite, navbar, installer) fed from here
  // so the public version can never drift out of sync again.
  suiteVersion: 'v1.0',
  suiteStage: 'Stable',
  suiteLabel: 'v1.0',
  suiteInstallCmd: 'curl -fsSL https://xivizley.com.tr/suite/install | sudo bash',
  // Product Architecture Pillars
  architechName: 'XIVIZLEY Architech',
  spaceName: 'XIVIZLEY Space',
  engineName: 'XIVIZLEY Engine',
  sentinelName: 'XIVIZLEY Sentinel',
  taglineTr: "XIVIZLEY, 134 Docker servisini görsel tuvalde sürükle-bırak bağlayıp tek SSH komutuyla VDS'e kuran, ücretsiz ve MIT lisanslı self-host mimarlık aracıdır.",
  taglineEn: "XIVIZLEY is a free, visual self-hosted architecture tool to connect 134 Docker services via canvas and deploy via SSH.",
} as const;
