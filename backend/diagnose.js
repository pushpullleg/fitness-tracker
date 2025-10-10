#!/usr/bin/env node
// Comprehensive diagnostics for Fittober Fitness Tracker

console.log('🔍 FITTOBER FITNESS TRACKER - DIAGNOSTICS\n');
console.log('='.repeat(60));

// Check 1: Environment Variables
console.log('\n✓ Check 1: Environment Variables');
console.log('-'.repeat(60));
require('dotenv').config();

const checks = {
  'DATABASE_URL': process.env.DATABASE_URL,
  'TWILIO_SID': process.env.TWILIO_SID,
  'TWILIO_TOKEN': process.env.TWILIO_TOKEN,
  'TWILIO_FROM': process.env.TWILIO_FROM,
  'TWILIO_TO': process.env.TWILIO_TO,
  'PORT': process.env.PORT,
  'NODE_ENV': process.env.NODE_ENV
};

let missingVars = [];
for (const [key, value] of Object.entries(checks)) {
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`   ❌ ${key}: NOT SET or using placeholder`);
    missingVars.push(key);
  } else {
    // Mask sensitive data
    const displayValue = key.includes('TOKEN') || key.includes('PASSWORD') || key.includes('URL')
      ? value.substring(0, 20) + '****' 
      : value;
    console.log(`   ✅ ${key}: ${displayValue}`);
  }
}

// Check 2: Database URL Format
console.log('\n✓ Check 2: Database URL Format');
console.log('-'.repeat(60));
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Username: ${url.username}`);
    console.log(`   Password: ${url.password ? '****' + url.password.slice(-4) : 'NOT SET'}`);
    console.log(`   Hostname: ${url.hostname}`);
    console.log(`   Port: ${url.port}`);
    console.log(`   Database: ${url.pathname.slice(1)}`);
    
    // Check for common issues
    if (url.hostname.includes('db.') && url.hostname.includes('.supabase.co')) {
      console.log(`   ⚠️  WARNING: You're using the OLD Supabase format (db.*.supabase.co)`);
      console.log(`   💡 Modern format: postgres.[PROJECT-REF]@aws-*.pooler.supabase.com`);
    }
  } catch (e) {
    console.log(`   ❌ Invalid DATABASE_URL format: ${e.message}`);
  }
} else {
  console.log(`   ❌ DATABASE_URL is not set`);
}

// Check 3: Node.js Dependencies
console.log('\n✓ Check 3: Required Node.js Packages');
console.log('-'.repeat(60));
const requiredPackages = ['express', 'axios', 'pg', 'twilio', 'dotenv'];
requiredPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`   ✅ ${pkg}: installed`);
  } catch (e) {
    console.log(`   ❌ ${pkg}: NOT INSTALLED`);
    missingVars.push(pkg);
  }
});

// Check 4: Database Connection Test
console.log('\n✓ Check 4: Database Connection Test');
console.log('-'.repeat(60));

const { Pool } = require('pg');

async function testDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log('   ❌ Cannot test: DATABASE_URL not set');
    return false;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const client = await pool.connect();
    console.log('   ✅ Database connection: SUCCESS');
    
    // Test query
    const result = await client.query('SELECT NOW() as time, version() as version');
    console.log(`   ✅ Database time: ${result.rows[0].time}`);
    console.log(`   ✅ PostgreSQL: ${result.rows[0].version.split(' ')[1]}`);
    
    // Check if activities table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'activities'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('   ✅ Table "activities": EXISTS');
      
      // Count rows
      const count = await client.query('SELECT COUNT(*) FROM activities');
      console.log(`   ✅ Activities in database: ${count.rows[0].count}`);
    } else {
      console.log('   ❌ Table "activities": DOES NOT EXIST');
      console.log('   💡 You need to run database.sql to create the table');
      missingVars.push('activities table');
    }
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`   ❌ Database connection: FAILED`);
    console.log(`   Error: ${error.message}`);
    
    // Provide specific guidance based on error
    if (error.message.includes('password authentication failed')) {
      console.log('\n   💡 Password authentication failed. Please check:');
      console.log('      1. Go to Supabase Dashboard > Settings > Database');
      console.log('      2. Look for "Database password" section');
      console.log('      3. Use "Reset database password" if needed');
      console.log('      4. Update DATABASE_URL in .env file');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n   💡 Hostname not found. You may be using an old connection string.');
      console.log('      Get the latest from: Supabase Dashboard > Settings > Database');
    }
    
    await pool.end();
    return false;
  }
}

// Check 5: GitHub Gists Access
console.log('\n✓ Check 5: GitHub Gists Access');
console.log('-'.repeat(60));

const axios = require('axios');
const GIST_URLS = [
  'https://gist.github.com/pushpullleg/9c7ab834aa55e54fa70f61d501bf019d',
  'https://gist.github.com/pushpullleg/b2ff0075e1556c7b39d6f1bbc9860a90',
  'https://gist.github.com/pushpullleg/b41a48c3557b59ad55d60c08a0bd2517',
  'https://gist.github.com/pushpullleg/5a8d4b337f4e2c5916559b193dc5b1c4'
];

async function testGists() {
  for (let i = 0; i < GIST_URLS.length; i++) {
    try {
      const response = await axios.get(`${GIST_URLS[i]}/raw`, { timeout: 5000 });
      const logs = response.data.logs || response.data.activities || [];
      console.log(`   ✅ Gist ${i + 1}: ${logs.length} activities found`);
    } catch (error) {
      console.log(`   ❌ Gist ${i + 1}: ${error.message}`);
    }
  }
}

// Run all async checks
async function runDiagnostics() {
  await testDatabase();
  await testGists();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));
  
  if (missingVars.length === 0) {
    console.log('✅ All checks passed! Your fitness tracker should work.');
  } else {
    console.log(`❌ Found ${missingVars.length} issue(s) that need attention:`);
    missingVars.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item}`);
    });
  }
  
  console.log('\n💡 NEXT STEPS:');
  console.log('   1. Fix any issues listed above');
  console.log('   2. Update your .env file with correct values');
  console.log('   3. Run: node index.js');
  console.log('   4. Test: curl http://localhost:3001/health\n');
}

runDiagnostics().catch(console.error);
