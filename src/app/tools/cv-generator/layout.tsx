import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'CV Generator ATS-Friendly Gratis | NOMSTD Tools',
  description: 'Bikin CV profesional, ATS-friendly, dan elegan secara instan dan 100% gratis dengan CV Generator NOMSTD. Download PDF langsung.',
  keywords: ['cv generator', 'cv ats friendly', 'bikin cv gratis', 'nomstd tools', 'cv maker'],
};

export default function CVGeneratorLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CV Generator NOMSTD",
    "url": "https://nomstd.my.id/tools/cv-generator",
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
