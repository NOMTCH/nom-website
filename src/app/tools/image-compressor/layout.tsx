import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'WebP Converter & Image Compressor Gratis | NOMSTD Tools',
  description: 'Kompres gambar JPG, PNG, dan WebP secara instan 100% aman di browser tanpa server load. Resize dimensi lebar/tinggi dan atur kualitas kompresi gratis.',
  keywords: ['image compressor', 'webp converter', 'kompres gambar gratis', 'resize gambar', 'nomstd tools', 'webp maker', 'kompres foto online'],
};

export default function ImageCompressorLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WebP Converter & Image Compressor NOMSTD",
    "url": "https://nomstd.my.id/tools/image-compressor",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5 Canvas.",
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
