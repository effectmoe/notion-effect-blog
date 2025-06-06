import { type GetServerSideProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev } from '@/lib/config'
import { getSiteMap, getPageIdFromSlug } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { getMenuItems } from '@/lib/menu-utils'
import { type PageProps, type Params } from '@/lib/types'

export const getServerSideProps: GetServerSideProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params.pageId as string
  
  console.log(`\n[pageId].tsx - Requested: ${rawPageId}`)

  try {
    // まずスラッグとして解決を試みる
    let actualPageId = await getPageIdFromSlug(rawPageId)
    
    // スラッグが見つからない場合は、pageIdとして扱う
    if (!actualPageId) {
      console.log(`No slug found for "${rawPageId}", using as pageId`)
      actualPageId = rawPageId
    } else {
      console.log(`Slug "${rawPageId}" resolved to pageId: ${actualPageId}`)
    }
    
    const props = await resolveNotionPage(domain, actualPageId)
    
    // NotionデータベースからMenuがtrueの項目を取得
    const menuItems = await getMenuItems()
    
    // propsにmenuItemsを追加
    return { 
      props: {
        ...props,
        menuItems
      }
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)
    
    // 404ページのためのプロパティを返す
    return {
      props: {
        site: null,
        recordMap: null,
        error: {
          statusCode: 404,
          message: 'Page not found'
        },
        pageId: rawPageId,
        menuItems: await getMenuItems()
      }
    }
  }
}

// getStaticPathsは不要なので削除

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}