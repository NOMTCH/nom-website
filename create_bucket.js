const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function createBucket() {
  const sql = postgres(process.env.DATABASE_URL);
  
  try {
    // Insert bucket
    await sql`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('portfolio', 'portfolio', true)
      ON CONFLICT (id) DO NOTHING;
    `;

    // Drop existing policies if any to avoid errors
    await sql`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Auth Update" ON storage.objects;`;
    await sql`DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;`;

    // Create RLS Policies
    // Allow public read access
    await sql`
      CREATE POLICY "Public Access" 
      ON storage.objects FOR SELECT 
      USING ( bucket_id = 'portfolio' );
    `;

    // Allow authenticated users to insert/update/delete
    await sql`
      CREATE POLICY "Auth Upload" 
      ON storage.objects FOR INSERT 
      TO authenticated 
      WITH CHECK ( bucket_id = 'portfolio' );
    `;

    await sql`
      CREATE POLICY "Auth Update" 
      ON storage.objects FOR UPDATE 
      TO authenticated 
      USING ( bucket_id = 'portfolio' );
    `;

    await sql`
      CREATE POLICY "Auth Delete" 
      ON storage.objects FOR DELETE 
      TO authenticated 
      USING ( bucket_id = 'portfolio' );
    `;

    console.log("Bucket 'portfolio' and policies created successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sql.end();
  }
}

createBucket();
