import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateWebDevPackages() {
  const updates = [
    {
      name: 'Landing Page (Express)',
      description: 'Website satu halaman yang responsif dan dioptimalkan khusus untuk promosi atau kampanye konversi tinggi.'
    },
    {
      name: 'Company Profile',
      description: 'Website korporat multi-halaman berdesain premium untuk membangun kredibilitas dan identitas digital perusahaan.'
    },
    {
      name: 'E-Commerce (Toko Online)',
      description: 'Platform toko online komprehensif dengan sistem keranjang belanja, kalkulasi ongkir otomatis, dan payment gateway.'
    },
    {
      name: 'Web App (Ultimate)',
      price: '12500000', // Adjusted from 9M to 12.5M
      description: 'Sistem aplikasi web custom terintegrasi. Mencakup Admin Panel, CRM, automasi email, dan fungsionalitas bisnis khusus.'
    }
  ];

  for (const pkg of updates) {
    const updateData = { description: pkg.description };
    if (pkg.price) updateData.price = pkg.price;

    const { error } = await supabase
      .from('pricing_packages')
      .update(updateData)
      .eq('name', pkg.name);

    if (error) {
      console.error('Error updating', pkg.name, error);
    } else {
      console.log('Successfully updated:', pkg.name);
    }
  }
}

updateWebDevPackages();
