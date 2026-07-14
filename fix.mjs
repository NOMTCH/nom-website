import postgres from 'postgres';

const sql = postgres('postgresql://postgres.uxnerrixrumizakivjww:%2ANom123%23@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres', { connect_timeout: 10 });

async function run() {
  try {
    console.log("Adding column...");
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS down_payment numeric DEFAULT 0`;
    console.log("Reloading schema...");
    await sql`NOTIFY pgrst, 'reload schema'`;
    console.log("✅ SUKSES BOSQU");
  } catch (e) {
    console.error("ERROR:", e.message);
  } finally {
    await sql.end();
  }
}

run();
