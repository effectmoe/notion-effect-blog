import { GetStaticProps } from 'next'
import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { getMenuItems } from '@/lib/menu-utils'
import { PageProps } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  try {
    const props = await resolveNotionPage(domain, '3e7769818f7a4ddfa9c19e03d2aadbf2')
    const menuItems = await getMenuItems()
    
    return {
      props: {
        ...props,
        menuItems
      },
      revalidate: 10
    }
  } catch (error) {
    console.error('Error in all-in-one page:', error)
    return {
      notFound: true
    }
  }
}

export default function AllInOnePage(props: PageProps & { menuItems?: any[] }) {
  return <NotionPage {...props} />
}
