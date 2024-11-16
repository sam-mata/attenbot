// app/layout.tsx
import { Metadata } from 'next';
import PWAProvider from '../app/PWAProvider';

export const metadata: Metadata = {
  title: 'AttenBot',
  description: 'A webcam narrator in the style of a BBC presenter',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body>
        <PWAProvider />
        {children}
      </body>
    </html>
  );
}