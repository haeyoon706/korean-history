import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "한국사 타임라인 — 영화·드라마로 보는 한국 역사",
  description:
    "한국사 시대별 영화와 드라마를 타임라인으로 탐색하세요. 고조선부터 현대까지, 조선시대는 왕별로 세분화된 콘텐츠를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          <p>한국사 타임라인 — 영화·드라마로 보는 한국 역사</p>
        </footer>
      </body>
    </html>
  );
}
