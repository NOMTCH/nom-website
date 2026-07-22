import { supabase } from '../supabase';

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[]; // Stored as jsonb array in DB
  category: string;
  is_popular: boolean;
  sort_order?: number;
  created_at?: string;
}

export async function getPricingPackages(): Promise<PricingPackage[]> {
  try {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*');

    if (error) {
      console.error('Error fetching pricing packages from Supabase:', error);
      return [];
    }

    return (data || []) as PricingPackage[];
  } catch (err) {
    console.error('Error fetching pricing packages:', err);
    return [];
  }
}

export async function addPricingPackage(pkg: Omit<PricingPackage, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('pricing_packages')
    .insert([pkg])
    .select()
    .single();

  if (error) throw error;
  return data as PricingPackage;
}

export async function updatePricingPackage(id: string, updates: Partial<PricingPackage>) {
  const { data, error } = await supabase
    .from('pricing_packages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PricingPackage;
}

export async function deletePricingPackage(id: string) {
  const { error } = await supabase
    .from('pricing_packages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
