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
    default: "NOMSTD | Creative Agency, Web Development & IT Solutions Cianjur 🔥",
    template: "%s | NOMSTD - Creative & Tech Agency Cianjur"
  },
  description: "Creative agency & IT solutions paling asik di Cianjur, Jawa Barat. Jasa pembuatan website modern, desain grafis, foto, video cinematic, hingga sistem IT impian bisnis kamu. Let's build something crazy! 🚀",
  keywords: [
    "creative agency cianjur",
    "web development cianjur",
    "jasa pembuatan website cianjur",
    "jasa desain grafis cianjur",
    "studio fotografi cianjur",
    "videografi cianjur",
    "IT solutions jawa barat",
    "digital invitation cianjur",
    "brutalism web design",
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
    title: "NOMSTD | Creative Agency & IT Solutions Cianjur",
    description: "Jasa Pembuatan Website, Desain Grafis, Studio Foto & Video Cinematic di Cianjur, Jawa Barat. Bikin bisnis kamu makin keren!",
    url: "https://nomstd.my.id/",
    siteName: "NOMSTD",
    images: [
      {
        url: "/assets/logo/favicon.svg",
        width: 800,
        height: 600,
        alt: "NOMSTD Creative & Tech Agency Cianjur Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOMSTD | Creative Agency & IT Solutions Cianjur",
    description: "Creative agency & IT solutions paling asik di Cianjur, Jawa Barat. Jasa web development, desain, foto & video.",
    images: ["/assets/logo/favicon.svg"],
    creator: "@nomstd"
  },
  icons: {
    icon: '/assets/logo/favicon.svg'
  },
  other: {
    "google-adsense-account": "ca-pub-1093659666783969",
    "geo.region": "ID-JB",
    "geo.placename": "Cianjur",
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
    "description": "Creative agency & IT solutions terdepan di Cianjur. Melayani jasa pembuatan website, desain grafis, foto produk/event, videografi cinematic, dan IT software solutions.",
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
      { "@type": "City", "name": "Bandung" },
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
