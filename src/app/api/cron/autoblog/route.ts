import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

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

    // 2. Ambil Berita (Scraping RSS)
    const parser = new Parser();
    const feedUrl = 'https://techcrunch.com/feed/'; // Contoh ngambil dari TechCrunch
    const feed = await parser.parseURL(feedUrl);
    
    if (!feed.items || feed.items.length === 0) {
      return NextResponse.json({ error: 'No RSS items found' }, { status: 404 });
    }

    // Pilih artikel terbaru (paling atas)
    const latestNews = feed.items[0];
    const newsTitle = latestNews.title;
    const newsContent = latestNews.contentSnippet || latestNews.content || latestNews.summary;

    if (!newsTitle || !newsContent) {
      return NextResponse.json({ error: 'Article missing title or content' }, { status: 400 });
    }

    // 3. Rewrite Pakai AI (OpenRouter)
    const prompt = `
Anda adalah seorang copywriter dari "NOMSTD Creative Studio", sebuah creative agency & IT solutions di Indonesia.
Tugas Anda adalah menulis ulang berita teknologi bahasa Inggris di bawah ini menjadi sebuah artikel blog SEO yang panjang dalam bahasa Indonesia yang asik, profesional, dan sedikit gaul.

Berita Asli:
Judul: ${newsTitle}
Konten: ${newsContent}

Aturan Penulisan:
1. Tulis judul (Title) yang sangat *clickbait* tapi profesional, tanpa tanda kutip. (Simpan di baris pertama).
2. Mulai baris ketiga, tulis artikel lengkap dengan format Markdown.
3. Pisahkan ke dalam beberapa paragraf dan subjudul (H2).
4. Di bagian akhir, sisipkan kalimat promosi halus tentang layanan NOMSTD (contoh: pembuatan website, UI/UX, desain) dan ajak pembaca menghubungi NOMSTD jika mereka butuh solusi IT.
5. Gunakan sapaan santai yang cocok untuk UMKM atau Startup.
`;

    const modelsToTry = [
      "tencent/hy3:free", 
      "poolside/laguna-m.1:free"
    ];

    let text = "";
    let usedModel = "";
    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            max_tokens: 2000,
            messages: [
              { role: "user", content: prompt }
            ]
          })
        });

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

    const lines = text.split('\n');
    let title = lines[0].replace(/#+\s*/, '').trim(); // Bersihkan hashtag jika ada
    if (title.toLowerCase().startsWith('judul:')) {
      title = title.substring(6).trim();
    }
    const content = lines.slice(1).join('\n').trim();

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
