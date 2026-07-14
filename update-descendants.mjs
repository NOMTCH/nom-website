import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDescendants() {
  const packages = [
    {
      name: 'Landing Page (Express)',
      description: 'Sistem Landing Page terpadu untuk kampanye digital. Dioptimalkan untuk kecepatan akses dan konversi (ROI) tinggi.',
      features: [
        'Single-Page Application (SPA) Architecture',
        'High-Conversion UI/UX Design',
        'Mobile-First & Fully Responsive',
        'WhatsApp / Lead Form Integration',
        'Basic SEO Setup & Media Optimization',
        'Gratis Domain & Cloud Hosting (1 Tahun)'
      ]
    },
    {
      name: 'Company Profile',
      description: 'Website korporat multi-halaman dengan teknologi modern. Solusi arsitektur digital untuk kredibilitas perusahaan.',
      features: [
        'Premium Corporate UI/UX Design',
        'Modern Frontend Architecture (React based)',
        'Technical SEO Ready (Sitemap & Meta)',
        'Content Management System (CMS) Basic',
        'Social Media & Live Maps Integration',
        'Gratis Domain & Cloud Hosting (1 Tahun)'
      ]
    },
    {
      name: 'E-Commerce (Toko Online)',
      description: 'Platform digital commerce komprehensif. Dilengkapi automasi pembayaran dan logistik untuk skalabilitas bisnis.',
      features: [
        'Dynamic E-Commerce Architecture',
        'Automasi Payment Gateway (QRIS, VA, CC)',
        'Live Shipping Calculator (Ongkir Otomatis)',
        'Dashboard Admin & Order Management',
        'Advanced SSL & Transaction Security',
        'Gratis Domain & Cloud Hosting (1 Tahun)'
      ]
    }
  ];

  for (const pkg of packages) {
    const { error } = await supabase
      .from('pricing_packages')
      .update({
        description: pkg.description,
        features: pkg.features
      })
      .eq('name', pkg.name);

    if (error) {
      console.error('Error updating', pkg.name, error);
    } else {
      console.log('Successfully updated:', pkg.name);
    }
  }
}

updateDescendants();
