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
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
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

  // 一時的なハードコーディング（動作確認用）
  slugToPageMap['nextjs'] = '175686abab0444bfa254908c0c357bbe'
  console.log('Hardcoded nextjs slug for testing')

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