import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trycarto.pages.dev"),
  title: "Carto - the portable AI container for your codebase",
  description:
    "Package a repo once. Every AI tool understands it in seconds and knows what breaks before it changes anything. One SQLite file. No cloud. MIT.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Carto",
    title: "Carto - the portable AI container for your codebase",
    description:
      "Package a repo once. Every AI tool understands it in seconds and knows what breaks before it changes anything. One SQLite file. No cloud. MIT.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Carto: package a repo once, every AI understands it.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carto - the portable AI container for your codebase",
    description:
      "Package a repo once. Every AI tool understands it in seconds and knows what breaks before it changes anything. One SQLite file. No cloud. MIT.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
