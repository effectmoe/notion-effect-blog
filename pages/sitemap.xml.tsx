import type { GetServerSideProps } from 'next'

import type { SiteMap } from '@/lib/types'
import { host } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { getMenuItems } from '@/lib/menu-utils'

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

  const siteMap = await getSiteMap()
  const menuItems = await getMenuItems()

  // cache for up to 8 hours
  res.setHeader(
    'Cache-Control',
    'public, max-age=28800, stale-while-revalidate=28800'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMap, menuItems))
  res.end()

  return {
    props: {}
  }
}

const createSitemap = (siteMap: SiteMap, menuItems: any[] = []) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || host
  
  // 静的ページ
  const staticPages = [
    '',
    '/notion-features',
    '/all-in-one',
    '/integrations', 
    '/api-automation',
    '/workflow-automation',
    '/data-analysis',
    '/access-management'
  ]
  
  // 動的ページ（Notionから取得）
  const dynamicPages = Object.entries(siteMap.canonicalPageMap || {}).map(
    ([pageId, slug]) => {
      if (typeof slug === 'string' && slug !== pageId) {
        return `/${slug}`
      }
      return `/${pageId}`
    }
  )
  
  // メニューページ
  const menuPages = menuItems.map(item => item.url)
  
  // すべてのページを結合して重複を除去
  const allPages = [...new Set([...staticPages, ...dynamicPages, ...menuPages])]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${allPages
    .map((path) => {
      const url = `${domain}${path}`
      const priority = path === '' ? '1.0' : path.startsWith('/notion-') ? '0.9' : '0.8'
      
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${priority}</priority>
    </url>`
    })
    .join('')}
</urlset>`
}

export default function noop() {
  return null
}
