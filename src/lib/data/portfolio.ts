export interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface Album {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  photos: Photo[];
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  albums: Album[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  subcategories: Subcategory[];
}

// Dummy Data ready for Supabase Migration
export const portfolioData: Category[] = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capturing moments, telling stories through the lens.',
    coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      {
        id: 'wedding',
        title: 'Wedding',
        description: 'Timeless memories of your special day.',
        coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        albums: [
          {
            id: 'asep-ayu',
            title: 'Asep & Ayu',
            date: 'October 2025',
            coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
            photos: [
              { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', width: 800, height: 1200, alt: 'Asep Ayu Wedding 1' },
              { id: 'p2', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 800, alt: 'Asep Ayu Wedding 2' },
              { id: 'p3', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', width: 800, height: 1000, alt: 'Asep Ayu Wedding 3' },
              { id: 'p4', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop', width: 800, height: 1200, alt: 'Asep Ayu Wedding 4' },
              { id: 'p5', url: 'https://images.unsplash.com/photo-1583939000240-690b200b3e7c?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 800, alt: 'Asep Ayu Wedding 5' },
              { id: 'p6', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop', width: 800, height: 1200, alt: 'Asep Ayu Wedding 6' },
            ]
          },
          {
            id: 'budi-susi',
            title: 'Budi & Susi',
            date: 'August 2025',
            coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
            photos: [
              { id: 'b1', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 800, alt: 'Budi Susi 1' },
              { id: 'b2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', width: 800, height: 1200, alt: 'Budi Susi 2' },
            ]
          }
        ]
      },
      {
        id: 'corporate',
        title: 'Corporate Events',
        description: 'Professional coverage for your business events.',
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
        albums: [
          {
            id: 'tech-summit-2026',
            title: 'Tech Summit 2026',
            date: 'January 2026',
            coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
            photos: []
          }
        ]
      }
    ]
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Visual identities that make your brand stand out.',
    coverImage: 'https://images.unsplash.com/photo-1626785779571-3c1ae2e0325a?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      {
        id: 'branding',
        title: 'Branding & Logo',
        description: 'Complete brand identities.',
        coverImage: 'https://images.unsplash.com/photo-1626785779571-3c1ae2e0325a?q=80&w=800&auto=format&fit=crop',
        albums: []
      }
    ]
  },
  {
    id: 'videography',
    title: 'Videography',
    description: 'Cinematic storytelling and commercial videography.',
    coverImage: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      {
        id: 'commercial',
        title: 'Commercial',
        description: 'High-end commercial and promotional videos.',
        coverImage: 'https://images.unsplash.com/photo-1594474719119-a1b72e9dcc58?q=80&w=800&auto=format&fit=crop',
        albums: []
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Web Design & Dev',
    description: 'Modern, high-performance web applications and landing pages.',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      {
        id: 'saas',
        title: 'SaaS Dashboards',
        description: 'Intuitive and powerful software interfaces.',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        albums: []
      }
    ]
  },
  {
    id: 'it-solutions',
    title: 'IT Solutions',
    description: 'Hardware repair, PC building, and enterprise server maintenance.',
    coverImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      {
        id: 'pc-build',
        title: 'Custom PC Builds',
        description: 'High-end gaming and workstation rigs.',
        coverImage: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop',
        albums: []
      }
    ]
  }
];

// Helper functions to simulate database queries
export async function getCategories() {
  return portfolioData;
}

export async function getCategory(categoryId: string) {
  return portfolioData.find(c => c.id === categoryId);
}

export async function getSubcategory(categoryId: string, subId: string) {
  const category = await getCategory(categoryId);
  return category?.subcategories.find(s => s.id === subId);
}

export async function getAlbum(categoryId: string, subId: string, albumId: string) {
  const subcategory = await getSubcategory(categoryId, subId);
  return subcategory?.albums.find(a => a.id === albumId);
}
