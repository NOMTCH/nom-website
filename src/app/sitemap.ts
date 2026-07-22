import { MetadataRoute } from 'next';
import { portfolioData } from '@/lib/data/portfolio';
import { invitationThemes } from '@/data/invitationThemes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nomstd.my.id';

  // Base routes
  const routes = [
    '',
    '/about',
    '/portfolio',
    '/services',
    '/services/digital-invitation',
    '/tools/cv-generator',
    '/tools/link-builder',
    '/tools/image-compressor',
    '/tools/photo-grid',
    '/tools/qr-generator',
    '/tools/text-tool',
    '/privacy-policy',
    '/terms-of-service',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : (route.includes('privacy') || route.includes('terms') || route.includes('disclaimer') ? 0.3 : 0.8),
  }));

  // Service dynamic routes (hardcoded based on our serviceData slugs)
  const services = ['graphic-design', 'photography', 'videography', 'web-development', 'it-solutions'];
  const serviceRoutes = services.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Digital invitation preview routes
  const themeRoutes = invitationThemes.map((theme) => ({
    url: `${baseUrl}/services/digital-invitation/preview/${theme.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Portfolio dynamic routes (categories, subcategories, albums)
  const portfolioRoutes: MetadataRoute.Sitemap = [];
  
  portfolioData.forEach((category) => {
    // 1. Category route
    portfolioRoutes.push({
      url: `${baseUrl}/portfolio/${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });

    category.subcategories.forEach((subcategory) => {
      // 2. Subcategory route
      portfolioRoutes.push({
        url: `${baseUrl}/portfolio/${category.id}/${subcategory.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });

      subcategory.albums.forEach((album) => {
        // 3. Album route
        portfolioRoutes.push({
          url: `${baseUrl}/portfolio/${category.id}/${subcategory.id}/${album.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        });
      });
    });
  });

  // Fetch Blogs for dynamic routing
  const { getBlogPosts } = await import('@/lib/data/blog');
  const blogs = await getBlogPosts(true);
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add the main /blog route
  const blogIndexRoute = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  return [...routes, blogIndexRoute, ...blogRoutes, ...serviceRoutes, ...themeRoutes, ...portfolioRoutes];
}
