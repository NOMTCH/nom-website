import { supabase } from '../supabase';
import { InvitationData } from '@/components/invitation/InvitationEngine';

export interface Invitation {
  id: string;
  slug: string;
  theme_id: string;
  customer_id?: string | null;
  status: 'draft' | 'published' | 'expired';
  data: InvitationData;
  created_at?: string;
  published_at?: string | null;
  expires_at?: string | null;
}

export interface RSVPResponse {
  id: string;
  invitation_id: string;
  name: string;
  attendance: 'hadir' | 'tidak';
  wish: string | null;
  created_at: string;
}

export async function getInvitations() {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }

  return data as Invitation[];
}

export async function getInvitationById(id: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching invitation by ID:', error);
    return null;
  }

  return data as Invitation;
}

export async function getInvitationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching invitation by slug:', error);
    return null;
  }

  return data as Invitation;
}

export async function createInvitation(invitation: Omit<Invitation, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('invitations')
    .insert([invitation])
    .select()
    .single();

  if (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
  return data as Invitation;
}

export async function updateInvitation(id: string, invitation: Partial<Omit<Invitation, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('invitations')
    .update(invitation)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invitation:', error);
    throw error;
  }
  return data as Invitation;
}

export async function deleteInvitation(id: string) {
  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invitation:', error);
    throw error;
  }
}

export async function getRSVPsByInvitationId(invitationId: string) {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }

  return data as RSVPResponse[];
}

export async function deleteRSVP(id: string) {
  const { error } = await supabase
    .from('rsvp_responses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting RSVP:', error);
    throw error;
  }
}
