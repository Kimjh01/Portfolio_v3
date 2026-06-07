import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "portfolio",
  description: "김주호 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
