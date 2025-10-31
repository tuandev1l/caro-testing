import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Caro Game - Online Multiplayer Gomoku',
  description:
    'Play Caro (Gomoku) online with real-time multiplayer, Elo rankings, and competitive gameplay',
  keywords: ['caro', 'gomoku', 'online game', 'multiplayer', 'board game'],
  authors: [{ name: 'Caro Game Team' }],
  openGraph: {
    title: 'Caro Game - Online Multiplayer Gomoku',
    description: 'Play Caro (Gomoku) online with real-time multiplayer',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
