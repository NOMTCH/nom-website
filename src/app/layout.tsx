import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MonoAssistant } from "@/components/MonoAssistant";
import { JsonLd } from "@/components/JsonLd";
import Script from "next/script";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nomstd.my.id/'),
  title: "NOMSTD | Creative, Tech & Beyond 🔥",
  description: "Creative agency & IT solutions paling asik buat bisnis lo. Bikin desain, foto, video, sampai website yang gak bosenin. Let's build something crazy! 🚀",
  keywords: ["creative agency", "web development", "photography", "videography", "graphic design", "IT solutions", "brutalism design"],
  openGraph: {
    title: "NOMSTD | Creative & Tech",
    description: "Creative agency & IT solutions paling asik buat bisnis lo. Bikin desain, foto, video, sampai website yang gak bosenin.",
    url: "https://nomstd.my.id/",
    siteName: "NOMSTD",
    images: [
      {
        url: "/assets/logo/favicon.svg",
        width: 800,
        height: 600,
        alt: "NOMSTD Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: '/assets/logo/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NOMSTD",
    "url": "https://nomstd.my.id/",
    "logo": "https://nomstd.my.id/assets/logo/favicon.svg",
    "sameAs": [
      "https://www.instagram.com/nomstd/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-821-3070-4794",
      "contactType": "customer service",
      "email": "admin@nomstudio.com"
    }
  };

  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1093659666783969"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground relative">
        <JsonLd schema={orgSchema} />
        {children}
        <MonoAssistant />
      </body>
    </html>
  );
}
