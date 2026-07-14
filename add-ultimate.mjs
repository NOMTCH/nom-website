import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addUltimate() {
  const pkg = {
    name: 'Web App (Ultimate)',
    price: '9000000',
    description: 'Website custom super lengkap. Ada Admin Dashboard, Manajemen Leads, Email Notif, sistem Booking, dll. Kayak TG Holiday Tour.',
    category: 'Web Design & Dev',
    features: [
      'Desain UI/UX Custom & Mewah',
      'Admin Dashboard Komplit',
      'Manajemen Leads & Klien',
      'Integrasi Email Otomatis',
      'Sistem Booking / Custom Logic',
      'Gratis Domain & Hosting (1 Tahun)'
    ],
    is_popular: true,
    sort_order: 4
  };

  const { data, error } = await supabase.from('pricing_packages').insert([pkg]);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success added Ultimate Package');
  }
}

addUltimate();
