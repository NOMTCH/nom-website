import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MonoAssistant } from "@/components/MonoAssistant";
import { JsonLd } from "@/components/JsonLd";
import { VisitorTracker } from "@/components/VisitorTracker";
import Script from "next/script";
import { Suspense } from "react";

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
  title: {
    default: "NOMSTD | Jasa Pembuatan Website, Desain Grafis & IT Solutions Cianjur, Cipanas, Sukabumi, Bandung 🔥",
    template: "%s | NOMSTD - Creative & Tech Agency Cipanas Cianjur"
  },
  description: "Jasa pembuatan website profesional, desain grafis, foto produk & video cinematic terbaik di Cipanas, Cianjur, Bandung, Sukabumi, & Purwakarta. Solusi digital terpercaya untuk bisnis & UMKM Jawa Barat! 🚀",
  keywords: [
    "jasa pembuatan website cianjur",
    "jasa pembuatan website cipanas",
    "jasa pembuatan website sukabumi",
    "jasa pembuatan website purwakarta",
    "jasa pembuatan website bandung",
    "tempat buat website cianjur",
    "tempat buat website cipanas",
    "web design cianjur",
    "web design cipanas",
    "web development cianjur",
    "jasa desain grafis cianjur",
    "jasa desain grafis cipanas",
    "jasa desain grafis sukabumi",
    "jasa desain grafis purwakarta",
    "jasa desain grafis bandung",
    "bikin website cianjur",
    "bikin logo cianjur cipanas",
    "studio fotografi cianjur cipanas",
    "videografi cianjur cipanas",
    "IT solutions jawa barat",
    "digital invitation cianjur cipanas",
    "NOMSTD"
  ],
  authors: [{ name: "NOMSTD", url: "https://nomstd.my.id" }],
  creator: "NOMSTD",
  publisher: "NOMSTD Studio",
  alternates: {
    canonical: 'https://nomstd.my.id/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google967396e2fa803fb4',
  },
  openGraph: {
    title: "NOMSTD | Jasa Pembuatan Website & Desain Grafis Cianjur, Cipanas, Sukabumi, Bandung",
    description: "Jasa Pembuatan Website Modern, Desain Grafis, Foto & Video Cinematic di Cipanas, Cianjur, Bandung, Sukabumi, & Purwakarta.",
    url: "https://nomstd.my.id/",
    siteName: "NOMSTD",
    images: [
      {
        url: "/assets/logo/favicon.svg",
        width: 800,
        height: 600,
        alt: "NOMSTD Creative & Tech Agency Cipanas Cianjur Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOMSTD | Jasa Web Design & Desain Grafis Cipanas Cianjur Sukabumi Bandung",
    description: "Jasa pembuatan website modern, desain grafis, foto & video di Cipanas, Cianjur, Sukabumi, Purwakarta & Bandung.",
    images: ["/assets/logo/favicon.svg"],
    creator: "@nomstd"
  },
  icons: {
    icon: '/assets/logo/favicon.svg'
  },
  other: {
    "google-adsense-account": "ca-pub-1093659666783969",
    "geo.region": "ID-JB",
    "geo.placename": "Cianjur, Cipanas, Sukabumi, Bandung, Purwakarta",
    "geo.position": "-6.8242;107.1413",
    "ICBM": "-6.8242, 107.1413"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": "https://nomstd.my.id/#organization",
    "name": "NOMSTD Studio",
    "url": "https://nomstd.my.id/",
    "logo": "https://nomstd.my.id/assets/logo/favicon.svg",
    "image": "https://nomstd.my.id/assets/logo/favicon.svg",
    "description": "Creative agency & IT solutions terdepan melayani Cipanas, Cianjur, Sukabumi, Purwakarta, dan Bandung, Jawa Barat. Jasa pembuatan website, desain grafis, foto produk/event, videografi cinematic, dan IT software solutions.",
    "telephone": "+62-821-3070-4794",
    "email": "admin@nomstudio.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cianjur",
      "addressRegion": "Jawa Barat",
      "postalCode": "43211",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.8242,
      "longitude": 107.1413
    },
    "areaServed": [
      { "@type": "City", "name": "Cianjur" },
      { "@type": "City", "name": "Cipanas" },
      { "@type": "City", "name": "Sukabumi" },
      { "@type": "City", "name": "Purwakarta" },
      { "@type": "City", "name": "Bandung" },
      { "@type": "City", "name": "Bogor" },
      { "@type": "City", "name": "Jakarta" },
      { "@type": "State", "name": "Jawa Barat" },
      { "@type": "Country", "name": "Indonesia" }
    ],
    "sameAs": [
      "https://www.instagram.com/nomstd/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-821-3070-4794",
      "contactType": "customer service",
      "email": "admin@nomstudio.com",
      "availableLanguage": ["Indonesian", "English"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://nomstd.my.id/#website",
    "url": "https://nomstd.my.id/",
    "name": "NOMSTD",
    "description": "Creative Agency & IT Solutions Cianjur",
    "publisher": {
      "@id": "https://nomstd.my.id/#organization"
    },
    "inLanguage": "id-ID"
  };

  return (
    <html
      lang="id"
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
        <JsonLd schema={localBusinessSchema} />
        <JsonLd schema={websiteSchema} />
        <Suspense fallback={null}>
          <VisitorTracker />
        </Suspense>
        {children}
        <MonoAssistant />
      </body>
    </html>
  );
}
