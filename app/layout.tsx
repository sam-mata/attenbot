// app/layout.tsx
import { Metadata } from 'next';
import PWAProvider from '../app/PWAProvider';
import './globals.css'; // Import global styles


export const metadata: Metadata = {
  title: 'AttenBot',
  description: 'A webcam narrator in the style of a BBC presenter',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    apple: '/high-res.png',
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
        <link rel="apple-touch-icon" href="/high-res.png" />
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