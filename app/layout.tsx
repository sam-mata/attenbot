import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATTENBOT",
  description: "A webcam narrator in the style of a certain BBC presenter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
