import { supabase } from '../supabase';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  project_details: string;
  status: 'unread' | 'read';
  created_at: string;
}

export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      { ...message, status: 'unread' }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ContactMessage[];
}

export async function markMessageAsRead(id: string) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status: 'read' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
