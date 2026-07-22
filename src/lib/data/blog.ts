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

const defaultEnglishArticles: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why We Rebuilt Our Tech Stack with Next.js 16 and Supabase',
    slug: 'why-we-rebuilt-our-tech-stack-with-nextjs-16',
    category: 'Engineering',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: new Date('2026-07-20').toISOString(),
    updated_at: new Date('2026-07-20').toISOString(),
    content: `
# Why We Rebuilt Our Tech Stack with Next.js 16 and Supabase

Moving away from bloated legacy setups to Next.js 16 App Router and Supabase instant database synchronization increased our Core Web Vitals score to 100% and reduced API latency to under 45ms.

## The Problem With Legacy Frameworks

Traditional CMS monoliths and heavy server setups slow down growth. They create unnecessary database bottlenecks and require constant maintenance overhead.

- **Slow Initial Page Loads**: Heavy server-side rendering without streaming.
- **Database Latency**: Complex ORM layers adding hundreds of milliseconds to simple queries.
- **Maintenance Fatigue**: Managing dedicated server instances instead of serverless edge architecture.

## The Solution: Next.js 16 + Supabase Edge Architecture

By combining Next.js 16 React Server Components with Supabase Realtime Row Level Security, we achieved:

1. **Instant Edge Rendering**: Static assets cached globally on CDN nodes.
2. **Real-time Database Subscriptions**: Webhooks and instant websockets without manual polling.
3. **Sub-50ms Global Response Times**: Direct edge database queries closer to the client.

> "Speed is not just a feature; it is the fundamental multiplier of conversion rates."

## Conclusion

Building modern web applications requires tight integration between visual aesthetics and raw engineering speed. With Next.js 16 and Supabase, your brand loads instantly on any device worldwide.
    `
  },
  {
    id: 'blog-2',
    title: 'The 3-Second Rule: How Speed and Micro-Animations Double Conversions',
    slug: 'how-performance-and-micro-animations-double-conversion',
    category: 'UI/UX Design',
    cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: new Date('2026-07-18').toISOString(),
    updated_at: new Date('2026-07-18').toISOString(),
    content: `
# The 3-Second Rule: How Speed and Micro-Animations Double Conversions

A beautiful interface is useless if visitors leave before the page finishes loading. Here is how modern visual hierarchy and micro-interactions turn passive browsers into high-intent buyers.

## First Impressions Are Formed in 100 Milliseconds

Your visitors make a decision about your brand before they even read a single headline.

- **Subtle Motion**: Micro-interactions guide user attention naturally without clutter.
- **Dark Mode Aesthetics**: Modern dark palettes reduce eye fatigue and create a high-contrast premium feel.
- **Instant Interactive Feedback**: Buttons and inputs should respond immediately to touch and hover events.

## Key Principles of High-Converting UI Design

1. **Clear Typographic Hierarchy**: Use strong display headlines coupled with readable body copy.
2. **Purposeful Whitespace**: Give elements breathing room to highlight core conversion buttons.
3. **Eliminate Friction**: Reduce form fields to the absolute minimum needed to close a deal.

Ready to transform your brand digital presence? Explore our portfolio to see real client results.
    `
  },
  {
    id: 'blog-3',
    title: 'Stop Wasting Money on Retainers: The Modern Engineering Playbook',
    slug: 'modern-execution-playbook-vs-agency-retainers',
    category: 'Strategy',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: new Date('2026-07-15').toISOString(),
    updated_at: new Date('2026-07-15').toISOString(),
    content: `
# Stop Wasting Money on Retainers: The Modern Engineering Playbook

Traditional agencies love billing hundreds of hours for endless strategy decks and bloated meetings. Here is how agile software studios deliver production-ready systems in record time.

## The Flaw in Traditional Retainers

- **Endless Slide Decks**: Days spent creating presentations instead of shipping functional code.
- **Bloated Overhead**: Paying for account managers and middle management instead of senior engineers.
- **Slow Iteration Cycles**: Weeks of approval loops before a single feature goes live.

## The NOMSTD Execution Standard

We operate on a streamlined execution model focused purely on delivery:

1. **Direct Engineer Access**: Communicate directly with the developers and designers building your project.
2. **Weekly Production Builds**: See live, working software updates every single week.
3. **Fixed Transparent Pricing**: Clear scope, zero hidden hourly markups, 100% database synchronized pricing.

Build your next digital product with speed and confidence.
    `
  },
  {
    id: 'blog-4',
    title: 'Building AI Automation Workflows That Save 40 Hours a Week',
    slug: 'building-ai-automation-pipelines-that-actually-work',
    category: 'AI & Automation',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: new Date('2026-07-10').toISOString(),
    updated_at: new Date('2026-07-10').toISOString(),
    content: `
# Building AI Automation Workflows That Save 40 Hours a Week

Artificial intelligence is not a gimmick when integrated into real business workflows. Learn how automated invoice processing and instant client lead routing eliminate manual bottlenecks.

## Practical AI vs Hype

Instead of generic chatbots, real business value comes from targeted automation pipelines:

- **Automated Document Parsing**: Extracts invoice line items directly into your database.
- **Smart Lead Routing**: Categorizes inbound customer inquiries and dispatches instant WhatsApp notifications.
- **Automated Content Structuring**: Formats complex data into clean markdown and JSON schemas automatically.

## How to Get Started

Identify repetitive tasks in your daily operations and connect them directly to API endpoints. Our IT engineering team builds custom webhooks and automation pipelines tailored to your business needs.
    `
  }
];

export async function getBlogPosts(onlyPublished = true): Promise<BlogPost[]> {
  try {
    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (onlyPublished) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blogs from Supabase:', error);
    }

    if (data && data.length > 0) {
      return data as BlogPost[];
    }

    // Fallback to high-impact English articles if DB is clean
    return defaultEnglishArticles;
  } catch (err) {
    console.error('Exception fetching blogs:', err);
    return defaultEnglishArticles;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (!error && data) {
      return data as BlogPost;
    }

    // Fallback to default articles by slug
    const found = defaultEnglishArticles.find(p => p.slug === slug);
    return found || null;
  } catch (err) {
    console.error('Exception fetching blog post by slug:', err);
    const found = defaultEnglishArticles.find(p => p.slug === slug);
    return found || null;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (!error && data) {
      return data as BlogPost;
    }

    const found = defaultEnglishArticles.find(p => p.id === id);
    return found || null;
  } catch (err) {
    console.error('Exception fetching blog post by id:', err);
    const found = defaultEnglishArticles.find(p => p.id === id);
    return found || null;
  }
}
