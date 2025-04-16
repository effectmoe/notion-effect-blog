import React, { useState, useEffect } from 'react'
import FilterSort from './FilterSort'
import { extractCategories, getFilteredSortedPageIds } from '../lib/notion-display-utils'
import styles from './FilterableImageGallery.module.css'

type FilterableImageGalleryProps = {
  recordMap: any;
  children: React.ReactNode;
}

const FilterableImageGallery: React.FC<FilterableImageGalleryProps> = ({ 
  recordMap, 
  children 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [visiblePageIds, setVisiblePageIds] = useState<string[]>([])
  
  // 利用可能なカテゴリを抽出
  const categories = extractCategories(recordMap)
  
  // フィルタとソートの変更に応じて表示するページIDを更新
  useEffect(() => {
    if (!recordMap) return

    try {
      // 表示するページIDを取得
      const pageIds = getFilteredSortedPageIds(recordMap, selectedCategory, sortOrder)
      setVisiblePageIds(pageIds)
      
      console.log(`Filter applied: ${selectedCategory || 'All'}, Sort: ${sortOrder}, Visible pages: ${pageIds.length}`)
    } catch (err) {
      console.error('Error applying filter/sort:', err)
      // エラー時はすべてのページIDを表示
      setVisiblePageIds([])
    }
  }, [recordMap, selectedCategory, sortOrder])
  
  // カテゴリの変更を処理
  const handleFilterChange = (category: string) => {
    console.log(`Changing category to: ${category || 'All'}`)
    setSelectedCategory(category)
  }
  
  // ソート順の変更を処理
  const handleSortChange = (order: string) => {
    console.log(`Changing sort order to: ${order}`)
    setSortOrder(order)
  }

  return (
    <div className={styles.filterableGalleryContainer}>
      {/* 本番環境では開発用デバッグ情報を表示しない */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.debugInfo}>
          <p><strong>デバッグ情報</strong>:</p>
          <p>利用可能なカテゴリ数: {categories.length}</p>
          {categories.length > 0 ? (
            <ul>
              {categories.map(cat => <li key={cat}>{cat}</li>)}
            </ul>
          ) : (
            <p>カテゴリが見つかりませんでした。</p>
          )}
          <p>表示可能なページID数: {visiblePageIds.length}</p>
        </div>
      )}
      
      {/* フィルタとソートの配置用スタイル */}
      <style jsx global>{`
        /* Notionのギャラリービューを検出 */
        .notion-gallery-view {
          position: relative !important;
        }

        /* フィルタとソートコントロールをギャラリーの右上に配置 */
        .${styles.filterSortWrapper} {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }
      `}</style>
      
      {/* フィルタとソートのコンテナ */}
      {categories.length > 0 && (
        <div className={styles.filterSortWrapper}>
          <FilterSort 
            categories={categories}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>
      )}
      
      {/* フィルタリングとソートのスタイル */}
      <style jsx global>{`
        /* Notionのギャラリービューのコレクションカードを対象にするスタイル */
        .notion-collection-card,
        .notion-gallery-view [data-block-id],
        .notion-collection-view-table [data-block-id] {
          /* デフォルトは表示 */
          transition: opacity 0.3s ease-in-out;
        }
        
        ${visiblePageIds.length > 0 && selectedCategory ? 
          /* 表示するページを指定 */
          `
          /* 一度すべて非表示にする */
          .notion-collection-card,
          .notion-gallery-view [data-block-id],
          .notion-collection-view-table [data-block-id] {
            opacity: 0.3;
            filter: grayscale(50%);
          }

          /* 対象のページだけ表示 */
          ${visiblePageIds.map(id => 
            `.notion-collection-card[data-block-id="${id}"],
             .notion-gallery-view [data-block-id="${id}"],
             .notion-collection-view-table [data-block-id="${id}"]`
          ).join(', ')} {
            opacity: 1;
            filter: none;
          }
          `
          : 
          /* 表示すべきIDのリストがない場合はすべて表示 */
          `
          .notion-collection-card,
          .notion-gallery-view [data-block-id],
          .notion-collection-view-table [data-block-id] {
            opacity: 1;
            filter: none;
          }
          `
        }
      `}</style>
      
      {/* 元のNotionページコンテンツをそのまま表示 */}
      {children}
    </div>
  )
}

export default FilterableImageGallery
