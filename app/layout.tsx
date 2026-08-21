import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muerto De Hambre Grill',
  description: 'Muerto De Hambre Grill. Two Southern California locations, one serious appetite.',
  metadataBase: new URL('https://muertodehambre.com'),
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
