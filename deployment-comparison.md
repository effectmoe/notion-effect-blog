# Deployment Issue Comparison: Backup vs Current Project

## Key Differences Found

### 1. **next.config.js** (CRITICAL DIFFERENCE)
- **Backup (Working)**: 
  - basePath and assetPrefix are commented out
  - No /blog subdirectory configuration
```javascript
// basePath: '/blog',
// trailingSlash: true,
```

- **Current (404 Error)**:
  - basePath and assetPrefix are active
  - Configured for /blog subdirectory deployment
```javascript
basePath: '/blog',
assetPrefix: '/blog',
trailingSlash: true,
```

### 2. **Environment Variables (.env.local)**
- **Backup**: No domain or base path environment variables
- **Current**: Added new environment variables:
```bash
NEXT_PUBLIC_DOMAIN=https://notion.effect.moe/blog
NEXT_PUBLIC_BASE_PATH=/blog
NEXT_PUBLIC_VERCEL_URL=${VERCEL_URL}
NOTION_PAGE_ID=3e7769818f7a4ddfa9c19e03d2aadbf2
```

### 3. **vercel.json**
- **Backup**: No vercel.json file
- **Current**: Added vercel.json with basic Next.js configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### 4. **Pages Directory**
- **Backup**: Basic pages only
- **Current**: Added new static pages:
  - access-management.tsx
  - all-in-one.tsx
  - api-automation.tsx
  - data-analysis.tsx
  - integrations.tsx
  - notion-features.tsx
  - workflow-automation.tsx

### 5. **FooterMenu Component**
- **Backup**: No FooterMenu component
- **Current**: Added FooterMenu with hardcoded URLs without basePath:
```javascript
{ id: '1', title: 'Notion機能紹介', url: '/notion-features' },
// These URLs don't include the /blog prefix
```

### 6. **lib/map-page-url.ts**
- **Backup**: No basePath handling
- **Current**: Added basePath support using environment variable

### 7. **site.config.ts**
- **Backup**: Hardcoded rootNotionPageId
- **Current**: Uses environment variable for rootNotionPageId

## Root Cause of 404 Error

The main issue is the **basePath configuration mismatch**. When basePath is set to '/blog' in next.config.js:

1. All routes are expected to be served from /blog/*
2. The FooterMenu component links to `/notion-features` instead of `/blog/notion-features`
3. If the site is deployed to the root domain (https://notion.effect.moe/) but expects /blog paths, it will cause 404 errors

## Recommended Fixes

### Option 1: Remove basePath (Match Working Backup)
```javascript
// In next.config.js, comment out:
// basePath: '/blog',
// assetPrefix: '/blog',
// trailingSlash: true,
```

### Option 2: Fix FooterMenu Links (If Keeping basePath)
Update FooterMenu.tsx to use proper basePath:
```javascript
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const defaultMenuItems: FooterMenuItem[] = [
  { id: '1', title: 'Notion機能紹介', url: `${basePath}/notion-features` },
  // ... other items with basePath prefix
]
```

### Option 3: Use Next.js Link with automatic basePath handling
The Link component from Next.js should automatically handle basePath, but ensure it's used correctly.

## Additional Considerations

1. **Deployment URL**: Verify if the site is deployed to:
   - https://notion.effect.moe/ (requires no basePath)
   - https://notion.effect.moe/blog/ (requires basePath: '/blog')

2. **Environment Variables**: Ensure NEXT_PUBLIC_BASE_PATH is properly set in Vercel deployment

3. **Build Output**: Check if the build output structure matches the deployment expectations