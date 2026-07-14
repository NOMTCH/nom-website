import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDescription() {
  const { data: existing, error: fetchError } = await supabase
    .from('pricing_packages')
    .select('id, description')
    .eq('name', 'Web App (Ultimate)')
    .single();

  if (fetchError || !existing) {
    console.error('Error fetching:', fetchError);
    return;
  }

  // Remove the TG Holiday Tour mention
  const newDescription = 'Website custom super lengkap. Ada Admin Dashboard, Manajemen Leads, Email Notif, sistem Booking, dan fitur custom sesuai kebutuhan bisnis.';

  const { error: updateError } = await supabase
    .from('pricing_packages')
    .update({ description: newDescription })
    .eq('id', existing.id);

  if (updateError) {
    console.error('Error updating:', updateError);
  } else {
    console.log('Success removed TG Holiday Tour mention');
  }
}

fixDescription();
