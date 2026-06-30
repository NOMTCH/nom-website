import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Grid & Collage Maker Gratis | NOMSTD',
  description: 'Gabungkan banyak foto menjadi grid atau kolase aesthetic bergaya Neo-Brutalist dan Film Strip tanpa install aplikasi. 100% Gratis dan aman di browser.',
  openGraph: {
    title: 'Photo Grid & Collage Maker Gratis | NOMSTD',
    description: 'Gabungkan banyak foto menjadi grid atau kolase aesthetic bergaya Neo-Brutalist dan Film Strip tanpa install aplikasi. 100% Gratis dan aman di browser.',
    type: 'website',
  },
};

export default function PhotoGridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
