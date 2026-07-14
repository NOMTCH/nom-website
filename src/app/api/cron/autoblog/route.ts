import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

// Setup Vercel timeout max duration (supaya nggak 504 pas nunggu AI mikir)
export const maxDuration = 60; 

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Usually we'd use service_role, but anon works if RLS allows inserts or is disabled for this test.
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // 1. Keamanan Cron Job (Hanya Vercel atau admin yang punya CRON_SECRET yang bisa panggil ini)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Check if CRON_SECRET is configured and matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Also allow passing via query param for easier manual testing
      const { searchParams } = new URL(request.url);
      if (searchParams.get('key') !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is missing' }, { status: 500 });
    }

    // 2. Ambil Berita (Scraping RSS dari Banyak Sumber)
    const rssSources = [
      { url: 'https://techcrunch.com/feed/', category: 'Teknologi & Startup' },
      { url: 'https://cointelegraph.com/rss', category: 'Cryptocurrency & Web3' },
      { url: 'https://www.republika.co.id/rss/dunia-islam', category: 'Inspirasi Islami' },
      { url: 'https://www.smashingmagazine.com/feed/', category: 'Tutorial Desain & Web Dev' },
      { url: 'https://www.entrepreneur.com/latest.rss', category: 'Inspirasi Usaha & Bisnis' },
      { url: 'https://petapixel.com/feed/', category: 'Fotografi & Sinematografi' }
    ];

    // Pilih 1 sumber secara acak setiap kali cron jalan
    const randomSource = rssSources[Math.floor(Math.random() * rssSources.length)];
    const feedUrl = randomSource.url;
    
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);
    
    if (!feed.items || feed.items.length === 0) {
      return NextResponse.json({ error: 'No RSS items found' }, { status: 404 });
    }

    // Filter & Sort: Ambil artikel yang benar-benar terbaru (Bukan artikel pinned yang jadul)
    // Urutkan berdasarkan tanggal dari yang paling baru (2026) ke lama
    const sortedItems = feed.items
      .filter(item => item.isoDate || item.pubDate) 
      .sort((a, b) => {
        const dateA = new Date(a.isoDate || a.pubDate || 0).getTime();
        const dateB = new Date(b.isoDate || b.pubDate || 0).getTime();
        return dateB - dateA; // Descending (Terbaru di atas)
      });
      
    if (sortedItems.length === 0) {
      return NextResponse.json({ error: 'No valid dated RSS items found' }, { status: 404 });
    }

    // Pilih artikel yang beneran paling baru (menghindari berita kolot)
    const latestNews = sortedItems[0];
    const newsTitle = latestNews.title;
    const newsContent = latestNews.contentSnippet || latestNews.content || latestNews.summary;

    if (!newsTitle || !newsContent) {
      return NextResponse.json({ error: 'Article missing title or content' }, { status: 400 });
    }

    // 3. Rewrite Pakai AI (OpenRouter)
    const prompt = `
Anda adalah seorang copywriter dari "NOMSTD Creative Studio", sebuah creative agency & IT solutions di Indonesia.
Tugas Anda adalah menulis ulang konten di bawah ini menjadi sebuah artikel blog SEO (sekitar 300-400 kata saja agar ringkas dan cepat dibaca) dalam bahasa Indonesia yang asik, profesional, dan sedikit gaul.
Sebagai informasi, hari ini adalah tahun 2026. Pastikan tulisan Anda terasa modern, fresh, dan relevan dengan tren masa kini.

Kategori Artikel: ${randomSource.category}

Berita/Konten Asli:
Judul: ${newsTitle}
Konten: ${newsContent}

Aturan Penulisan:
1. Tulis judul (Title) yang sangat *clickbait* tapi nyambung dengan isinya, tanpa tanda kutip. (Simpan di baris pertama).
2. Mulai baris ketiga, tulis artikel pendek dengan format Markdown.
3. Buat 3-4 paragraf saja yang padat dan menarik.
4. Sesuaikan gaya bahasa dengan kategori. (Misal: Islami = adem/sopan, Crypto = trader/cuan, Tech = geek/kreatif).
5. Di akhir, sisipkan kalimat promosi singkat (1 kalimat) tentang layanan NOMSTD (pembuatan website/UI UX) dan ajak pembaca menghubungi NOMSTD jika butuh solusi IT.
`;

    const modelsToTry = [
      "meta-llama/llama-3.1-8b-instruct:free", // Super cepat
      "google/gemma-2-9b-it:free" // Cadangan cepat
    ];

    let text = "";
    let usedModel = "";
    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 detik maksimal tiap AI

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json"
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: modelName,
            max_tokens: 1200, // Turunin max tokens biar AI ga kelamaan mikir
            messages: [
              { role: "user", content: prompt }
            ]
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Status ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        const output = data.choices[0]?.message?.content || "";
        
        if (output) {
          text = output;
          usedModel = modelName;
          break; // Sukses, keluar dari loop
        } else {
          throw new Error("Output kosong (null/empty string)");
        }
      } catch (e: any) {
        console.error(`Gagal pakai model ${modelName}:`, e.message);
        lastError = e.message;
        // Lanjut ke model berikutnya di loop
      }
    }

    if (!text) {
      return NextResponse.json({ 
        error: 'Semua AI gagal memproses artikel (fallback failed)', 
        details: lastError 
      }, { status: 500 });
    }

    // Bersihkan teks dari Markdown block (```markdown ... ```)
    let cleanText = text.trim();
    if (cleanText.toLowerCase().startsWith('```markdown')) {
      cleanText = cleanText.substring(11).trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3).trim();
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3).trim();
    }

    // Ambil baris-baris yang ada isinya (bukan baris kosong)
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    // Judul pasti ada di baris pertama
    let title = lines[0].replace(/#+\s*/g, '').replace(/\*\*/g, '').trim(); 
    if (title.toLowerCase().startsWith('judul:')) {
      title = title.substring(6).trim();
    }
    
    // Gabungin sisa baris jadi konten artikel
    const content = lines.slice(1).join('\n\n').trim();

    // Generate Slug dari judul
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    // 4. Masukkan ke Database (Supabase)
    const { error: dbError } = await supabase.from('blogs').insert({
      title: title,
      slug: slug,
      category: 'Tech News',
      content: content,
      is_published: true
    });

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: 'Failed to insert to database', details: dbError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Autoblog generated successfully', 
      article: { title, slug } 
    });

  } catch (error: any) {
    console.error("Autoblog Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
