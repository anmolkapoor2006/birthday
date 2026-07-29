import type { Metadata, Viewport } from "next";
import { Dancing_Script, Quicksand, Caveat } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Happy Birthday Priya 💖 | A Surprise For You",
  description: "A beautiful romantic birthday surprise microsite for Priya",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dancingScript.variable} ${quicksand.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <title>Happy Birthday Priya 💖 | A Surprise For You</title>
        <meta name="description" content="A beautiful romantic birthday surprise microsite for Priya" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💖</text></svg>"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF6F0] text-gray-800" suppressHydrationWarning>{children}</body>
    </html>
  );
}
