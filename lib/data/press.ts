// ============================================================
// XIVIZLEY — Press & Media Kit Dataset
// lib/data/press.ts
// Single source of truth for journalists, partners, and institutions
// ============================================================

export interface PressKitData {
  title: string;
  tagline: string;
  oneParagraphSummary: string;
  founder: {
    name: string;
    title: string;
    affiliation: string;
    location: string;
  };
  keyFacts: {
    label: string;
    value: string;
    detail: string;
  }[];
  contacts: {
    type: string;
    email: string;
    description: string;
  }[];
  verifiedTestingEnvironment: {
    provider: string;
    datacenter: string;
    verifiedThroughput: string;
    latency: string;
    note: string;
  };
  openSourceCli: {
    package: string;
    repoUrl: string;
    quickCommand: string;
  };
  products: {
    name: string;
    badge: string;
    description: string;
  }[];
}

export const PRESS_KIT: PressKitData = {
  title: 'XIVIZLEY',
  tagline: '134 Docker Servisi ve 33 Mimari Şablonu İçin Görsel Tasarım ve Dağıtım İstasyonu',
  oneParagraphSummary:
    'XIVIZLEY, Linux VDS ve ev sunucuları için 134 popüler Docker servisini görsel bir tuval üzerinde bağlayarak port çakışmalarını deterministik olarak çözen, DIN 40719 endüstriyel şartnameleri, Kubernetes manifestoları ve Helm 3 paketleri üreten, TÜBİTAK 2204-A kapsamında geliştirilmiş açık kaynaklı (MIT) bir sistem mimarlığı platformudur.',
  founder: {
    name: 'Alperen Celal Hoşça',
    title: 'Kurucu & Sistem Mimarı (Lise 9. Sınıf Öğrencisi)',
    affiliation: 'TÜBİTAK 2204-A Lise Öğrencileri Araştırma Projeleri',
    location: 'Bursa, Türkiye',
  },
  keyFacts: [
    {
      label: 'Katalog Kapsamı',
      value: '134 Modül & 33 Şablon',
      detail: 'AdGuard, Nextcloud, Vaultwarden, Postgres, Redis ve 130+ kurumsal servis.',
    },
    {
      label: 'Çakışma Çözücü',
      value: 'Deterministik Sıfır Hata',
      detail: 'Dağıtım öncesi port ve ağ çakışmalarını tarayıcıda matematiksel olarak çözer.',
    },
    {
      label: 'Endüstriyel İhracat',
      value: 'DIN 40719, K8s & Helm 3',
      detail: 'Teknik pafta çizimi, Kubernetes PVC/Secret ayrımı ve Helm 3 paket üretimi.',
    },
    {
      label: 'Lisans Modeli',
      value: 'MIT Lisansı',
      detail: 'Kişisel veri toplamayan, şeffaf ve denetlenebilir açık kaynak çekirdek.',
    },
  ],
  contacts: [
    {
      type: 'Genel İletişim & İş Birlikleri',
      email: 'alperen@xivizley.com.tr',
      description: 'Basın soruları, kurumsal yazışmalar ve altyapı entegrasyonu görüşmeleri için.',
    },
    {
      type: 'Teknik Destek',
      email: 'destek@xivizley.com.tr',
      description: 'Platform kullanımı, hata bildirimleri ve mimari yardım için.',
    },
  ],
  verifiedTestingEnvironment: {
    provider: 'Hosting.com.tr Altyapı Ağı (AS42868)',
    datacenter: 'Bursa PenDC Tier-3',
    verifiedThroughput: '13.313 4K IOPS • 584 MB/s Okuma • 772 MB/s Yazma',
    latency: '1,87 ms Ortalama Ağ Gecikmesi',
    note: 'XIVIZLEY mimarileri, bağımsız olarak kiralanan Bursa PenDC Tier-3 test sunucusu üzerinde doğrudan çalıştırılarak doğrulanmıştır. Herhangi bir sponsorluk veya onay ilişkisi içermez.',
  },
  openSourceCli: {
    package: 'xivizley',
    repoUrl: 'https://github.com/Xivizley/xivizley-cli',
    quickCommand: 'npx xivizley',
  },
  products: [
    {
      name: 'XIVIZLEY Architech',
      badge: '/architect',
      description: '134 Docker servisini görsel tuvalde bağlayan, deterministik port çakışması çözücü ve DIN 40719 pafta üreteci.',
    },
    {
      name: 'XIVIZLEY Space',
      badge: '/suite',
      description: 'Nextcloud Hub standartlarında kişisel bulut, parola kasası, oyun sunucu konsolu ve izleme merkezi.',
    },
    {
      name: 'XIVIZLEY Engine',
      badge: 'npx xivizley',
      description: 'İnteraktif terminal dağıtım motoru, 33 hazır üretim stack\'i ve tek satır SSH ile Linux VDS kurulumu.',
    },
    {
      name: 'XIVIZLEY Sentinel',
      badge: 'VDS Telemetri',
      description: 'VDS sunucusu için yazılımsal gözcü radarı; CPU/RAM/Disk kullanımı, konteyner sağlığı, SSL süresi ve bildirimler.',
    },
  ],
};
