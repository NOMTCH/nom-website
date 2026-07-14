import { supabase } from '../supabase';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  project_name: string;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  down_payment?: number;
  total: number;
  status: 'unpaid' | 'paid' | 'cancelled';
  created_at?: string;
}

export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return data as Invoice[];
}

export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }

  return data as Invoice;
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }
  return data as Invoice;
}

export async function updateInvoiceStatus(id: string, status: 'unpaid' | 'paid' | 'cancelled') {
  const { data, error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function updateInvoice(id: string, invoice: Partial<Omit<Invoice, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Update Error:", JSON.stringify(error, null, 2), error);
    throw error;
  }
  return data as Invoice;
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
