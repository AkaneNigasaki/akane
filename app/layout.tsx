import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Free Fire Player Info & API Inspector',
  description: 'Récupération en temps réel des profils et statistiques de joueurs Free Fire, avec testeur d\'API en direct et liens officiels vérifiés non dépréciés.',
  openGraph: {
    title: 'Free Fire Player Info & API Inspector',
    description: 'Récupération en temps réel des profils et statistiques de joueurs Free Fire, avec testeur d\'API en direct et liens officiels vérifiés non dépréciés.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fire Player Info & API Inspector',
    description: 'Récupération en temps réel des profils et statistiques de joueurs Free Fire, avec testeur d\'API en direct et liens officiels vérifiés non dépréciés.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
