import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANTIC Quiz Challenge",
  description:
    "Quiz web app to help high school students prepare for the ANTIC computer science competition.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors`}
      >
        <SettingsProvider>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_0,rgba(248,113,113,0.08),transparent_30%),radial-gradient(circle_at_40%_70%,rgba(52,211,153,0.12),transparent_30%)] mix-blend-screen" />
            <main className="relative z-10">{children}</main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
