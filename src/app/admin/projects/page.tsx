'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash, Image as ImageIcon, FileVideo, SpinnerGap, PencilSimple, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

type MediaItem = { type: 'image' | 'video'; url: string };

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url?: string;
  media?: MediaItem[];
  created_at: string;
};

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('graphic-design');
  const [videoUrl, setVideoUrl] = useState('');
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; mediaItems: MediaItem[] } | null>(null);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setTitle(project.title);
      setDescription(project.description || '');
      setCategory(project.category);
      setVideoUrl(project.video_url || '');
      setExistingMedia(project.media || []);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setCategory('graphic-design');
      setVideoUrl('');
      setExistingMedia([]);
    }
    setFiles(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (!editingId && (!files || files.length === 0)) {
      alert("Please select at least one file.");
      return;
    }

    setUploading(true);

    try {
      const newMediaItems: MediaItem[] = [];

      // 1. Upload new files to Storage
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
          const filePath = `${category}/${fileName}`;
          const isVideo = file.type.startsWith('video/');

          const { error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('portfolio')
            .getPublicUrl(filePath);

          newMediaItems.push({
            type: isVideo ? 'video' : 'image',
            url: publicUrl
          });
        }
      }

      const finalMedia = [...existingMedia, ...newMediaItems];

      const payload = {
        title,
        description,
        category,
        video_url: videoUrl,
        media: finalMedia
      };

      if (editingId) {
        // Update
        const { error: dbError } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        // Insert
        const { error: dbError } = await supabase
          .from('projects')
          .insert([payload]);
        if (dbError) throw dbError;
      }

      setShowModal(false);
      fetchProjects();
      toast.success('Project saved successfully!');
    } catch (error) {
      const err = error as Error;
      toast.error('Save failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      // Try to clean up storage
      for (const item of projectToDelete.mediaItems) {
        const pathParts = item.url.split('/portfolio/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from('portfolio').remove([filePath]);
        }
      }

      await supabase.from('projects').delete().eq('id', projectToDelete.id);
      fetchProjects();
      setProjectToDelete(null);
      toast.success('PROJEK GEUS DIHAPUS!');
    } catch (error) {
      const err = error as Error;
      toast.error('Gagal ngahapus: ' + err.message);
    }
  };

  const removeExistingMedia = (index: number) => {
    const newMedia = [...existingMedia];
    // We don't delete from storage immediately to prevent orphans if they cancel
    // We just remove it from the array that will be saved
    newMedia.splice(index, 1);
    setExistingMedia(newMedia);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-2">Portfolio Manager</h1>
          <p className="text-muted text-sm">Manage projects and media in the portfolio showcase.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
        >
          <Plus weight="bold" size={20} />
          Add Project
        </button>
      </header>

      {/* Data Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <SpinnerGap className="animate-spin text-accent" size={48} />
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-3xl p-12 text-center text-muted font-semibold uppercase tracking-widest bg-gray-50/50">
          No Projects Found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const cover = p.media && p.media.length > 0 ? p.media[0] : null;
            return (
              <div key={p.id} className="bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                <div className="relative aspect-video bg-gray-100 border-b border-gray-100 overflow-hidden">
                  {cover ? (
                    cover.type === 'video' ? (
                      <video src={cover.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted loop autoPlay playsInline />
                    ) : (
                      <img src={cover.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={p.title} />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">NO MEDIA</div>
                  )}
                  
                  <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-2 py-1 border border-border rounded-lg uppercase tracking-wider">
                    {p.category}
                  </div>
                  <div className="absolute top-2 left-2 bg-white text-black p-1 border border-border rounded-lg shadow-none flex items-center gap-1 font-bold text-xs px-2">
                    {p.media?.length || 0} files
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-2 line-clamp-1">{p.title}</h3>
                  
                  <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                    <button onClick={() => openModal(p)} className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase hover:bg-accent/10 hover:text-accent hover:border-accent transition-all flex items-center justify-center gap-1.5">
                      <PencilSimple weight="bold" size={16} /> Edit
                    </button>
                    <button onClick={() => setProjectToDelete({ id: p.id, mediaItems: p.media || [] })} className="py-2 px-3.5 bg-red-50 text-red-600 border border-transparent rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center">
                      <Trash size={20} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl w-full max-w-2xl my-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute -top-3 -right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-all">
              <X weight="bold" size={24} />
            </button>
            
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight text-gray-900">
                {editingId ? 'Edit Project' : 'New Project'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Video URL (YouTube/Vimeo) - Optional</label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all appearance-none"
                >
                  <option value="graphic-design">Graphic Design</option>
                  <option value="videography">Videography</option>
                  <option value="2d-3d-animation">2D & 3D Animation</option>
                  <option value="web-development">Web Development</option>
                  <option value="it-solutions">IT Solutions</option>
                </select>
              </div>

              {/* Existing Media Display */}
              {existingMedia.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Media</label>
                  <div className="grid grid-cols-3 gap-2">
                    {existingMedia.map((media, idx) => (
                      <div key={idx} className="relative aspect-video bg-black border border-border rounded-xl group">
                        {media.type === 'video' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileVideo size={32} className="text-accent" />
                          </div>
                        ) : (
                          <img src={media.url} className="w-full h-full object-cover opacity-60" />
                        )}
                        <button 
                          type="button"
                          onClick={() => removeExistingMedia(idx)}
                          className="absolute inset-0 bg-red-500/80 text-white font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Upload New Media (Images/Videos)</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                />
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Hold Ctrl/Cmd to select multiple files</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-gray-50 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-accent text-white border border-border rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all disabled:opacity-50 flex justify-center items-center gap-1.5"
                >
                  {uploading ? <SpinnerGap className="animate-spin" size={20} /> : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brutal Delete Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            
            
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PROJEK IEU?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Sakabeh media bakal leungit salawasna.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setProjectToDelete(null)}
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
