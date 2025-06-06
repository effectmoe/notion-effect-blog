import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { getMenuItems } from '@/lib/menu-utils'
import { notionViews } from '@/lib/notion-views'

export const getServerSideProps = async () => {
  try {
    console.log('[index] Resolving page for domain:', domain)
    console.log('[index] Environment check:', {
      NOTION_PAGE_ID: process.env.NOTION_PAGE_ID ? 'SET' : 'NOT SET',
      NOTION_API_SECRET: process.env.NOTION_API_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL
    })
    
    const props = await resolveNotionPage(domain)
    
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
    console.error('page error', domain, err)
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      type: err.constructor.name
    })

    // Return error page instead of throwing
    return {
      props: {
        error: {
          message: err.message || 'Failed to load page',
          statusCode: err.statusCode || 500
        }
      }
    }
  }
}

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
