import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoAI Research - AI-Powered Crypto Analysis',
  description:
    'Advanced cryptocurrency research platform powered by AI. Real-time market data, technical analysis, and natural language insights.',
  keywords: [
    'cryptocurrency',
    'crypto analysis',
    'AI trading',
    'technical analysis',
    'market research',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
