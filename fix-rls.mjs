import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function fixRLS() {
  try {
    console.log("Fixing RLS for pricing_packages...");
    
    // Drop existing bad policies
    await sql`DROP POLICY IF EXISTS "Allow read access" ON pricing_packages`;
    await sql`DROP POLICY IF EXISTS "Allow public read access" ON pricing_packages`;
    await sql`DROP POLICY IF EXISTS "Allow admin all access" ON pricing_packages`;
    
    // Re-create proper policies
    await sql`
      CREATE POLICY "Allow public read access" 
      ON pricing_packages 
      FOR SELECT 
      TO anon, authenticated 
      USING (true);
    `;
    
    await sql`
      CREATE POLICY "Allow admin all access" 
      ON pricing_packages 
      FOR ALL 
      TO authenticated 
      USING (auth.role() = 'authenticated') 
      WITH CHECK (auth.role() = 'authenticated');
    `;

    console.log("Fixing RLS for blogs...");
    await sql`ALTER TABLE blogs ENABLE ROW LEVEL SECURITY`;
    await sql`DROP POLICY IF EXISTS "Allow public read blogs" ON blogs`;
    await sql`DROP POLICY IF EXISTS "Allow admin all blogs" ON blogs`;

    await sql`
      CREATE POLICY "Allow public read blogs" 
      ON blogs 
      FOR SELECT 
      TO anon, authenticated 
      USING (true);
    `;
    
    await sql`
      CREATE POLICY "Allow admin all blogs" 
      ON blogs 
      FOR ALL 
      TO authenticated 
      USING (auth.role() = 'authenticated') 
      WITH CHECK (auth.role() = 'authenticated');
    `;

    console.log("Fixing RLS for invoices (Only Admin should see invoices)...");
    await sql`ALTER TABLE invoices ENABLE ROW LEVEL SECURITY`;
    await sql`DROP POLICY IF EXISTS "Allow admin all invoices" ON invoices`;

    await sql`
      CREATE POLICY "Allow admin all invoices" 
      ON invoices 
      FOR ALL 
      TO authenticated 
      USING (auth.role() = 'authenticated') 
      WITH CHECK (auth.role() = 'authenticated');
    `;

    console.log("All RLS policies successfully secured!");
  } catch (error) {
    console.error("Error securing RLS:", error);
  } finally {
    await sql.end();
  }
}

fixRLS();
