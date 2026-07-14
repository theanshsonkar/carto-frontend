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
  metadataBase: new URL("https://trycarto.theanshsonkar.workers.dev"),
  title: "Carto: package a repo once, every AI knows what breaks",
  description:
    "Your agent can change 40 files before you understand the first one. Carto packs your repo into one portable container, so any AI tool knows what breaks before the diff lands. One SQLite file. No cloud. MIT.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Carto",
    title: "Carto: package a repo once, every AI knows what breaks",
    description:
      "Your agent can change 40 files before you understand the first one. Carto packs your repo into one portable container, so any AI tool knows what breaks before the diff lands. One SQLite file. No cloud. MIT.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Carto: package a repo once, every AI knows what breaks before it changes anything.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carto: package a repo once, every AI knows what breaks",
    description:
      "Your agent can change 40 files before you understand the first one. Carto packs your repo into one portable container, so any AI tool knows what breaks before the diff lands. One SQLite file. No cloud. MIT.",
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
        {/* Cloudflare Web Analytics */}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "6167ad5aa8704f9f979eab47910a4e64"}'
        />
        {/* End Cloudflare Web Analytics */}
      </body>
    </html>
  );
}
