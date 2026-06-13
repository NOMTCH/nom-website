import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { MasonryGallery } from '@/components/portfolio/MasonryGallery';
import { getAlbum } from '@/lib/data/portfolio';
import { notFound } from 'next/navigation';
import { JellyScroll } from '@/components/JellyScroll';

export default async function AlbumPage({ params }: { params: Promise<{ category: string, subcategory: string, album: string }> }) {
  const { category, subcategory, album: albumId } = await params;
  const album = await getAlbum(category, subcategory, albumId);
  
  if (!album) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-[80px]">
      <Navbar />
      <JellyScroll>
        <div className="container mx-auto px-6 md:px-12 pb-32">
          <Breadcrumbs />
          
          <header className="mb-16 mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-display font-black mb-4 text-foreground">{album.title}</h1>
              <p className="text-xl text-accent font-bold tracking-widest uppercase">
                {album.date}
              </p>
            </div>
            <div className="text-sm font-bold text-muted bg-surface px-6 py-3 rounded-full border border-border">
              {album.photos.length} Photos
            </div>
          </header>

          {album.photos.length > 0 ? (
            <MasonryGallery photos={album.photos} />
          ) : (
            <div className="w-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl">
              <svg className="w-16 h-16 text-muted mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p className="text-xl font-bold text-foreground mb-2">Album is empty</p>
              <p className="text-muted">No photos have been uploaded to this album yet.</p>
            </div>
          )}
        </div>

        <Footer />
      </JellyScroll>
    </main>
  );
}
