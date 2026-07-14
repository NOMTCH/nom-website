import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const dummyPosts = [
  {
    title: "Mengapa Bisnis Anda Membutuhkan Website Custom di Tahun 2026",
    slug: "mengapa-bisnis-butuh-website-custom-2026",
    category: "Web Development",
    content: `
Dunia digital bergerak dengan sangat cepat. Pada tahun 2026, memiliki sekadar "website" tidak lagi cukup. Anda membutuhkan sistem digital yang cerdas, responsif, dan terintegrasi penuh dengan proses bisnis Anda. Inilah mengapa website custom menjadi investasi terbaik yang bisa Anda lakukan.

## 1. Kecepatan dan Performa (Core Web Vitals)
Website template sering kali dipenuhi dengan kode yang tidak perlu (bloatware) yang memperlambat waktu pemuatan. Website custom dibangun dari nol menggunakan arsitektur modern seperti Next.js, memastikan performa server-side rendering (SSR) yang instan. Kecepatan ini bukan hanya soal kenyamanan pengunjung, tetapi juga faktor utama dalam penentuan peringkat SEO oleh Google.

## 2. Skalabilitas Tanpa Batas
Bisnis yang berkembang membutuhkan infrastruktur yang bisa ikut berkembang. Website custom yang dibangun di atas database tangguh seperti PostgreSQL memungkinkan Anda menampung ribuan transaksi atau data prospek (leads) tanpa hambatan. Anda bisa menambahkan fitur baru kapan saja.

## 3. Desain UI/UX Eksklusif
Kesan pertama adalah segalanya. Website custom memberikan Anda kebebasan penuh atas antarmuka pengguna (User Interface). Dari micro-interactions hingga animasi yang mulus, setiap elemen dirancang khusus untuk memandu pengunjung melakukan tindakan (konversi).

## 4. Keamanan Tingkat Tinggi
Dengan meningkatnya serangan siber, website custom menawarkan keamanan yang jauh lebih baik dibandingkan CMS open-source yang sering menjadi target eksploitasi massal. Infrastruktur custom sering kali dilindungi oleh CDN kelas enterprise dan protokol enkripsi standar industri.

Jangan biarkan bisnis Anda tertinggal. Beralihlah ke ekosistem digital yang benar-benar mewakili visi masa depan perusahaan Anda.
    `.trim(),
    status: 'published'
  },
  {
    title: "Panduan Lengkap Memilih Hosting dan Domain untuk UMKM",
    slug: "panduan-memilih-hosting-domain-umkm",
    category: "Tutorial",
    content: `
Bagi banyak pemilik UMKM, memilih hosting dan domain bisa menjadi proses yang membingungkan. Padahal, ini adalah fondasi dari seluruh kehadiran digital Anda. Artikel ini akan membahas langkah demi langkah bagaimana memilih rumah digital yang tepat untuk bisnis Anda.

## Memilih Nama Domain yang Tepat
Domain adalah alamat rumah Anda di internet. Pastikan nama domain Anda:
- Singkat dan mudah diingat.
- Tidak mengandung karakter rumit atau angka yang membingungkan.
- Mencerminkan identitas merek Anda.
- Menggunakan ekstensi yang relevan (seperti .com, .id, atau .co.id untuk perusahaan).

## Jenis-Jenis Hosting
Ada beberapa tingkatan hosting yang perlu Anda ketahui:
1. **Shared Hosting:** Cocok untuk website baru dengan trafik rendah. Anda berbagi sumber daya server dengan website lain. Murah, namun performanya terbatas.
2. **VPS (Virtual Private Server):** Server virtual eksklusif. Sangat disarankan untuk toko online atau aplikasi web karena performanya stabil dan cepat.
3. **Cloud Hosting:** Infrastruktur terdesentralisasi yang menjamin uptime hampir 100%. Cocok untuk website berskala besar.

## Pertimbangkan Faktor Keamanan (SSL)
Pastikan penyedia hosting Anda menawarkan sertifikat SSL gratis (Gembok Hijau). Tanpa SSL, Google Chrome akan menandai website Anda sebagai "Tidak Aman", yang akan langsung membuat pengunjung pergi.

## Layanan Pelanggan (Support)
Pilih penyedia dengan dukungan teknis 24/7. Ketika website Anda mengalami kendala di tengah malam, Anda membutuhkan tim teknis yang siap membantu memulihkan sistem Anda.
    `.trim(),
    status: 'published'
  },
  {
    title: "Tren Desain UI/UX Paling Populer di Era Web Modern",
    slug: "tren-desain-ui-ux-web-modern",
    category: "Design",
    content: `
Antarmuka pengguna (UI) dan pengalaman pengguna (UX) terus berevolusi. Untuk menjaga website Anda tetap relevan dan menarik bagi pengunjung, penting untuk memahami tren desain terkini. Berikut adalah beberapa tren UI/UX yang mendominasi era web modern.

## 1. Glassmorphism dan Kedalaman Visual
Tren efek kaca buram (frosted glass) memberikan dimensi dan kedalaman pada antarmuka. Dengan memadukan latar belakang transparan, blur, dan batas halus, elemen UI terlihat mengambang dan futuristik, namun tetap mempertahankan keterbacaan teks.

## 2. Tipografi Besar dan Tebal (Bold Typography)
Teks bukan lagi sekadar alat penyampai informasi; ia kini menjadi elemen grafis utama. Penggunaan font tebal berukuran masif (oversized typography) langsung menangkap perhatian pengunjung dan mengkomunikasikan pesan utama dalam hitungan detik.

## 3. Micro-Interactions
Detail kecil membawa dampak besar. Animasi kecil saat kursor diarahkan ke tombol, atau transisi halus saat memuat halaman, memberikan umpan balik visual yang memuaskan bagi pengguna. Ini membuat website terasa hidup dan interaktif.

## 4. Dark Mode First
Mode gelap bukan lagi sekadar opsi tambahan, melainkan preferensi utama banyak pengguna. Desainer kini merancang website dengan pendekatan *dark mode first*, menggunakan palet warna kontras tinggi yang nyaman di mata sekaligus menonjolkan estetika premium.
    `.trim(),
    status: 'published'
  },
  {
    title: "Cara Meningkatkan Konversi Landing Page Anda Hingga 200%",
    slug: "cara-meningkatkan-konversi-landing-page",
    category: "Marketing",
    content: `
Landing page adalah ujung tombak dari setiap kampanye pemasaran digital. Jika pengunjung datang tetapi tidak melakukan pembelian atau mengisi formulir, berarti ada yang salah dengan halaman Anda. Berikut adalah rahasia untuk meroketkan tingkat konversi landing page Anda.

## Headline yang Menggigit
Pengunjung hanya memberikan waktu 3 detik pertama untuk memutuskan apakah mereka akan bertahan atau pergi. Headline Anda harus langsung menjawab masalah mereka. Hindari bahasa teknis yang membosankan; gunakan bahasa yang emosional dan berorientasi pada hasil (benefit-oriented).

## Call-to-Action (CTA) yang Jelas
Hanya boleh ada SATU tujuan utama di landing page Anda. Jangan membingungkan pengunjung dengan banyak tombol dan penawaran. Buat tombol CTA dengan warna yang kontras, teks yang persuasif (misal: "Kirim Proposal Saya Sekarang" bukan sekadar "Submit"), dan tempatkan secara strategis di sepanjang halaman.

## Social Proof dan Testimoni
Orang cenderung mengikuti apa yang dilakukan orang lain. Tampilkan testimoni klien asli, logo perusahaan yang pernah bekerja sama dengan Anda, atau studi kasus singkat. Bukti sosial ini secara drastis meningkatkan kepercayaan (trust) pengunjung.

## Kecepatan Memuat Halaman (Page Speed)
Setiap detik penundaan dalam memuat halaman akan menurunkan konversi sebesar 7%. Pastikan gambar dioptimalkan (gunakan format WEBP), kode diminifikasi, dan hosting yang Anda gunakan cukup mumpuni. Landing page harus terbuka seketika secepat kilat.
    `.trim(),
    status: 'published'
  },
  {
    title: "Pentingnya Kebijakan Privasi (Privacy Policy) untuk Kepercayaan Pengguna",
    slug: "pentingnya-kebijakan-privasi-trust",
    category: "Legal & SEO",
    content: `
Di era digital di mana pencurian data semakin marak, pengguna internet menjadi sangat berhati-hati dalam membagikan informasi pribadi mereka. Di sinilah halaman Kebijakan Privasi (Privacy Policy) memainkan peran krusial dalam membangun kepercayaan.

## Bukan Sekadar Dokumen Formalitas
Banyak pemilik website menganggap Privacy Policy hanyalah dokumen legalitas yang membosankan. Padahal, ini adalah janji tertulis Anda kepada pengunjung bahwa data mereka aman bersama Anda. Halaman ini menjelaskan data apa saja yang Anda kumpulkan (seperti nama, email, cookies), bagaimana data itu digunakan, dan siapa saja yang memiliki akses ke sana.

## Syarat Wajib Jaringan Iklan (Google AdSense)
Bagi Anda yang berencana memonetisasi website melalui Google AdSense atau platform periklanan lainnya, memiliki halaman Privacy Policy, Terms of Service, dan Disclaimer adalah syarat mutlak. Bot crawler mesin pencari secara otomatis mencari halaman-halaman ini sebagai sinyal kredibilitas dan keabsahan sebuah website.

## Meningkatkan Otoritas SEO
Google sangat menghargai website yang memperhatikan aspek perlindungan konsumen. Halaman legalitas yang lengkap memberikan sinyal positif kepada algoritma Google bahwa website Anda dikelola oleh entitas bisnis yang sah dan profesional. Hal ini secara tidak langsung membantu meningkatkan skor otoritas domain Anda di mesin pencari.
    `.trim(),
    status: 'published'
  }
];

async function seedBlog() {
  for (const post of dummyPosts) {
    const { error } = await supabase.from('blogs').upsert({
      title: post.title,
      slug: post.slug,
      category: post.category,
      content: post.content,
      is_published: true
    }, { onConflict: 'slug' });
    
    if (error) {
      console.error('Error inserting', post.title, error);
    } else {
      console.log('Inserted:', post.title);
    }
  }
}

seedBlog();
