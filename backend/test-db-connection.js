#!/usr/bin/env node
// Test database connection script
require('dotenv').config();
const { Pool } = require('pg');

const connectionStrings = [
  // Try the one from .env
  process.env.DATABASE_URL,
  
  // Try modern pooler format
  `postgresql://postgres.xejqvaxklhvtcdyjheqn:MukeshETAMUFall2024@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  
  // Try old format (what's in .env)
  `postgresql://postgres:MukeshETAMUFall2024@db.xejqvaxklhvtcdyjheqn.supabase.co:5432/postgres`,
  
  // Try direct connection on pooler
  `postgresql://postgres.xejqvaxklhvtcdyjheqn:MukeshETAMUFall2024@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
];

async function testConnection(connectionString, index) {
  console.log(`\n🔍 Testing connection #${index + 1}:`);
  console.log(`   ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
  
  const pool = new Pool({ connectionString });
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`   ✅ SUCCESS! Connected to database`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`   ❌ FAILED: ${error.message}`);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Supabase Database Connections...\n');
  console.log('=' .repeat(60));
  
  let successCount = 0;
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], i);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Summary: ${successCount}/${connectionStrings.length} connection(s) successful\n`);
  
  if (successCount === 0) {
    console.log('💡 Suggestions:');
    console.log('   1. Check your Supabase dashboard: https://supabase.com/dashboard/project/xejqvaxklhvtcdyjheqn/settings/database');
    console.log('   2. Verify your password is correct: MukeshETAMUFall2024');
    console.log('   3. Check if your Supabase project is paused (it may need to be unpaused)');
    console.log('   4. Ensure your IP is allowed (check Supabase network restrictions)');
    console.log('   5. Copy the exact connection string from your Supabase dashboard\n');
  }
}

main().catch(console.error);
