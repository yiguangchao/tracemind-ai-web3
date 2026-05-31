import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tracemind AI Web3',
  description: 'AI Web3 Transaction Explainer for Sepolia testnet transactions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
