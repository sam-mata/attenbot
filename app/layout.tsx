// app/layout.tsx
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATTENBOT',
  description: 'A webcam narrator in the style of a BBC presenter',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ATTENBOT',
  },
  icons: {
    apple: '/high-res.png',
    icon: '/high-res.png'
  },
  formatDetection: {
    telephone: false,
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
        <meta name="application-name" content="ATTENBOT" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ATTENBOT" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/high-res.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/high-res.png" />
      </head>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}