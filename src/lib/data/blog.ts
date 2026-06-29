import { supabase } from '../supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getBlogPosts(onlyPublished = true): Promise<BlogPost[]> {
  let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
  if (onlyPublished) {
    query = query.eq('is_published', true);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
  return data as BlogPost;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching blog post by id:', error);
    return null;
  }
  return data as BlogPost;
}
