import { useState, useEffect } from 'react'
import { NotionPage } from '@/components/NotionPage'
import FilterSort from '@/components/FilterSort'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { extractCategories, filterPagesByCategory, sortPages } from '@/lib/notion-utils'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  const { recordMap } = props
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [filteredRecordMap, setFilteredRecordMap] = useState(recordMap)
  
  // 利用可能なカテゴリを抽出
  const categories = extractCategories(recordMap)
  
  // フィルタとソートの変更を処理
  useEffect(() => {
    if (!recordMap || !recordMap.block) {
      setFilteredRecordMap(recordMap)
      return
    }
    
    try {
      // ページブロックを抽出
      const pageBlocks = Object.values(recordMap.block).filter(
        (block: any) => block.value && block.value.type === 'page'
      )
      
      // カテゴリでフィルタリング
      const filteredBlocks = selectedCategory
        ? filterPagesByCategory(pageBlocks, selectedCategory, recordMap)
        : pageBlocks
        
      // ソート順でソート
      const sortedBlocks = sortPages(filteredBlocks, sortOrder, recordMap)
      
      // 新しいレコードマップを作成
      const newRecordMap = { ...recordMap }
      
      // ブロックマップを更新
      newRecordMap.block = {}
      sortedBlocks.forEach((block: any) => {
        if (block.id) {
          newRecordMap.block[block.id] = block
        }
      })
      
      setFilteredRecordMap(newRecordMap)
    } catch (err) {
      console.error('Filter/Sort error:', err)
      setFilteredRecordMap(recordMap)
    }
  }, [recordMap, selectedCategory, sortOrder])
  
  // カテゴリの変更を処理
  const handleFilterChange = (category: string) => {
    setSelectedCategory(category)
  }
  
  // ソート順の変更を処理
  const handleSortChange = (order: string) => {
    setSortOrder(order)
  }
  
  return (
    <>
      {categories.length > 0 && (
        <FilterSort 
          categories={categories}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      )}
      
      <NotionPage {...props} recordMap={filteredRecordMap} />
    </>
  )
}
