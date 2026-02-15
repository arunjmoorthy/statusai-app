import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StatusAI - AI-Powered Status Pages",
  description: "Beautiful status pages powered by AI. Keep your customers informed with AI-generated incident updates, smart notifications, and stunning status pages that build trust.",
  keywords: ["status page", "incident management", "AI", "uptime monitoring", "SaaS"],
  authors: [{ name: "StatusAI" }],
  openGraph: {
    title: "StatusAI - AI-Powered Status Pages",
    description: "Beautiful status pages powered by AI. Keep your customers informed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
