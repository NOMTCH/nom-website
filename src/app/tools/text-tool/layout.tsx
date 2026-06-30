import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Case Converter & Word Counter Online Gratis | NOMSTD Tools',
  description: 'Tool pengubah huruf besar kecil (Title Case, UPPERCASE, Sentence Case), penghitung kata/karakter realtime, double space cleaner, dan estimasi waktu baca gratis.',
  keywords: ['case converter', 'word counter', 'hitung kata online', 'slugify text', 'nomstd tools', 'pengubah huruf kapital', 'word counter online'],
};

export default function TextToolLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Case Converter & Word Counter NOMSTD",
    "url": "https://nomstd.my.id/tools/text-tool",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript.",
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
