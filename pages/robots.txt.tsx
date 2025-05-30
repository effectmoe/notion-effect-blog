import type { GetServerSideProps } from 'next'

import { host } from '@/lib/config'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()

    return {
      props: {}
    }
  }

  // cache for up to one day
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.setHeader('Content-Type', 'text/plain')

  const domain = process.env.NEXT_PUBLIC_DOMAIN || host
  
  // only allow the site to be crawlable on the production deployment
  if (process.env.VERCEL_ENV === 'production') {
    res.write(`User-agent: *
Allow: /

# Crawl-delay
Crawl-delay: 1

# Sitemap
Sitemap: ${domain}/sitemap.xml

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Allow search engines to index everything else
Allow: /$
Allow: /notion-features
Allow: /all-in-one
Allow: /integrations
Allow: /api-automation
Allow: /workflow-automation
Allow: /data-analysis
Allow: /access-management`)
  } else {
    res.write(`User-agent: *
Disallow: /

Sitemap: ${domain}/sitemap.xml`)
  }

  res.end()

  return {
    props: {}
  }
}

export default function noop() {
  return null
}
