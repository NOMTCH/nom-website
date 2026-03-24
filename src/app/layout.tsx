import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },

  title: {
    default: "NOM Studio — Jasa Desain Grafis, Website & Undangan Digital",
    template: "%s | NOM Studio",
  },

  description:
    "NOM Studio: Jasa desain grafis profesional, pembuatan website modern, dan undangan pernikahan digital elegan. Kreatif, cepat, dan terjangkau untuk bisnis & momen spesial Anda. Contact: nomstudiodesign@gmail.com",

  keywords: [
    // brand
    "NOM Studio",
    "nomstd",
    // core services — Indonesian
    "jasa desain grafis",
    "jasa pembuatan website",
    "undangan pernikahan digital",
    "undangan digital",
    "desain logo",
    "branding indonesia",
    "studio desain kreatif",
    "jasa web design",
    "desain undangan pernikahan",
    "desain grafis profesional",
    // core services — English
    "graphic design indonesia",
    "web design indonesia",
    "digital invitation indonesia",
    "logo design indonesia",
    "creative studio indonesia",
    "branding agency indonesia",
    // broader region
    "studio desain jawa barat",
    "desain grafis jawa barat",
    "desain grafis jakarta",
    "creative agency indonesia",
  ],

  creator: "NOM Studio (nomstudiodesign@gmail.com)",
  publisher: "NOM Studio",

  openGraph: {
    title: "NOM Studio — Desain Grafis, Web Design & Undangan Digital",
    description:
      "Studio kreatif Indonesia: desain grafis profesional, website modern, dan undangan digital untuk bisnis & acara spesial Anda. Kualitas premium. Instagram: @nomstd",
    type: "website",
    url: "https://nomstd.my.id",
    siteName: "NOM Studio",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NOM Studio — Creative Digital Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NOM Studio — Desain Grafis • Web • Undangan Digital",
    description:
      "Jasa desain profesional Indonesia. Dari logo hingga website custom dan undangan digital. @nomstd",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://nomstd.my.id",
  },

  metadataBase: new URL("https://nomstd.my.id"),

  category: "creative agency",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#20FF00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
