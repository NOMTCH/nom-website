import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUltimate() {
  const { data: existing, error: fetchError } = await supabase
    .from('pricing_packages')
    .select('id, features')
    .eq('name', 'Web App (Ultimate)')
    .single();

  if (fetchError || !existing) {
    console.error('Error fetching:', fetchError);
    return;
  }

  // Find and replace the last feature or just add it
  const features = existing.features;
  // Replace the last feature 'Gratis Domain & Hosting (1 Tahun)' with VPS
  const newFeatures = features.map(f => 
    f === 'Gratis Domain & Hosting (1 Tahun)' ? 'Gratis Domain & VPS Server (1 Tahun)' : f
  );

  const { error: updateError } = await supabase
    .from('pricing_packages')
    .update({ features: newFeatures })
    .eq('id', existing.id);

  if (updateError) {
    console.error('Error updating:', updateError);
  } else {
    console.log('Success updated Ultimate Package with VPS feature');
  }
}

updateUltimate();
