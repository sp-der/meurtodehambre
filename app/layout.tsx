import type { Metadata } from 'next';
import './globals.css';
import './brand.css';

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
