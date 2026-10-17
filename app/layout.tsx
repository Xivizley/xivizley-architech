import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'XIVIZLEY Architech — Visual Docker Canvas & Port Conflict Engine',
  description:
    'Industrial DIN 40719 visual Docker compose architect and deterministic port conflict resolution engine. 134+ modules, 33 curated stacks, 100% offline and client-side.',
  authors: [{ name: 'Alperen Celal Hoşça', url: 'https://github.com/alperencelal' }],
  keywords: [
    'docker-compose',
    'self-hosted',
    'port-conflict-detector',
    'react-flow',
    'homelab',
    'din-40719',
    'devops',
  ],
  openGraph: {
    title: 'XIVIZLEY Architech',
    description: 'Deterministic Visual Docker Architecture & Port Conflict Resolution Engine.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090514] text-[#F5F3FF] font-sans antialiased overflow-hidden selection:bg-[#8B5CF6]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
