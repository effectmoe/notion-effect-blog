import { getAllPagesInSpace, getPageProperty, uuidToId } from 'notion-utils'
import pMemoize from 'p-memoize'

import type * as types from './types'
import * as config from './config'
import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'
import { notion } from './notion-api'

const uuid = !!includeNotionIdInUrls

// スラッグマップを追加
export interface ExtendedSiteMap extends types.SiteMap {
  slugToPageMap?: Record<string, string>
}

export async function getSiteMap(): Promise<ExtendedSiteMap> {
  const partialSiteMap = await getAllPages(
    config.rootNotionPageId,
    config.rootNotionSpaceId
  )

  return {
    site: config.site,
    ...partialSiteMap
  } as ExtendedSiteMap
}

const getAllPages = pMemoize(getAllPagesImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

const getPage = async (pageId: string, ...args) => {
  console.log('\nnotion getPage', uuidToId(pageId))
  return notion.getPage(pageId, ...args)
}

// タイトルからスラッグを生成する関数
function generateSlugFromTitle(title: string): string {
  if (!title) return ''
  
  // 日本語のタイトルをローマ字に変換する処理が必要な場合はここに追加
  // 今回はシンプルに英数字とハイフンのみを残す
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<ExtendedSiteMap>> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    getPage
  )

  const canonicalPageMap = {}
  const slugToPageMap = {}

  Object.keys(pageMap).forEach((pageId: string) => {
    const recordMap = pageMap[pageId]
    if (!recordMap) {
      throw new Error(`Error loading page "${pageId}"`)
    }

    const block = recordMap.block[pageId]?.value
    if (
      !(getPageProperty<boolean | null>('Public', block, recordMap) ?? true)
    ) {
      return
    }

    const canonicalPageId = getCanonicalPageId(pageId, recordMap, { uuid })

    if (canonicalPageMap[canonicalPageId]) {
      console.warn('error duplicate canonical page id', {
        canonicalPageId,
        pageId,
        existingPageId: canonicalPageMap[canonicalPageId]
      })
      return
    }

    canonicalPageMap[canonicalPageId] = pageId

    // デバッグログを追加
    console.log(`\nProcessing page: ${pageId}`)
    
    // Slugプロパティを取得（大文字小文字のバリエーションを試す）
    const customSlug = getPageProperty<string>('Slug', block, recordMap) ||
                      getPageProperty<string>('slug', block, recordMap) ||
                      getPageProperty<string>('SLUG', block, recordMap)
    
    console.log(`Slug value: "${customSlug}"`)
    
    if (customSlug) {
      slugToPageMap[customSlug] = pageId
      console.log(`Added slug mapping: ${customSlug} -> ${pageId}`)
    }

    // タイトルからもスラッグを生成
    const title = getPageProperty<string>('title', block, recordMap)
    if (title && !customSlug) {
      const generatedSlug = generateSlugFromTitle(title)
      if (generatedSlug) {
        slugToPageMap[generatedSlug] = pageId
      }
    }
  })

  // フッターメニュー用のスラッグマッピングは一時的に無効化

  // pageUrlOverridesから実際のマッピングを追加
  if (config.pageUrlOverrides) {
    Object.entries(config.pageUrlOverrides).forEach(([url, pageId]) => {
      const slug = url.replace(/^\//, '')
      if (slug && pageId) {
        slugToPageMap[slug] = pageId
        console.log(`Added override mapping: ${slug} -> ${pageId}`)
      }
    })
  }

  console.log('\nFinal slugToPageMap:', slugToPageMap)

  return {
    pageMap,
    canonicalPageMap,
    slugToPageMap
  }
}

// スラッグからページIDを取得する関数
export async function getPageIdFromSlug(slug: string): Promise<string | null> {
  console.log(`getPageIdFromSlug called with: "${slug}"`)
  
  const siteMap = await getSiteMap()
  const pageId = siteMap.slugToPageMap?.[slug] || null
  
  console.log(`Slug "${slug}" resolved to: ${pageId}`)
  
  return pageId
}