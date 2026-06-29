'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash, SpinnerGap, PencilSimple, Globe, LockKey } from '@phosphor-icons/react';
import { toast } from 'sonner';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_image: string | null;
  is_published: boolean;
  created_at: string;
};

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; cover_image: string | null } | null>(null);

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, category, cover_image, is_published, created_at')
      .order('created_at', { ascending: false });
    
    if (data) setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      // Clean up storage if there is a cover image
      if (blogToDelete.cover_image) {
        const pathParts = blogToDelete.cover_image.split('/portfolio/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from('portfolio').remove([filePath]);
        }
      }

      await supabase.from('blogs').delete().eq('id', blogToDelete.id);
      fetchBlogs();
      setBlogToDelete(null);
      toast.success('Artikel berhasil dihapus!');
    } catch (error) {
      const err = error as Error;
      toast.error('Gagal menghapus: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-2">Blog & Insight</h1>
          <p className="text-muted text-sm">Tulis artikel, berita, atau tutorial buat ningkatin SEO Web lu.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
        >
          <Plus weight="bold" size={20} />
          Tulis Artikel
        </Link>
      </header>

      {/* Data Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <SpinnerGap className="animate-spin text-accent" size={48} />
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-3xl p-12 text-center text-muted font-semibold uppercase tracking-widest bg-gray-50/50">
          Belum ada Artikel. Tulis yang pertama!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div key={b.id} className="bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
              <div className="relative aspect-video bg-gray-100 border-b border-gray-100 overflow-hidden">
                {b.cover_image ? (
                  <img src={b.cover_image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={b.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-200 uppercase text-xs tracking-widest">
                    Tanpa Cover
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-2 py-1 border border-border rounded-lg uppercase tracking-wider shadow-sm">
                  {b.category}
                </div>
                
                <div className={`absolute top-2 left-2 p-1 border border-border rounded-lg shadow-sm flex items-center gap-1 font-bold text-[10px] px-2 tracking-wider uppercase text-white ${b.is_published ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {b.is_published ? (
                    <><Globe weight="bold" size={14} /> PUBLIK</>
                  ) : (
                    <><LockKey weight="bold" size={14} /> DRAFT</>
                  )}
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-1 line-clamp-2 leading-tight">{b.title}</h3>
                <p className="text-xs text-gray-400 font-mono mb-4">/{b.slug}</p>
                
                <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                  <Link href={`/admin/blog/${b.id}/edit`} className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase hover:bg-accent/10 hover:text-accent hover:border-accent transition-all flex items-center justify-center gap-1.5">
                    <PencilSimple weight="bold" size={16} /> Edit
                  </Link>
                  <button onClick={() => setBlogToDelete({ id: b.id, cover_image: b.cover_image })} className="py-2 px-3.5 bg-red-50 text-red-600 border border-transparent rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center">
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brutal Delete Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS ARTIKEL?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Artikel ini bakal musnah dari internet selamanya. Lanjut?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setBlogToDelete(null)}
                  className="flex-1 py-3.5 bg-gray-50 border border-gray-200/80 rounded-xl font-bold uppercase text-xs tracking-wider text-gray-700 hover:bg-gray-100 hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  TEU JADI
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-red-700 hover:-translate-y-0.5 transition-all"
                >
                  HAPUS LAH!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
