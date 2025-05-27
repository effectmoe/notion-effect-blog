import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev } from '@/lib/config'
import { getSiteMap, getPageIdFromSlug } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { getMenuItems } from '@/lib/menu-utils'
import { type PageProps, type Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params.pageId as string

  try {
    // まずスラッグとして解決を試みる
    let actualPageId = await getPageIdFromSlug(rawPageId)
    
    // スラッグが見つからない場合は、pageIdとして扱う（後方互換性）
    if (!actualPageId) {
      actualPageId = rawPageId
    }
    
    const props = await resolveNotionPage(domain, actualPageId)
    
    // NotionデータベースからMenuがtrueの項目を取得
    const menuItems = await getMenuItems()
    
    // propsにmenuItemsを追加
    return { 
      props: {
        ...props,
        menuItems
      }, 
      revalidate: 10 
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMap = await getSiteMap()

  // ページIDとスラッグ両方のパスを生成
  const paths = []
  
  // 1. ページIDでのパス
  Object.keys(siteMap.canonicalPageMap).forEach((pageId) => {
    paths.push({
      params: { pageId }
    })
  })
  
  // 2. スラッグでのパス（slugToPageMapが存在する場合）
  if (siteMap.slugToPageMap) {
    Object.keys(siteMap.slugToPageMap).forEach((slug) => {
      paths.push({
        params: { pageId: slug }
      })
    })
  }

  const staticPaths = {
    paths,
    fallback: true
  }

  console.log('Generated paths:', staticPaths.paths.length, 'paths')
  return staticPaths
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}