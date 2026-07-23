import { MetadataRoute } from 'next';
import { portfolioData } from '@/lib/data/portfolio';
import { invitationThemes } from '@/data/invitationThemes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nomstd.my.id';
  const now = new Date();

  // 1. Core High-Priority Pages
  const mainRoutes = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  // 2. High-Value Web Tools Pages (Priority 0.9 for Google Indexing)
  const toolRoutes = [
    '/tools/cv-generator',
    '/tools/link-builder',
    '/tools/image-compressor',
    '/tools/photo-grid',
    '/tools/qr-generator',
    '/tools/text-tool',
  ].map((toolPath) => ({
    url: `${baseUrl}${toolPath}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // 3. Service Detail Routes
  const serviceSlugs = ['graphic-design', 'photography', 'videography', 'web-development', 'it-solutions', 'digital-invitation'];
  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Digital Invitation Preview Routes
  const themeRoutes = invitationThemes.map((theme) => ({
    url: `${baseUrl}/services/digital-invitation/preview/${theme.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 5. Portfolio Dynamic Routes
  const portfolioRoutes: MetadataRoute.Sitemap = [];
  portfolioData.forEach((category) => {
    portfolioRoutes.push({
      url: `${baseUrl}/portfolio/${category.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });

    category.subcategories.forEach((subcategory) => {
      portfolioRoutes.push({
        url: `${baseUrl}/portfolio/${category.id}/${subcategory.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });

      subcategory.albums.forEach((album) => {
        portfolioRoutes.push({
          url: `${baseUrl}/portfolio/${category.id}/${subcategory.id}/${album.id}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        });
      });
    });
  });

  // 6. Dynamic Blog Posts (Wrapped in safe try-catch so Supabase error NEVER breaks XML response)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { getBlogPosts } = await import('@/lib/data/blog');
    const blogs = await getBlogPosts(true);
    if (Array.isArray(blogs) && blogs.length > 0) {
      blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : (blog.created_at ? new Date(blog.created_at) : now),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (e) {
    console.warn('Sitemap Blog Fetch Fallback:', e);
  }

  // Combine all routes into clean XML array
  return [
    ...mainRoutes,
    ...toolRoutes,
    ...blogRoutes,
    ...serviceRoutes,
    ...themeRoutes,
    ...portfolioRoutes,
  ];
}
