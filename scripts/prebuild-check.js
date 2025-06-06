#!/usr/bin/env node

console.log('=== PREBUILD ENVIRONMENT CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

// Check for NEXT_PUBLIC_SITE_CONFIG
if (process.env.NEXT_PUBLIC_SITE_CONFIG) {
  console.log('\nNEXT_PUBLIC_SITE_CONFIG is set!');
  console.log('Raw value:', process.env.NEXT_PUBLIC_SITE_CONFIG);
  
  try {
    const parsed = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG);
    console.log('Parsed value:', JSON.stringify(parsed, null, 2));
    
    if (parsed.pageUrlOverrides) {
      console.log('\npageUrlOverrides found in NEXT_PUBLIC_SITE_CONFIG:');
      Object.entries(parsed.pageUrlOverrides).forEach(([key, value]) => {
        console.log(`  ${key}: ${value} (type: ${typeof value})`);
        if (typeof value === 'string' && value.includes('_PAGE_ID')) {
          console.error(`  ⚠️  WARNING: This looks like an unresolved env var!`);
        }
      });
    }
  } catch (e) {
    console.error('Failed to parse NEXT_PUBLIC_SITE_CONFIG:', e.message);
  }
} else {
  console.log('\nNEXT_PUBLIC_SITE_CONFIG is not set');
}

// Check for any environment variables that might contain PAGE_ID
console.log('\n=== Checking for PAGE_ID environment variables ===');
Object.entries(process.env).forEach(([key, value]) => {
  if (key.includes('PAGE_ID') || (typeof value === 'string' && value.includes('_PAGE_ID'))) {
    console.log(`${key}: ${value}`);
  }
});

console.log('\n=== END PREBUILD CHECK ===\n');