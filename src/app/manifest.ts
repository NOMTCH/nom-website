import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NOMSTD | Creative Agency & IT Solutions Cianjur',
    short_name: 'NOMSTD',
    description: 'Creative agency & IT solutions paling asik di Cianjur, Jawa Barat. Pembuatan website, desain grafis, foto & video cinematic.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/assets/logo/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
