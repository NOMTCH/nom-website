import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'NOM-LINK | Bio Link Builder Neo-Pop Gratis | NOMSTD Tools',
  description: 'Bikin bio link bergaya Neo-Pop / Neo-Brutalist yang unik dan keren buat profil Instagram & TikTok lo. Gampang, instan, gratis dari NOMSTD.',
  keywords: ['bio link builder', 'nom-link', 'linktree alternative', 'neo brutalism link', 'nomstd tools', 'free bio link'],
};

export default function LinkBuilderLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NOM-LINK Builder",
    "url": "https://nomstd.my.id/tools/link-builder",
    "applicationCategory": "UtilitiesApplication",
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
