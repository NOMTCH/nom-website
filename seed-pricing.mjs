import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const packages = [
  // WEB DESIGN & DEV
  {
    name: 'Landing Page (Express)',
    price: '1500000',
    description: 'Bikin landing page kilat, desain responsif, siap buat promosi atau jualan online. Cocok buat UMKM.',
    category: 'Web Design & Dev',
    features: ['1 Halaman (One-Page)', 'Desain Responsif (Mobile & Desktop)', 'Copywriting Standar', 'Formulir Kontak (WhatsApp)', 'Gratis Domain & Hosting (1 Tahun)'],
    is_popular: false,
    sort_order: 1
  },
  {
    name: 'Company Profile',
    price: '3500000',
    description: 'Website profesional buat perusahaan biar makin terpercaya di mata klien.',
    category: 'Web Design & Dev',
    features: ['Hingga 5 Halaman', 'Desain UI/UX Premium', 'Integrasi Social Media & Maps', 'Panel Admin (CMS)', 'Gratis Domain & Hosting (1 Tahun)', 'Support 1 Bulan'],
    is_popular: true,
    sort_order: 2
  },
  {
    name: 'E-Commerce (Toko Online)',
    price: '7500000',
    description: 'Website jualan canggih, ada keranjang belanja dan ongkir otomatis.',
    category: 'Web Design & Dev',
    features: ['Halaman Tak Terbatas', 'Keranjang Belanja (Cart)', 'Hitung Ongkir Otomatis', 'Payment Gateway (Qris, VA, dll)', 'Panel Admin Lengkap', 'Gratis Domain & Hosting (1 Tahun)'],
    is_popular: false,
    sort_order: 3
  },

  // GRAPHIC DESIGN
  {
    name: 'Logo Basic',
    price: '500000',
    description: 'Logo simpel dan elegan buat naikin branding jualan lu.',
    category: 'Graphic Design',
    features: ['2 Konsep Desain', '3x Revisi', 'File Master (AI/EPS)', 'File Export (PNG/JPG)', 'Pengerjaan 3 Hari'],
    is_popular: false,
    sort_order: 1
  },
  {
    name: 'Branding Identity',
    price: '1500000',
    description: 'Paket komplit buat yang baru buka usaha. Semua keperluan desain beres.',
    category: 'Graphic Design',
    features: ['Desain Logo Premium', 'Desain Kartu Nama', 'Kop Surat & Stempel', 'Desain Feed IG (5 Post)', 'File Master Lengkap', 'Revisi Sepuasnya'],
    is_popular: true,
    sort_order: 2
  },

  // PHOTOGRAPHY
  {
    name: 'Product Catalog',
    price: '1000000',
    description: 'Foto produk estetik buat jualan di e-commerce atau sosmed.',
    category: 'Photography',
    features: ['Maksimal 20 Produk', 'Editing Warna (Retouching)', 'Properti Standar Studio', 'Konsep Minimalis / Estetik', 'Semua File Original', 'Pengerjaan 2 Hari'],
    is_popular: false,
    sort_order: 1
  },
  {
    name: 'Wedding Documentation',
    price: '3500000',
    description: 'Dokumentasi momen sakral lu biar bisa dikenang selamanya.',
    category: 'Photography',
    features: ['1 Fotografer + 1 Asisten', 'Unlimited Shoot (Seharian)', '100 Foto Edit Profesional', 'Album Kolase Eksklusif', 'Flashdisk Softcopy'],
    is_popular: true,
    sort_order: 2
  },

  // VIDEOGRAPHY
  {
    name: 'Short Commercial',
    price: '2500000',
    description: 'Video promosi singkat (Reels/TikTok) yang eye-catching dan viral.',
    category: 'Videography',
    features: ['Konsep & Storyboard', 'Shooting Setengah Hari', 'Durasi 30-60 Detik', 'Editing Cinematic', 'Bebas Copyright Musik', '1x Revisi Editing'],
    is_popular: true,
    sort_order: 1
  },
  {
    name: 'Cinematic Wedding',
    price: '4500000',
    description: 'Video wedding rasa film layar lebar. Bikin merinding pas ditonton.',
    category: 'Videography',
    features: ['2 Videografer', 'Shooting Seharian Penuh', 'Highlight Video (3 Menit)', 'Full Video (30 Menit)', 'Drone Footage', 'Color Grading Cinematic'],
    is_popular: false,
    sort_order: 2
  },

  // IT SOLUTIONS
  {
    name: 'Laptop / PC Tune-up',
    price: '250000',
    description: 'Laptop ngelag? Bawa sini, kita sulap jadi ngebut lagi kayak baru.',
    category: 'IT Solutions',
    features: ['Pembersihan Debu Dalam', 'Ganti Thermal Paste', 'Install Ulang OS (Bila Perlu)', 'Optimasi Software', 'Pengecekan Virus'],
    is_popular: true,
    sort_order: 1
  },
  {
    name: 'Custom PC Build',
    price: '500000',
    description: 'Jasa rakit PC impian. Tinggal bawa parts, kita rakitin rapih.',
    category: 'IT Solutions',
    features: ['Perakitan Komponen', 'Cable Management Rapih', 'Install OS & Driver', 'Stress Test & Benchmark', 'Konsultasi Spek Gratis'],
    is_popular: false,
    sort_order: 2
  }
];

async function seed() {
  console.log('Seeding pricing packages...');
  
  // First, empty the table
  const { error: delError } = await supabase.from('pricing_packages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.error('Error deleting old data:', delError);
  }

  // Insert new ones
  for (const pkg of packages) {
    const { error } = await supabase.from('pricing_packages').insert([pkg]);
    if (error) {
      console.error('Error inserting', pkg.name, error);
    } else {
      console.log('Inserted:', pkg.name);
    }
  }

  console.log('Done seeding!');
}

seed();
