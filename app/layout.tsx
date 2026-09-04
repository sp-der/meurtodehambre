import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './brand.css';
import './quality.css';

const mestizo = localFont({
  src: './fonts/MestizoFont.ttf',
  variable: '--font-mestizo',
  display: 'swap',
  weight: '400',
  style: 'normal',
});

export const metadata: Metadata = {
  title: 'Muerto De Hambre Grill',
  description: 'Muerto De Hambre Grill. San Bernardino and Lawndale, California.',
  metadataBase: new URL('https://muertodehambre.com'),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Muerto De Hambre Grill',
    description: 'Come hungry.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mestizo.variable}>{children}</body>
    </html>
  );
}
