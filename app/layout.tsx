import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Free Fire Inspector — Live player intelligence',
  description: 'Explorez les profils Free Fire, vérifiez les passerelles officielles et inspectez les données joueur en temps réel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr" className="bg-background"><body className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>{children}</body></html>;
}
