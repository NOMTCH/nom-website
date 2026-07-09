import { supabase } from '../supabase';

export interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Proposal {
  id: string;
  proposal_number: string;
  client_name: string;
  client_email?: string;
  client_company?: string;
  project_name: string;
  project_description?: string;
  issue_date: string;
  valid_until: string;
  items: ProposalItem[];
  subtotal: number;
  tax_rate: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
  created_at?: string;
}

export async function getProposals() {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }

  return data as Proposal[];
}

export async function getProposalById(id: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }

  return data as Proposal;
}

export async function createProposal(proposal: Omit<Proposal, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('proposals')
    .insert([proposal])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", JSON.stringify(error, null, 2), error.message, error.details, error.hint);
    throw error;
  }
  return data as Proposal;
}

export async function updateProposalStatus(id: string, status: Proposal['status']) {
  const { data, error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Proposal;
}

export async function updateProposal(id: string, proposal: Partial<Omit<Proposal, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('proposals')
    .update(proposal)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Update Error:", error);
    throw error;
  }
  return data as Proposal;
}

export async function deleteProposal(id: string) {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
