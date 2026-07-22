import { supabase } from '../supabase';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url?: string;
  media?: { type: 'image' | 'video'; url: string }[];
  created_at?: string;
}

const defaultShowcaseProjects: Omit<ProjectItem, 'id' | 'created_at'>[] = [
  // Web Development
  {
    title: 'Full Stack Portfolio & CMS System',
    description: 'Aplikasi web portfolio & CMS interaktif berbasis Next.js 16, Supabase RLS, dan Tailwind CSS dengan dashboard analitik real-time dan manajemen invoice.',
    category: 'web-development',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'POS (Point of Sale) Multi-Outlet SaaS System',
    description: 'Sistem kasir SaaS cloud multi-outlet dengan laporan keuangan real-time, pencetakan struk thermal bluetooth, integrasi QRIS otomatis, dan stok inventaris toko.',
    category: 'web-development',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'E-Commerce & Digital Products Marketplace',
    description: 'Platform toko online modern dengan integrasi Payment Gateway otomatis (Midtrans), pengiriman file instan, dan portal pelanggan.',
    category: 'web-development',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'Corporate Enterprise Portal & SSO Integration',
    description: 'Portal perusahaan berkinerja tinggi dengan keamanan enkripsi SSO, manajemen persetujuan dokumen, dan arsitektur server terdistribusi.',
    category: 'web-development',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop' }
    ]
  },

  // Graphic Design
  {
    title: 'NomTech Brand Identity & Guidelines',
    description: 'Sistem identitas visual komprehensif mencakup desain logo, tipografi khusus, palet warna brand, stationeries, dan pedoman penggunaan media sosial.',
    category: 'graphic-design',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1626785779571-3c1ae2e0325a?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'Premium Retail Packaging & Vector Art',
    description: 'Desain kemasan boks eksklusif dan cetakan elemen grafis vektor beresolusi tinggi untuk produk retail komersial.',
    category: 'graphic-design',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&auto=format&fit=crop' }
    ]
  },

  // Photography
  {
    title: 'Corporate Executive & Conference Coverage',
    description: 'Dokumentasi fotografi profesional untuk konferensi bisnis, seminar nasional, serta potret eksekutif perusahaan.',
    category: 'photography',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'Commercial Product Studio Shoot',
    description: 'Fotografi produk komersial dengan penataan pencahayaan studio kelas atas dan proses retouching warna mendalam.',
    category: 'photography',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop' }
    ]
  },

  // Videography
  {
    title: 'Cinematic Brand Commercial & Aftermovie',
    description: 'Video promosi berskala komersial dengan pengambilan gambar sinematik 4K, pencahayaan dramatis, dan color grading profesional.',
    category: 'videography',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'Social Media Reels & TikTok Campaign Pack',
    description: 'Paket video vertikal 9:16 untuk kebutuhan konten promosi rutin di Instagram Reels dan TikTok dengan transisi dinamis.',
    category: 'videography',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop' }
    ]
  },

  // IT Solutions
  {
    title: 'Custom Workstation & Gaming PC Assembly',
    description: 'Perakitan Custom PC performa tinggi untuk kebutuhan video editing 4K, 3D rendering, dan gaming berat dengan manajemen kabel rapi.',
    category: 'it-solutions',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1200&auto=format&fit=crop' }
    ]
  },
  {
    title: 'Enterprise Server Maintenance & Hardware Upgrade',
    description: 'Pembersihan thermal paste laptop, upgrade RAM & NVMe SSD, serta konfigurasi jaringan server kantor.',
    category: 'it-solutions',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1200&auto=format&fit=crop' }
    ]
  }
];

export async function fetchProjectsFromDatabase(categorySlug?: string): Promise<ProjectItem[]> {
  try {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (categorySlug) {
      query = query.eq('category', categorySlug);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects from Supabase database:', error);
    }

    if (data && data.length > 0) {
      return data as ProjectItem[];
    }

    // If database returned 0 projects, fallback to rich default showcase items for this category
    const filtered = categorySlug
      ? defaultShowcaseProjects.filter(p => p.category === categorySlug)
      : defaultShowcaseProjects;

    return filtered.map((item, idx) => ({
      ...item,
      id: `showcase-${categorySlug || 'all'}-${idx + 1}`
    }));
  } catch (err) {
    console.error('Exception fetching projects from database:', err);
    const filtered = categorySlug
      ? defaultShowcaseProjects.filter(p => p.category === categorySlug)
      : defaultShowcaseProjects;

    return filtered.map((item, idx) => ({
      ...item,
      id: `showcase-${categorySlug || 'all'}-${idx + 1}`
    }));
  }
}
