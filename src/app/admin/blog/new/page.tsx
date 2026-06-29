'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { SpinnerGap, ArrowLeft, Image as ImageIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewBlogPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Insight');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error('Judul, Slug, dan Konten harus diisi!');
      return;
    }
    setSaving(true);

    try {
      let coverUrl = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `blog_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `blogs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio') // using existing storage bucket for simplicity
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        coverUrl = publicUrl;
      }

      const { error: dbError } = await supabase
        .from('blogs')
        .insert([{
          title,
          slug,
          category,
          content,
          cover_image: coverUrl,
          is_published: isPublished
        }]);

      if (dbError) {
        if (dbError.code === '23505') {
          throw new Error('Slug sudah dipakai, ganti judul lain.');
        }
        throw dbError;
      }

      toast.success('Artikel berhasil dipublikasikan!');
      router.push('/admin/blog');
    } catch (error) {
      const err = error as Error;
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4 mb-10">
        <Link href="/admin/blog" className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors">
          <ArrowLeft weight="bold" size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-1">Tulis Artikel Baru</h1>
          <p className="text-muted text-sm">Gunakan format Markdown untuk kontennya.</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Judul Artikel</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Cara Bikin Desain Brutalist..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">URL Slug</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-mono"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold"
              >
                <option value="Insight">Insight</option>
                <option value="Tutorial">Tutorial</option>
                <option value="News">News</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Cover Image</label>
            <div className="flex items-center gap-4">
              {file && (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
              <span>Konten (Markdown)</span>
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-accent hover:underline lowercase">markdown cheat-sheet</a>
            </label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              placeholder="# Judul Utama&#10;&#10;Isi paragraf pertama disini...&#10;&#10;## Sub Judul&#10;- Poin 1&#10;- Poin 2"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200/80 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-mono leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <input 
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 accent-accent"
            />
            <label htmlFor="publish" className="font-bold text-sm text-gray-800 cursor-pointer">
              Langsung Publikasikan Artikel Ini
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="py-4 px-10 bg-accent text-white border border-border rounded-xl font-bold uppercase tracking-wider shadow-sm hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <SpinnerGap className="animate-spin" size={20} /> : 'SIMPAN ARTIKEL'}
          </button>
        </div>
      </form>
    </div>
  );
}
