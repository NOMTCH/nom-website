import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUltimatePro() {
  const newFeatures = [
    'Custom Frontend UI/UX Premium & Animasi Modern',
    'Full-Stack Next.js 14 Engine & Tech SEO Ready',
    'Custom CMS (Modul Custom, Blog & Dashboard)',
    'PostgreSQL Database & Cloud Architecture',
    'Advanced Security (DDoS Protection & SSL)',
    'Gratis Setup Cloud Deployment'
  ];

  const updateData = {
    price: '15000000',
    description: 'Sistem website skala enterprise. Dilengkapi Full-Stack Next.js 14, Custom CMS, dan Arsitektur Cloud yang tangguh.',
    features: newFeatures
  };

  const { error } = await supabase
    .from('pricing_packages')
    .update(updateData)
    .eq('name', 'Web App (Ultimate)');

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Success updated Ultimate Package to match the proposal style.');
  }
}

updateUltimatePro();
