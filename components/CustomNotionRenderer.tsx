import React from 'react'
import Link from 'next/link'
import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'

interface CustomNotionRendererProps {
  recordMap: ExtendedRecordMap
  components?: any
  mapPageUrl?: (pageId: string) => string
  [key: string]: any
}

export const CustomNotionRenderer: React.FC<CustomNotionRendererProps> = ({
  recordMap,
  components = {},
  mapPageUrl,
  ...props
}) => {
  // カスタムLinkコンポーネント
  const CustomLink = ({ href, children, ...linkProps }: any) => {
    // Notionページへの内部リンクかどうかを判定
    const isInternalLink = href && (
      href.startsWith('/') || 
      href.includes('notion.so') ||
      href.match(/^[a-f0-9]{32}$/)
    )

    if (isInternalLink) {
      // ページIDを抽出
      let pageId = href
      if (href.includes('notion.so')) {
        const match = href.match(/([a-f0-9]{32})/)
        pageId = match ? match[1] : href
      }
      
      // mapPageUrlを使用してURLを生成
      let mappedUrl = mapPageUrl ? mapPageUrl(pageId.replace(/-/g, '')) : `/${pageId.replace(/-/g, '')}`
      
      // basePathが含まれていない場合は追加
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      if (mappedUrl && !mappedUrl.startsWith(basePath) && !mappedUrl.startsWith('http')) {
        mappedUrl = `${basePath}${mappedUrl}`
      }
      
      return (
        <Link href={mappedUrl} {...linkProps}>
          {children}
        </Link>
      )
    }

    // 外部リンクの場合
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...linkProps}>
        {children}
      </a>
    )
  }

  const customComponents = {
    ...components,
    Link: CustomLink,
    nextLink: Link
  }

  return (
    <NotionRenderer
      recordMap={recordMap}
      components={customComponents}
      mapPageUrl={mapPageUrl}
      {...props}
    />
  )
}
