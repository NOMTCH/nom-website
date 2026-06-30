import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'QR Code Generator Gratis & Standee Cetak 3R | NOMSTD Tools',
  description: 'Bikin QR Code custom dengan logo bisnis atau standee kartu akrilik siap cetak (3R Card) gratis. Cocok untuk WiFi Cafe, WhatsApp Chat, Link Menu UMKM.',
  keywords: ['qr code generator', 'bikin qr code gratis', 'qris standee', 'qr wifi cafe', 'nomstd tools', 'kartu qr siap cetak'],
};

export default function QrGeneratorLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QR Code Generator NOMSTD",
    "url": "https://nomstd.my.id/tools/qr-generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    }
  };

  return (
    <>
      <JsonLd schema={schemaMarkup} />
      {children}
    </>
  );
}
