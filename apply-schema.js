#!/usr/bin/env node

/**
 * Apply Supabase schema using the admin SDK
 * Reads SQL from supabase-schema.sql and executes it
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySchema() {
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const sql = fs.readFileSync(schemaPath, 'utf-8');
    console.log('📄 Loaded schema from supabase-schema.sql');

    // Split by semicolon and filter empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`\n📋 Found ${statements.length} SQL statements to execute\n`);

    let executed = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        // Use rpc to execute raw SQL via postgres stored procedure
        // OR use the direct PostgreSQL connection if available
        console.log(`  [${i + 1}/${statements.length}] Executing...`);

        // For Supabase, we need to use the HTTP interface or a stored procedure
        // The simplest approach is to use the REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ sql: stmt }),
        });

        if (!response.ok) {
          // Supabase might not have a direct SQL endpoint
          // Let's try a different approach - check if we can use pg_execute
          console.log(`  ⚠️  HTTP endpoint not available, skipping direct execution`);
          continue;
        }

        const result = await response.json();
        console.log(`  ✓ Statement ${i + 1} executed`);
        executed++;
      } catch (err) {
        console.log(`  ⚠️  Statement ${i + 1}: ${err.message.substring(0, 100)}`);
      }
    }

    console.log(`\n✅ Schema application attempt complete (${executed} statements via HTTP)`);
    console.log('\n⚠️  Note: Supabase HTTP API has limitations for raw SQL execution.');
    console.log('   Please manually run the schema in Supabase Dashboard:');
    console.log('   1. Go to https://app.supabase.com/');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Click "New Query"');
    console.log('   5. Open supabase-schema.sql and copy the entire content');
    console.log('   6. Paste into the editor and click "Run"');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

applySchema();
