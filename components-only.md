This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: **/*.{js,jsx,ts,tsx}, **/*.{css,module.css}, **/*.json, **/*.md, site.config.ts
- Files matching these patterns are excluded: lib/fonts/**, **/fonts/**, **/*のコピー*, notion-api-integration/**, **/*.backup, **/*.bak
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
CategoryFilterButton.module.css
CategoryFilterButton.tsx
ErrorPage.tsx
FilterableImageGallery.jsx
FilterableImageGallery.module.css
FilterableImageGallery.tsx
FilterableNotionPage.tsx
FilterSort.module.css
FilterSort.tsx
FontSettingsPanel.jsx
FontStyler.jsx
Footer.tsx
GitHubShareButton.tsx
HamburgerMenu.module.css
HamburgerMenu.tsx
Header.module.css
Header.tsx
HeaderMenu.module.css
HeaderMenu.tsx
Loading.tsx
LoadingIcon.tsx
NotionPage.tsx
NotionPageHeader.tsx
NotionPageWithMenu.module.css
NotionPageWithMenu.tsx
NotionViewTabs.module.css
NotionViewTabs.tsx
Page404.tsx
PageActions.tsx
PageAside.tsx
PageHead.tsx
PageSocial.module.css
PageSocial.tsx
SimplifiedSearch.module.css
SimplifiedSearch.tsx
styles.module.css
WhatsNewStyling.tsx
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="CategoryFilterButton.module.css">
.filterContainer {
  position: absolute;
  top: 8px;
  right: 15px;
  z-index: 100;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  display: inline-block;
}

.filterButton {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 13px;
  cursor: pointer;
  color: rgb(55, 53, 47);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 120px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
  transition: background 120ms ease-in 0s;
}

.filterButton:hover {
  background-color: rgba(55, 53, 47, 0.08);
}

.dropdownMenu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  min-width: 180px;
  overflow: hidden;
  max-height: 70vh;
  overflow-y: auto;
}

.dropdownItem {
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  color: rgb(55, 53, 47);
  transition: background 20ms ease-in 0s;
}

.dropdownItem:hover {
  background-color: rgba(55, 53, 47, 0.08);
}

.dropdownItem.active {
  background-color: rgba(35, 131, 226, 0.14);
  color: rgb(35, 131, 226);
  font-weight: 500;
}

/* Notionスタイルとの調和 */
@media (max-width: 768px) {
  .filterContainer {
    position: relative;
    top: auto;
    right: auto;
    margin: 1rem auto;
    max-width: 90%;
  }
  
  .filterButton {
    width: 100%;
  }
}
</file>

<file path="CategoryFilterButton.tsx">
import React, { useState } from 'react'
import styles from './CategoryFilterButton.module.css'

type CategoryFilterButtonProps = {
  categories: string[];
}

const CategoryFilterButton: React.FC<CategoryFilterButtonProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
    
    // カテゴリフィルタリングのロジック
    // DOM操作で直接要素を表示/非表示にする
    if (category) {
      // すべてのカードを一旦半透明にする
      document.querySelectorAll('.notion-collection-card').forEach((card: HTMLElement) => {
        card.style.opacity = '0.4';
        card.style.filter = 'grayscale(50%)';
        card.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
      });
      
      // 選択したカテゴリに一致するカードだけを表示
      document.querySelectorAll(`[data-category="${category}"]`).forEach((card: HTMLElement) => {
        card.style.opacity = '1';
        card.style.filter = 'none';
      });
    } else {
      // カテゴリ未選択の場合はすべて表示
      document.querySelectorAll('.notion-collection-card').forEach((card: HTMLElement) => {
        card.style.opacity = '1';
        card.style.filter = 'none';
      });
    }
  };

  // カテゴリがない場合は何も表示しない
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.filterContainer} id="category-filter-button">
      <button 
        className={styles.filterButton} 
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {selectedCategory || 'すべてのカテゴリ'} ▼
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div 
            className={`${styles.dropdownItem} ${selectedCategory === '' ? styles.active : ''}`}
            onClick={() => selectCategory('')}
          >
            すべて表示
          </div>
          
          {categories.map(category => (
            <div 
              key={category}
              className={`${styles.dropdownItem} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => selectCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilterButton;
</file>

<file path="ErrorPage.tsx">
import { PageHead } from './PageHead'
import styles from './styles.module.css'

export function ErrorPage({ statusCode }: { statusCode: number }) {
  const title = 'Error'

  return (
    <>
      <PageHead title={title} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Error Loading Page</h1>

          {statusCode && <p>Error code: {statusCode}</p>}

          <img src='/error.png' alt='Error' className={styles.errorImage} />
        </main>
      </div>
    </>
  )
}
</file>

<file path="FilterableImageGallery.jsx">
import React, { useState, useEffect, useRef } from 'react'
import FilterSort from './FilterSort'
import { extractCategories, getFilteredSortedPageIds } from '../lib/notion-display-utils'
import styles from './FilterableImageGallery.module.css'

const FilterableImageGallery = ({ recordMap, children }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [visiblePageIds, setVisiblePageIds] = useState([])
  const [notionGalleryLoaded, setNotionGalleryLoaded] = useState(false)
  const filterSortRef = useRef(null)
  
  // 利用可能なカテゴリを抽出
  const categories = extractCategories(recordMap)
  
  // NotionのギャラリービューのDOM要素を監視
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // MutationObserverを使ってNotionギャラリーが読み込まれたかを検出
    const observer = new MutationObserver((mutations) => {
      const galleryView = document.querySelector('.notion-gallery-view')
      if (galleryView && !notionGalleryLoaded) {
        console.log('Notion gallery view detected')
        setNotionGalleryLoaded(true)
        
        // フィルタとソートをギャラリー内の適切な位置に配置
        if (filterSortRef.current && categories.length > 0) {
          try {
            // フィルタとソートをギャラリーの上部に挿入
            galleryView.style.position = 'relative'
            galleryView.style.paddingTop = '50px'
            galleryView.insertBefore(filterSortRef.current, galleryView.firstChild)
            
            console.log('Filter and sort controls positioned')
          } catch (err) {
            console.error('Error positioning filter and sort controls:', err)
          }
        }
      }
    })
    
    // bodyを監視開始
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => {
      // コンポーネントのアンマウント時に監視を停止
      observer.disconnect()
    }
  }, [categories.length, notionGalleryLoaded])
  
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
  const handleFilterChange = (category) => {
    console.log(`Changing category to: ${category || 'All'}`)
    setSelectedCategory(category)
  }
  
  // ソート順の変更を処理
  const handleSortChange = (order) => {
    console.log(`Changing sort order to: ${order}`)
    setSortOrder(order)
  }

  return (
    <div className={styles.filterableGalleryContainer}>
      {/* 開発環境のみデバッグ情報を表示 */}
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
          <p>NotionギャラリーDOM検出: {notionGalleryLoaded ? 'あり' : 'なし'}</p>
        </div>
      )}
      
      {/* フィルタとソートのコントロール（DOMに挿入されるまで非表示） */}
      {categories.length > 0 && (
        <div ref={filterSortRef} className={styles.filterSortWrapper} style={{ display: 'none' }}>
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
          /* カテゴリ選択がない場合はすべて表示 */
          `
          .notion-collection-card,
          .notion-gallery-view [data-block-id],
          .notion-collection-view-table [data-block-id] {
            opacity: 1;
            filter: none;
          }
          `
        }
        
        /* DOMに挿入された後のスタイル */
        .notion-gallery-view .${styles.filterSortWrapper} {
          display: block !important;
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }
      `}</style>
      
      {/* 元のNotionページコンテンツをそのまま表示 */}
      {children}
    </div>
  )
}

export default FilterableImageGallery
</file>

<file path="FilterableImageGallery.module.css">
.filterableGalleryContainer {
  position: relative;
  width: 100%;
}

.filterSortWrapper {
  display: block;
  margin-bottom: 1rem;
}

.debugInfo {
  padding: 10px;
  margin: 10px 0;
  background-color: #ffefef;
  border: 1px solid #ffcfcf;
  border-radius: 4px;
  font-size: 14px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.debugInfo ul {
  margin: 5px 0;
  padding-left: 20px;
}

/* メディアクエリで小さな画面のフィルタとソートの位置を調整 */
@media only screen and (max-width: 768px) {
  .filterSortWrapper {
    position: relative !important;
    top: 0 !important;
    right: 0 !important;
    margin: 1rem auto;
    max-width: 90%;
  }
}
</file>

<file path="FilterableImageGallery.tsx">
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
</file>

<file path="FilterableNotionPage.tsx">
import React, { useState, useEffect } from 'react'
import { NotionPage } from './NotionPage'
import FilterSort from './FilterSort'
import { extractCategories, getFilteredSortedPageIds } from '../lib/notion-display-utils'

// NotionPageをフィルタとソート機能で拡張するラッパーコンポーネント
const FilterableNotionPage: React.FC<any> = (props) => {
  const { recordMap } = props
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

  // NotionPageに拡張プロパティを渡す
  const enhancedProps = {
    ...props,
    // visiblePageIds: 表示するページIDのリスト
    // 重要: ここでrecordMapは変更せず、追加のプロパティとして渡す
    visiblePageIds
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
      
      <NotionPage {...enhancedProps} />
    </>
  )
}

export default FilterableNotionPage
</file>

<file path="FilterSort.module.css">
.filterSortContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border: 1px solid rgba(200, 200, 200, 0.3);
}

.filterContainer, .sortContainer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filterSelect, .sortSelect {
  padding: 0.5rem;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  min-width: 120px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filterSelect:focus, .sortSelect:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
}

/* レスポンシブ設定 */
@media only screen and (max-width: 767px) {
  .filterSortContainer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
  }
  
  .filterContainer, .sortContainer {
    width: 100%;
  }
  
  .filterSelect, .sortSelect {
    flex-grow: 1;
  }
}
</file>

<file path="FilterSort.tsx">
import React, { useState, useEffect } from 'react'
import styles from './FilterSort.module.css'

type FilterSortProps = {
  categories: string[];
  onFilterChange: (category: string) => void;
  onSortChange: (sortOrder: string) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ categories, onFilterChange, onSortChange }) => {
  return (
    <div className={styles.filterSortContainer}>
      <div className={styles.filterContainer}>
        <label htmlFor="category-filter">カテゴリ:</label>
        <select 
          id="category-filter"
          onChange={(e) => onFilterChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">すべて</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.sortContainer}>
        <label htmlFor="sort-select">並び順:</label>
        <select 
          id="sort-select"
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
          <option value="title_asc">タイトル (A-Z)</option>
          <option value="title_desc">タイトル (Z-A)</option>
        </select>
      </div>
    </div>
  )
}

export default FilterSort
</file>

<file path="FontSettingsPanel.jsx">
// components/FontSettingsPanel.jsx
import React, { useState, useEffect } from 'react';
import { fontSettings as defaultSettings } from '../lib/font-customizer/font-settings';
import { saveFontSettingsToLocalStorage } from '../lib/font-customizer/font-utils';

const FontSettingsPanel = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('title');
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fontList, setFontList] = useState([
    { name: 'Noto Sans JP', import: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" },
    { name: 'Noto Serif JP', import: "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap" },
    { name: 'M PLUS 1p', import: "https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap" },
    { name: 'Kosugi Maru', import: "https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" },
    { name: 'Sawarabi Gothic', import: "https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&display=swap" },
    { name: 'Sawarabi Mincho', import: "https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap" },
    { name: 'BIZ UDPGothic', import: "https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap" },
    { name: 'BIZ UDPMincho', import: "https://fonts.googleapis.com/css2?family=BIZ+UDPMincho&display=swap" },
    { name: 'Shippori Mincho', import: "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&display=swap" },
    { name: 'Zen Maru Gothic', import: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap" },
    { name: 'Zen Kaku Gothic New', import: "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" },
    { name: 'Zen Old Mincho', import: "https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500;700&display=swap" },
    { name: 'Yuji Syuku', import: "https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap" },
    { name: 'Murecho', import: "https://fonts.googleapis.com/css2?family=Murecho:wght@400;500;700&display=swap" },
  ]);
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState('');

  // ユーザーの変更を設定に適用
  const handleChange = (property, value) => {
    setSettings({
      ...settings,
      [activeTab]: {
        ...settings[activeTab],
        [property]: value
      }
    });
    
    if (property === 'fontFamily') {
      // フォントファミリーが変更された場合、対応するimportも更新
      const selectedFont = fontList.find(font => font.name === value.replace(/'/g, '').replace(/,.+$/, ''));
      if (selectedFont) {
        setSettings({
          ...settings,
          [activeTab]: {
            ...settings[activeTab],
            fontFamily: `'${selectedFont.name}', sans-serif`,
            fontImport: selectedFont.import
          }
        });
      }
    }
    
    setSaved(false);
  };

  // 設定を保存（サーバーとローカルストレージの両方に）
  const saveSettings = async () => {
    try {
      // APIを使ってサーバーに保存
      const response = await fetch('/api/font-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      // ローカルストレージにも保存
      saveFontSettingsToLocalStorage(settings);
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.warn('サーバーへの保存に失敗しましたが、ローカルには保存されました');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('設定の保存に失敗しました', error);
      // サーバー保存に失敗してもローカルには保存できるかもしれない
      const localSaved = saveFontSettingsToLocalStorage(settings);
      if (localSaved) {
        console.log('ローカルストレージには保存されました');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('設定の保存に失敗しました');
      }
    }
  };
  
  // 初期設定に戻す
  const resetToDefault = () => {
    if (confirm('本当に初期設定に戻しますか？')) {
      setSettings(defaultSettings);
      setSaved(false);
    }
  };

  // プレセットを保存
  const saveAsPreset = () => {
    if (!presetName) {
      alert('プリセット名を入力してください');
      return;
    }
    
    const newPreset = {
      name: presetName,
      settings: { ...settings }
    };
    
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('fontPresets', JSON.stringify(updatedPresets));
    setPresetName('');
    
    alert(`プリセット "${presetName}" が保存されました`);
  };

  // プリセットを読み込む
  const loadPreset = (index) => {
    if (confirm('現在の設定を破棄して、プリセットを読み込みますか？')) {
      setSettings({ ...presets[index].settings });
      setSaved(false);
    }
  };

  // プリセットを削除
  const deletePreset = (index) => {
    if (confirm('このプリセットを削除しますか？')) {
      const updatedPresets = [...presets];
      updatedPresets.splice(index, 1);
      setPresets(updatedPresets);
      localStorage.setItem('fontPresets', JSON.stringify(updatedPresets));
    }
  };

  // プレビュー用のスタイル
  const previewStyles = showPreview ? {
    fontFamily: settings[activeTab].fontFamily,
    color: settings[activeTab].color,
    fontSize: settings[activeTab].fontSize,
    fontWeight: settings[activeTab].fontWeight,
    backgroundColor: settings[activeTab].backgroundColor,
    textAlign: settings[activeTab].textAlign,
    letterSpacing: settings[activeTab].letterSpacing,
    lineHeight: settings[activeTab].lineHeight,
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    maxWidth: '100%',
    marginTop: '20px'
  } : { display: 'none' };

  // プレビューテキストを取得
  const getPreviewText = () => {
    switch(activeTab) {
      case 'title':
        return 'これはタイトルのプレビューです';
      case 'heading1':
        return 'これは見出し1のプレビューです';
      case 'heading2':
        return 'これは見出し2のプレビューです';
      case 'heading3':
        return 'これは見出し3のプレビューです';
      case 'text':
        return 'これは通常テキストのプレビューです。長めの文章を表示すると行間や文字間隔の効果がわかりやすくなります。フォントの美しさは細部にこそ宿ります。';
      case 'toggle':
        return 'これはトグルのプレビューです。クリックして開閉するコンテンツです。';
      case 'toggleHeading1':
        return 'これはトグル見出し1のプレビューです';
      case 'toggleHeading2':
        return 'これはトグル見出し2のプレビューです';
      case 'toggleHeading3':
        return 'これはトグル見出し3のプレビューです';
      default:
        return 'プレビューテキスト';
    }
  };

  // 設定とプリセットを読み込む
  useEffect(() => {
    // サーバーから設定を読み込む
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/font-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('設定の読み込みに失敗しました', error);
      }
    };
    
    // ローカルストレージからプリセットを読み込む
    const loadPresets = () => {
      const savedPresets = localStorage.getItem('fontPresets');
      if (savedPresets) {
        try {
          setPresets(JSON.parse(savedPresets));
        } catch (e) {
          console.error('プリセットの読み込みに失敗しました', e);
        }
      }
    };
    
    fetchSettings();
    loadPresets();
  }, []);

  return (
    <div className="font-settings-panel bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Notion-Effect-Blog フォント設定</h2>
      
      {/* タブナビゲーション */}
      <div className="tabs flex flex-wrap gap-1 mb-6 border-b border-gray-200">
        {Object.keys(settings).map(tabName => (
          <button
            key={tabName}
            className={`px-4 py-2 rounded-t-lg ${activeTab === tabName ? 'bg-purple-100 font-bold text-purple-800' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setActiveTab(tabName)}
          >
            {tabName === 'title' ? 'タイトル' :
             tabName === 'heading1' ? '見出し1' :
             tabName === 'heading2' ? '見出し2' :
             tabName === 'heading3' ? '見出し3' :
             tabName === 'text' ? 'テキスト' :
             tabName === 'toggle' ? 'トグル' :
             tabName === 'toggleHeading1' ? 'トグル見出し1' :
             tabName === 'toggleHeading2' ? 'トグル見出し2' :
             tabName === 'toggleHeading3' ? 'トグル見出し3' : tabName}
          </button>
        ))}
      </div>
      
      <div className="settings-form grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* フォントファミリー */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">フォント</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings[activeTab].fontFamily.replace(/'/g, '').replace(/,.+$/, '')}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
          >
            {fontList.map(font => (
              <option key={font.name} value={font.name}>{font.name}</option>
            ))}
          </select>
        </div>
        
        {/* 文字色 */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">文字色</label>
          <div className="flex items-center">
            <input
              type="color"
              className="w-10 h-10 mr-2"
              value={settings[activeTab].color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              value={settings[activeTab].color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </div>
        </div>
        
        {/* フォントサイズ */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            フォントサイズ: {settings[activeTab].fontSize}
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings[activeTab].fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
          />
          <small className="text-gray-500">例: 1rem, 16px, 2em など</small>
        </div>
        
        {/* フォント太さ */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">フォント太さ</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings[activeTab].fontWeight}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
          >
            <option value="100">Thin (100)</option>
            <option value="200">Extra Light (200)</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra Bold (800)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>
        
        {/* 背景色 */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">背景色</label>
          <div className="flex items-center">
            <input
              type="color"
              className="w-10 h-10 mr-2"
              value={settings[activeTab].backgroundColor === 'transparent' ? '#ffffff' : settings[activeTab].backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md"
              value={settings[activeTab].backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
            <button
              className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
              onClick={() => handleChange('backgroundColor', 'transparent')}
            >
              透明
            </button>
          </div>
        </div>
        
        {/* テキスト配置 */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">テキスト配置</label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`flex-1 py-2 ${settings[activeTab].textAlign === 'left' ? 'bg-purple-100 text-purple-800' : 'bg-white'}`}
              onClick={() => handleChange('textAlign', 'left')}
            >
              左揃え
            </button>
            <button
              className={`flex-1 py-2 ${settings[activeTab].textAlign === 'center' ? 'bg-purple-100 text-purple-800' : 'bg-white'}`}
              onClick={() => handleChange('textAlign', 'center')}
            >
              中央
            </button>
            <button
              className={`flex-1 py-2 ${settings[activeTab].textAlign === 'right' ? 'bg-purple-100 text-purple-800' : 'bg-white'}`}
              onClick={() => handleChange('textAlign', 'right')}
            >
              右揃え
            </button>
          </div>
        </div>
        
        {/* 字間 */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            字間: {settings[activeTab].letterSpacing}
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings[activeTab].letterSpacing}
            onChange={(e) => handleChange('letterSpacing', e.target.value)}
          />
          <small className="text-gray-500">例: 0.05em, 1px など</small>
        </div>
        
        {/* 行間 */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            行間: {settings[activeTab].lineHeight}
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings[activeTab].lineHeight}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
          />
          <small className="text-gray-500">例: 1.5, 2, 24px など</small>
        </div>
      </div>
      
      {/* プレビュートグル */}
      <div className="flex items-center mt-6 mb-4">
        <input
          type="checkbox"
          id="preview-toggle"
          className="mr-2"
          checked={showPreview}
          onChange={() => setShowPreview(!showPreview)}
        />
        <label htmlFor="preview-toggle" className="text-gray-700">プレビューを表示</label>
      </div>
      
      {/* プレビュー領域 */}
      <div className="preview" style={previewStyles}>
        {getPreviewText()}
      </div>
      
      {/* プリセット管理 */}
      <div className="preset-manager mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">プリセット管理</h3>
        
        {/* プリセット保存フォーム */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="プリセット名"
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            onClick={saveAsPreset}
          >
            現在の設定を保存
          </button>
        </div>
        
        {/* プリセット一覧 */}
        {presets.length > 0 ? (
          <div className="preset-list grid grid-cols-1 md:grid-cols-2 gap-3">
            {presets.map((preset, index) => (
              <div key={index} className="preset-item p-3 bg-white rounded-md border border-gray-200 flex justify-between items-center">
                <span className="font-medium">{preset.name}</span>
                <div className="flex">
                  <button
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm mr-2 hover:bg-blue-200"
                    onClick={() => loadPreset(index)}
                  >
                    読込
                  </button>
                  <button
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                    onClick={() => deletePreset(index)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">保存されたプリセットはありません</p>
        )}
      </div>
      
      {/* 保存ボタン */}
      <div className="actions mt-6 flex justify-between">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          onClick={saveSettings}
        >
          設定を保存
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={resetToDefault}
        >
          初期設定に戻す
        </button>
      </div>
      
      {/* 保存成功メッセージ */}
      {saved && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          ✅ 設定が保存されました
        </div>
      )}
      
      {/* 設定をコピーするボタン */}
      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {
            const settingsJson = JSON.stringify(settings, null, 2);
            navigator.clipboard.writeText(settingsJson);
            alert('設定JSONがクリップボードにコピーされました。');
          }}
        >
          設定JSONをコピー
        </button>
        <p className="mt-2 text-sm text-gray-600">
          このボタンで生成されたJSONを保存しておくと、後で復元することができます。
        </p>
      </div>
      
      {/* 高度な設定 */}
      <details className="mt-6 p-4 border border-gray-200 rounded-md">
        <summary className="font-medium text-gray-700 cursor-pointer">高度な設定</summary>
        <div className="mt-4">
          <p className="mb-2 text-sm">設定JSONを直接編集（上級ユーザー向け）：</p>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-md font-mono text-sm"
            value={JSON.stringify(settings, null, 2)}
            onChange={(e) => {
              try {
                const newSettings = JSON.parse(e.target.value);
                setSettings(newSettings);
                setSaved(false);
              } catch (error) {
                console.error('JSONの解析に失敗しました', error);
                // エラー時は何もしない
              }
            }}
          />
        </div>
      </details>
    </div>
  );
};

export default FontSettingsPanel;
</file>

<file path="FontStyler.jsx">
// components/FontStyler.jsx
import React, { useEffect, useState } from 'react';
import { generateFontCSS, loadFontSettingsFromLocalStorage } from '../lib/font-customizer/font-utils';
import { fontSettings as defaultSettings } from '../lib/font-customizer/font-settings';

export const FontStyler = () => {
  const [settings, setSettings] = useState(defaultSettings);
  
  useEffect(() => {
    // サーバーサイドレンダリング時には実行しない
    if (typeof window === 'undefined') return;
    
    // 設定を読み込む関数
    const loadSettings = async () => {
      try {
        // 最初にAPIから設定を読み込もうとする
        const response = await fetch('/api/font-settings');
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          // APIが失敗したらローカルストレージから読み込む
          const loadedSettings = loadFontSettingsFromLocalStorage();
          if (loadedSettings) {
            setSettings(loadedSettings);
          }
        }
      } catch (error) {
        console.warn('設定の読み込みに失敗しました', error);
        // エラー時はローカルストレージを試す
        try {
          const loadedSettings = loadFontSettingsFromLocalStorage();
          if (loadedSettings) {
            setSettings(loadedSettings);
          }
        } catch (e) {
          console.error('ローカルストレージからの読み込みに失敗しました', e);
        }
      }
    };
    
    loadSettings();
  }, []);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 既存のスタイルタグを探す
    let styleTag = document.getElementById('custom-font-styles');
    
    // なければ作成
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'custom-font-styles';
      document.head.appendChild(styleTag);
    }
    
    // CSSを生成して適用
    const css = generateFontCSS(settings);
    styleTag.innerHTML = css;
  }, [settings]);

  return null; // このコンポーネントはUIを持たない
};

export default FontStyler;
</file>

<file path="Footer.tsx">
import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { FaMastodon } from '@react-icons/all-files/fa/FaMastodon'
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter'
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube'
import { FaZhihu } from '@react-icons/all-files/fa/FaZhihu'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook'
import * as React from 'react'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const currentYear = new Date().getFullYear()

  const onToggleDarkMode = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        Copyright {currentYear} {config.author}
      </div>

      <div className={styles.settings}>
        {hasMounted && (
          <a
            className={styles.toggleDarkMode}
            href='#'
            role='button'
            onClick={onToggleDarkMode}
            title='Toggle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        )}
      </div>

      <div className={styles.social}>
        {config.twitter && (
          <a
            className={styles.twitter}
            href={`https://twitter.com/${config.twitter}`}
            title={`Twitter @${config.twitter}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTwitter />
          </a>
        )}

        {config.mastodon && (
          <a
            className={styles.mastodon}
            href={config.mastodon}
            title={`Mastodon ${config.getMastodonHandle()}`}
            rel='me'
          >
            <FaMastodon />
          </a>
        )}

        {config.instagram && (
          <a
            className={styles.instagram}
            href={`https://instagram.com/${config.instagram}`}
            title={`Instagram @${config.instagram}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaInstagram />
          </a>
        )}

        {config.facebook && (
          <a
            className={styles.facebook}
            href={`https://facebook.com/${config.facebook}`}
            title={`Facebook @${config.facebook}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaFacebook />
          </a>
        )}

        {config.zhihu && (
          <a
            className={styles.zhihu}
            href={`https://zhihu.com/people/${config.zhihu}`}
            title={`Zhihu @${config.zhihu}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaZhihu />
          </a>
        )}

        {config.github && (
          <a
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithub />
          </a>
        )}

        {config.linkedin && (
          <a
            className={styles.linkedin}
            href={`https://www.linkedin.com/in/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
          </a>
        )}

        {config.newsletter && (
          <a
            className={styles.newsletter}
            href={`${config.newsletter}`}
            title={`Newsletter ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaEnvelopeOpenText />
          </a>
        )}

        {config.youtube && (
          <a
            className={styles.youtube}
            href={`https://www.youtube.com/${config.youtube}`}
            title={`YouTube ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaYoutube />
          </a>
        )}
      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
</file>

<file path="GitHubShareButton.tsx">
import styles from './styles.module.css'

export function GitHubShareButton() {
  return (
    <a
      href='https://github.com/transitive-bullshit/nextjs-notion-starter-kit'
      target='_blank'
      rel='noopener noreferrer'
      className={styles.githubCorner}
      aria-label='View source on GitHub'
    >
      <svg
        width='80'
        height='80'
        viewBox='0 0 250 250'
        style={{
          fill: '#70B7FD',
          color: '#fff',
          position: 'absolute',
          zIndex: 1001,
          top: 0,
          right: 0,
          border: 0,
          transform: 'scale(1, 1)'
        }}
        aria-hidden='true'
      >
        <path d='M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z' />
        <path
          d='M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2'
          fill='currentColor'
          style={{
            transformOrigin: '130px 106px'
          }}
          className={styles.octoArm}
        />

        <path
          d='M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z'
          fill='currentColor'
          className={styles.octoBody}
        />
      </svg>
    </a>
  )
}
</file>

<file path="HamburgerMenu.module.css">
.hamburgerMenu {
  position: relative;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

/* デスクトップメニュー */
.desktopMenu {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  padding: 0 8px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox用 */
}

.desktopMenu::-webkit-scrollbar {
  display: none; /* Chrome, Safari用 */
}

.menuItem {
  padding: 8px 12px;
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  display: block;
}

.menuItem:hover {
  color: rgb(55, 53, 47);
}

.menuItem.active {
  color: rgb(55, 53, 47);
  border-bottom: 2px solid rgb(55, 53, 47);
  font-weight: 500;
}

/* ハンバーガーボタン */
.hamburgerButton {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.hamburgerIcon {
  width: 100%;
  height: 2px;
  background-color: rgb(55, 53, 47);
  transition: all 0.3s ease;
  position: relative;
  transform-origin: center;
}

.hamburgerButton.open .hamburgerIcon:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburgerButton.open .hamburgerIcon:nth-child(2) {
  opacity: 0;
}

.hamburgerButton.open .hamburgerIcon:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* モバイルメニュー */
.mobileMenu {
  display: none;
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 8px 0;
  min-width: 180px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.mobileMenu.open {
  display: block;
  max-height: 400px;
  overflow-y: auto;
}

.mobileMenu .menuItem {
  padding: 10px 16px;
  border-bottom: none;
  border-left: 2px solid transparent;
}

.mobileMenu .menuItem.active {
  border-bottom: none;
  border-left: 2px solid rgb(55, 53, 47);
}

/* レスポンシブ設定 */
@media (max-width: 768px) {
  .desktopMenu {
    display: none;
  }
  
  .hamburgerButton {
    display: flex;
  }
}

/* PCとタブレットでもハンバーガーメニューを表示するため、このメディアクエリは削除 */
</file>

<file path="HamburgerMenu.tsx">
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HamburgerMenu.module.css';

type MenuItem = {
  id: string;
  title: string;
  url: string;
  isActive?: boolean;
};

// 仮のメニュー項目（後でNotion DBから取得する内容に置き換え）
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'all', title: 'すべて', url: '/' },
  { id: 'blog', title: 'ブログ', url: '/blog' },
  { id: 'website', title: 'Webサイト', url: '/website' },
  { id: 'profile', title: 'プロフィール', url: '/profile' },
  { id: 'latest', title: '新着順', url: '/latest' }
];

type HamburgerMenuProps = {
  menuItems?: MenuItem[];
  currentPath?: string;
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  menuItems = DEFAULT_MENU_ITEMS,
  currentPath = '/'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // アクティブなメニュー項目を設定
  const items = menuItems.map(item => ({
    ...item,
    isActive: currentPath === item.url
  }));

  // ウィンドウサイズによるモバイル判定
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初期チェック
    checkIfMobile();

    // リサイズイベント
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // メニュー開閉の切り替え
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // モバイルメニューが開いているときにページ外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(`.${styles.hamburgerMenu}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className={styles.hamburgerMenu}>
      {isMobile ? (
        <>
          <button 
            className={`${styles.hamburgerButton} ${isOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="メニュー"
            aria-expanded={isOpen}
          >
            <span className={styles.hamburgerIcon}></span>
            <span className={styles.hamburgerIcon}></span>
            <span className={styles.hamburgerIcon}></span>
          </button>
          
          <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
            {items.map(item => (
              <Link 
                key={item.id} 
                href={item.url}
                className={`${styles.menuItem} ${item.isActive ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.desktopMenu}>
          {items.map(item => (
            <Link 
              key={item.id} 
              href={item.url}
              className={`${styles.menuItem} ${item.isActive ? styles.active : ''}`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default HamburgerMenu;
</file>

<file path="Header.module.css">
/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* ヘッダー高さ増加 */
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 9999; /* 最大のz-indexを設定して確実に最前面に表示 */
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
}

.headerScrolled {
  height: 50px; /* スクロール時のヘッダー高さ */
}

.darkHeader {
  background-color: rgba(47, 52, 55, 0.95);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.headerContent {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左・中央・右で均等配置 */
}

/* ヘッダー左側（ロゴ） */
.headerLeft {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  font-weight: 700;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.85;
}

.logoText {
  font-size: 1.3rem;
  background: linear-gradient(45deg, #605dec, #8b63fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* デスクトップナビゲーション - 現在は空の置き場所として使用 */
.desktopNav {
  flex: 1;
  height: 100%;
  margin: 0 auto;
}

.navList {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
}

.navItem {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.navLink {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  color: rgba(55, 53, 47, 0.75);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  white-space: nowrap;
}

.navLink:hover {
  color: rgba(55, 53, 47, 1);
}

.activeLink {
  color: #605dec;
  font-weight: 600;
  position: relative;
}

.activeLink::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(45deg, #605dec, #8b63fe);
  border-radius: 3px 3px 0 0;
}

.darkHeader .navLink {
  color: rgba(255, 255, 255, 0.75);
}

.darkHeader .navLink:hover,
.darkHeader .activeLink {
  color: #fff;
}

/* Header Right Side */
.headerRight {
  display: flex;
  align-items: center;
  z-index: 1100;
}

.iconButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 0.4rem;
  background: none;
  border: none;
  border-radius: 50%;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.iconButton:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transform: scale(1.05);
}

.darkHeader .iconButton:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Instagram Button */
.instagramButton:hover {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: scale(1.1);
}

/* Facebook Button */
.facebookButton:hover {
  color: #1877f2;
  transform: scale(1.1);
}

/* 検索オーバーレイ */
.searchOverlay {
  position: fixed;
  top: 60px; /* ヘッダーの高さに合わせる */
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 998;
  transition: all 0.3s ease;
}

.darkHeader + .searchOverlay {
  background-color: rgba(47, 52, 55, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.headerScrolled + .searchOverlay {
  top: 50px; /* スクロール時のヘッダー高さに合わせる */
}

.searchVisible {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.searchHidden {
  transform: translateY(-10px);
  opacity: 0;
  visibility: hidden;
}

.searchContainer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
}

/* 検索フォーム */
.searchForm {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.searchInput {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  transition: all 0.2s;
}

.searchInput:focus {
  outline: none;
  border-color: #605dec;
  box-shadow: 0 0 0 2px rgba(96, 93, 236, 0.2);
}

.searchButton {
  padding: 0.75rem 1.25rem;
  background: linear-gradient(45deg, #605dec, #8b63fe);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.searchButton:hover {
  background: linear-gradient(45deg, #5150cb, #7b54ef);
  transform: translateY(-1px);
}

.searchButton:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* 検索結果 */
.searchResults {
  margin-top: 1.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  max-height: 50vh;
  overflow-y: auto;
}

.searchResultsTitle {
  padding: 1rem 1.5rem;
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  background-color: rgba(245, 245, 250, 0.95);
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
}

.searchResultsList {
  list-style: none;
  margin: 0;
  padding: 0;
}

.searchResultItem {
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
}

.searchResultItem:last-child {
  border-bottom: none;
}

.searchResultLink {
  display: block;
  padding: 1rem 1.5rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s;
}

.searchResultLink:hover {
  background-color: rgba(96, 93, 236, 0.05);
}

.searchResultTitle {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.searchResultDescription {
  font-size: 0.9rem;
  color: rgba(55, 53, 47, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.noResults {
  text-align: center;
  padding: 2rem;
  color: rgba(55, 53, 47, 0.7);
  font-size: 1rem;
}

/* ダークモード */
.darkHeader + .searchOverlay .searchInput {
  background-color: rgba(66, 71, 74, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.darkHeader + .searchOverlay .searchInput:focus {
  border-color: #8b63fe;
  box-shadow: 0 0 0 2px rgba(139, 99, 254, 0.3);
}

.darkHeader + .searchOverlay .searchResults {
  background-color: rgba(47, 52, 55, 0.95);
}

.darkHeader + .searchOverlay .searchResultsTitle {
  background-color: rgba(40, 44, 47, 0.95);
  color: #f1f1f1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.darkHeader + .searchOverlay .searchResultItem {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.darkHeader + .searchOverlay .searchResultDescription {
  color: rgba(255, 255, 255, 0.7);
}

.darkHeader + .searchOverlay .searchResultLink:hover {
  background-color: rgba(139, 99, 254, 0.1);
}

.darkHeader + .searchOverlay .noResults {
  color: rgba(255, 255, 255, 0.7);
}

/* Mobile Menu Button */
.mobileMenuButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  z-index: 1010;
}

/* Hamburger Icon */
.hamburgerIcon {
  width: 20px;
  height: 16px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.4s ease-in-out;
}

.hamburgerIcon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: currentColor;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburgerIcon span:nth-child(1) {
  top: 0px;
}

.hamburgerIcon span:nth-child(2) {
  top: 7px;
}

.hamburgerIcon span:nth-child(3) {
  top: 14px;
}

.hamburgerIcon.open span:nth-child(1) {
  top: 7px;
  transform: rotate(135deg);
}

.hamburgerIcon.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburgerIcon.open span:nth-child(3) {
  top: 7px;
  transform: rotate(-135deg);
}

/* Mobile Menu */
.mobileMenu {
  position: fixed;
  top: 60px; /* ヘッダーの高さに合わせる */
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  z-index: 999;
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
}

.darkHeader + .mobileMenu {
  background-color: rgba(47, 52, 55, 0.98);
}

.headerScrolled + .mobileMenu {
  top: 50px; /* スクロール時のヘッダー高さに合わせる */
  height: calc(100vh - 50px);
}

.mobileMenuOpen {
  transform: translateX(0);
}

.mobileMenuClosed {
  transform: translateX(100%);
}

.mobileNav {
  padding: 1.5rem;
}

.mobileNavList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mobileNavItem {
  margin: 0.8rem 0;
  width: 100%;
  max-width: 280px;
  text-align: center;
}

.mobileNavLink {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  color: inherit;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s;
  border-radius: 8px;
}

/* メニュー項目のエモジ */
.menuItemEmoji {
  display: inline-block;
  margin-right: 8px;
  font-size: 1.2rem;
}

.mobileNavLink:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.darkHeader + .mobileMenu .mobileNavLink:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.activeMobileLink {
  font-weight: 700;
  color: #605dec;
  background-color: rgba(96, 93, 236, 0.08);
}

.darkHeader + .mobileMenu .activeMobileLink {
  color: #8b63fe;
  background-color: rgba(139, 99, 254, 0.1);
}

/* レスポンシブ調整 */
@media (max-width: 992px) {
  .navLink {
    padding: 0 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .header {
    height: 55px;
  }
  
  .headerScrolled {
    height: 45px;
  }
  
  .headerContent {
    padding: 0 1rem;
  }
  
  /* スマホサイズではデスクトップナビゲーションを非表示 */
  .desktopNav {
    display: none;
  }
  
  .searchOverlay {
    top: 55px;
  }
  
  .headerScrolled + .searchOverlay {
    top: 45px;
  }
  
  .mobileMenu {
    top: 55px;
    height: calc(100vh - 55px);
  }
  
  .headerScrolled + .mobileMenu {
    top: 45px;
    height: calc(100vh - 45px);
  }
}

@media (max-width: 480px) {
  .header {
    height: 50px;
  }
  
  .headerScrolled {
    height: 40px;
  }
  
  .logoText {
    font-size: 1.2rem;
  }
  
  .iconButton {
    width: 32px;
    height: 32px;
    margin-left: 0.3rem;
  }
  
  .mobileMenuButton {
    width: 32px;
    height: 32px;
  }
  
  .searchOverlay {
    top: 50px;
  }
  
  .headerScrolled + .searchOverlay {
    top: 40px;
  }
  
  .mobileMenu {
    top: 50px;
    height: calc(100vh - 50px);
  }
  
  .headerScrolled + .mobileMenu {
    top: 40px;
    height: calc(100vh - 40px);
  }
}
</file>

<file path="Header.tsx">
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import { IoSearchOutline } from '@react-icons/all-files/io5/IoSearchOutline'
import cs from 'classnames'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'
import styles from './Header.module.css'
import { MenuItem } from '@/lib/menu-utils'
import { notionViews } from '@/lib/notion-views'

// notionViewsからフォールバック用メニュー項目を生成
const DEFAULT_MENU_ITEMS: MenuItem[] = notionViews.map(view => ({
  id: view.id,
  title: view.name,
  url: view.path
}))

type HeaderProps = {
  menuItems?: MenuItem[]
}

export function HeaderImpl({ menuItems = DEFAULT_MENU_ITEMS }: HeaderProps) {
  // menuItemsがundefinedの場合はDEFAULT_MENU_ITEMSを使用する
  const items = menuItems?.length ? menuItems : DEFAULT_MENU_ITEMS;
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // マウント状態の確認
  useEffect(() => {
    setHasMounted(true)
    
    // 画面サイズのチェック
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // 初期チェック
    checkIsMobile()
    
    // リサイズイベントリスナーを設定
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  
  // 検索実行関数
  const handleSearch = async (e) => {
    e?.preventDefault()
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return
    }
    
    setIsSearching(true)
    
    try {
      console.log('検索リクエスト送信:', { query: searchQuery.trim() })
      
      // 公式Notion APIを使用した検索エンドポイントを使用する
      const response = await fetch('/api/direct-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: searchQuery.trim() })
      })
      
      if (!response.ok) {
        throw new Error(`検索リクエストに失敗しました: ${response.status}`)
      }
      
      const results = await response.json()
      console.log('検索結果の詳細:', results)
      console.log('検索結果の項目数:', results.results?.length || 0)
      console.log('検索結果の構造:', JSON.stringify(results, null, 2))
      
      // results.resultsが配列であることを確認
      const searchResultsArray = Array.isArray(results.results) ? results.results : []
      setSearchResults(searchResultsArray)
    } catch (error) {
      console.error('検索エラー:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }
  
  // Enterキーで検索実行
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  // スクロール検出用のイベントリスナー
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ダークモード切り替え
  const onToggleDarkMode = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  // 現在のページに基づいてアクティブなメニュー項目を判断
  const isActive = (url: string) => {
    if (url === '/' && router.pathname === '/') {
      return true
    }
    return router.pathname.startsWith(url) && url !== '/'
  }

  // メニューの開閉を切り替える
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    // メニューを開くときは検索を閉じる
    if (!menuOpen) {
      setIsSearchVisible(false)
    }
  }

  // 検索の表示/非表示を切り替える
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
    // 検索を開くときはメニューを閉じる
    if (!isSearchVisible) {
      setMenuOpen(false)
    }
  }

  // メニュー項目をクリックした時の処理
  const handleMenuItemClick = () => {
    // メニューを閉じる
    setMenuOpen(false)
  }

  // ロゴコンポーネント
  const Logo = () => (
    <Link href="/" className={styles.logo}>
      <span className={styles.logoText}>CafeKinesi</span>
    </Link>
  )

  return (
    <header 
      className={cs(
        styles.header, 
        scrolled && styles.headerScrolled,
        isDarkMode && styles.darkHeader
      )}
    >
      <div className={styles.headerContent}>
        {/* ロゴ */}
        <div className={styles.headerLeft}>
          <Logo />
        </div>

        {/* デスクトップ用ナビゲーション - メニュー項目はハンバーガーメニューにのみ表示 */}
        <div className={styles.desktopNav}>
          {/* ここは空にして、メニュー項目はハンバーガーメニューにのみ表示する */}
        </div>

        {/* ヘッダー右側の要素 */}
        <div className={styles.headerRight}>
          {/* 検索ボタン */}
          <button 
            className={styles.iconButton} 
            onClick={toggleSearch}
            aria-label={isSearchVisible ? '検索を閉じる' : '検索を開く'}
          >
            <IoSearchOutline size={22} />
          </button>

          {/* ダークモード切り替えボタン */}
          {hasMounted && (
            <button 
              className={styles.iconButton} 
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDarkMode ? <IoSunnyOutline size={22} /> : <IoMoonSharp size={22} />}
            </button>
          )}

          {/* SNSリンク */}
          {config.instagram && (
            <a
              href={`https://instagram.com/${config.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cs(styles.iconButton, styles.instagramButton)}
              aria-label="Instagramを見る"
            >
              <FaInstagram size={20} />
            </a>
          )}

          {config.facebook && (
            <a
              href={`https://facebook.com/${config.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cs(styles.iconButton, styles.facebookButton)}
              aria-label="Facebookを見る"
            >
              <FaFacebook size={20} />
            </a>
          )}

          {/* ハンバーガーメニューボタン（常に表示） */}
          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleMenu}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={menuOpen}
          >
            <div className={`${styles.hamburgerIcon} ${menuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* 検索オーバーレイ */}
      <div className={cs(
        styles.searchOverlay,
        isSearchVisible ? styles.searchVisible : styles.searchHidden
      )}>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="検索..."
              aria-label="検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? '検索中...' : '検索'}
            </button>
          </form>
          
          {/* 検索結果 */}
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <h3 className={styles.searchResultsTitle}>検索結果 ({searchResults.length}件)</h3>
              <ul className={styles.searchResultsList}>
                {searchResults.map((result: any) => {
                  console.log('検索結果レンダリング:', result);
                  
                  // Notion APIの結果からデータを抽出
                  const id = result.id;
                  if (!id) {
                    console.warn('検索結果にIDがありません:', result);
                    return null;
                  }
                  
                  // 公式APIのページオブジェクトからタイトルを取得する
                  let title = '';
                  let description = '';
                  
                  // 公式APIの構造の場合
                  if (result.object === 'page') {
                    // ページのタイトル取得試行
                    if (result.properties && result.properties.title) {
                      const titleProp = result.properties.title;
                      if (titleProp.title && Array.isArray(titleProp.title)) {
                        title = titleProp.title.map(t => t.plain_text || '').join('');
                      }
                    }
                    // ページの親がデータベースの場合
                    else if (result.parent && result.parent.database_id) {
                      // このページには他の方法でタイトルを取得する必要がある
                      title = '無題のページ'; // デフォルト
                    }
                  } 
                  // 旧APIや他の形式の互換性
                  else {
                    if (result.properties?.title) {
                      const titleProp = result.properties.title;
                      if (Array.isArray(titleProp)) {
                        title = titleProp.map((t: any) => t[0]).join('');
                      } else if (titleProp.title) {
                        title = titleProp.title.map((t: any) => t.plain_text).join('');
                      }
                    } else if (result.title) {
                      if (Array.isArray(result.title)) {
                        title = result.title.map((t: any) => t[0]).join('');
                      } else {
                        title = result.title;
                      }
                    }
                  }
                  
                  // 最終的にタイトルの安全確保
                  if (!title || title.trim() === '') {
                    title = 'Notionページ';
                  }
                  
                  // 結果と一緒に提供されるURLを使用する
                  const url = result.url || `/${id}`;
                  
                  return (
                    <li key={id} className={styles.searchResultItem}>
                      <a 
                        href={url} 
                        className={styles.searchResultLink}
                        onClick={() => {
                          setIsSearchVisible(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className={styles.searchResultTitle}>
                          {title}
                        </div>
                        {description && (
                          <div className={styles.searchResultDescription}>
                            {description}
                          </div>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {/* 検索結果がない場合のメッセージ */}
          {searchQuery.trim().length > 1 && searchResults.length === 0 && !isSearching && (
            <div className={styles.noResults}>
              検索結果が見つかりませんでした
            </div>
          )}
        </div>
      </div>

      {/* モバイルメニュー（常に表示） */}
      <div className={cs(
        styles.mobileMenu,
        menuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed
      )}>
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            {items.map((item) => (
              <li key={item.id} className={styles.mobileNavItem}>
                <Link 
                  href={item.url} 
                  className={cs(
                    styles.mobileNavLink,
                    isActive(item.url) && styles.activeMobileLink
                  )}
                  onClick={handleMenuItemClick}
                >
                  {item.emoji && (
                    <span className={styles.menuItemEmoji}>{item.emoji}</span>
                  )}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export const Header = React.memo(HeaderImpl)
</file>

<file path="HeaderMenu.module.css">
.headerNav {
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  z-index: 1000;
}

/* デスクトップメニュー */
.desktopMenu {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.menuList {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menuItem {
  margin-right: 1.5rem;
}

.menuLink {
  display: block;
  padding: 0.5rem 0;
  color: rgba(55, 53, 47, 0.65);
  text-decoration: none;
  font-size: 14px;
  position: relative;
  transition: color 0.2s ease;
}

.menuLink:hover {
  color: rgb(55, 53, 47);
}

.menuLink.active {
  color: rgb(55, 53, 47);
  font-weight: 500;
}

.menuLink.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgb(55, 53, 47);
}

/* モバイルメニュー */
.hamburgerButton {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburgerIcon {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
}

.hamburgerIcon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: rgba(55, 53, 47, 0.85);
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburgerIcon span:nth-child(1) {
  top: 0px;
}

.hamburgerIcon span:nth-child(2) {
  top: 8px;
}

.hamburgerIcon span:nth-child(3) {
  top: 16px;
}

.hamburgerIcon.open span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.hamburgerIcon.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburgerIcon.open span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}

.mobileMenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.mobileMenu.open {
  display: block;
}

.mobileMenu .menuList {
  flex-direction: column;
  padding: 0 1.5rem;
}

.mobileMenu .menuItem {
  margin-right: 0;
  margin-bottom: 0.5rem;
}

.mobileMenu .menuLink {
  padding: 0.75rem 0;
}

/* メディアクエリ */
@media (max-width: 768px) {
  .desktopMenu {
    display: none;
  }
  
  .mobileMenu.open {
    display: block;
  }
  
  .menuLink.active::after {
    display: none;
  }
  
  .menuLink.active {
    color: rgb(55, 53, 47);
    font-weight: 500;
  }
}
</file>

<file path="HeaderMenu.tsx">
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './HeaderMenu.module.css'

type MenuItem = {
  id: string
  title: string
  url: string
}

type HeaderMenuProps = {
  menuItems: MenuItem[]
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ menuItems }) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 現在のページに基づいてアクティブなメニュー項目を判断
  const isActive = (url: string) => {
    if (url === '/' && router.pathname === '/') {
      return true
    }
    return router.pathname.startsWith(url) && url !== '/'
  }

  // ウィンドウサイズの変更を監視してモバイル表示を判断
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // 初期チェック
    checkIsMobile()
    
    // リサイズイベントリスナーを設定
    window.addEventListener('resize', checkIsMobile)
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // メニューの開閉を切り替える
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // メニュー項目をクリックした時の処理
  const handleMenuItemClick = () => {
    // モバイル表示の場合はメニューを閉じる
    if (isMobile) {
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className={styles.headerNav}>
      {/* モバイル用ハンバーガーボタン */}
      {isMobile && (
        <button 
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-label="メニューを開く"
          aria-expanded={isMenuOpen}
        >
          <div className={`${styles.hamburgerIcon} ${isMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      {/* デスクトップメニューまたはモバイルオープン時のメニュー */}
      <div className={`
        ${styles.menuContainer}
        ${isMobile ? styles.mobileMenu : styles.desktopMenu}
        ${isMobile && isMenuOpen ? styles.open : ''}
      `}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <Link 
                href={item.url}
                className={`${styles.menuLink} ${isActive(item.url) ? styles.active : ''}`}
                onClick={handleMenuItemClick}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default HeaderMenu
</file>

<file path="Loading.tsx">
import { LoadingIcon } from './LoadingIcon'
import styles from './styles.module.css'

export function Loading() {
  return (
    <div className={styles.container}>
      <LoadingIcon />
    </div>
  )
}
</file>

<file path="LoadingIcon.tsx">
import cs from 'classnames'

import styles from './styles.module.css'

export function LoadingIcon(props: any) {
  const { className, ...rest } = props
  return (
    <svg
      className={cs(styles.loadingIcon, className)}
      {...rest}
      viewBox='0 0 24 24'
    >
      <defs>
        <linearGradient
          x1='28.1542969%'
          y1='63.7402344%'
          x2='74.6289062%'
          y2='17.7832031%'
          id='linearGradient-1'
        >
          <stop stopColor='rgba(164, 164, 164, 1)' offset='0%' />
          <stop
            stopColor='rgba(164, 164, 164, 0)'
            stopOpacity='0'
            offset='100%'
          />
        </linearGradient>
      </defs>

      <g id='Page-1' stroke='none' strokeWidth='1' fill='none'>
        <g transform='translate(-236.000000, -286.000000)'>
          <g transform='translate(238.000000, 286.000000)'>
            <circle
              id='Oval-2'
              stroke='url(#linearGradient-1)'
              strokeWidth='4'
              cx='10'
              cy='12'
              r='10'
            />
            <path
              d='M10,2 C4.4771525,2 0,6.4771525 0,12'
              id='Oval-2'
              stroke='rgba(164, 164, 164, 1)'
              strokeWidth='4'
            />
            <rect
              id='Rectangle-1'
              fill='rgba(164, 164, 164, 1)'
              x='8'
              y='0'
              width='4'
              height='4'
              rx='8'
            />
          </g>
        </g>
      </g>
    </svg>
  )
}
</file>

<file path="NotionPage.tsx">
import cs from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type PageBlock } from 'notion-types'
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'
import {
  type NotionComponents,
  NotionRenderer,
  useNotionContext
} from 'react-notion-x'
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet'
import { useSearchParam } from 'react-use'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'

import { Footer } from './Footer'
import { GitHubShareButton } from './GitHubShareButton'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import { Header } from './Header'
import styles from './styles.module.css'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

// コードブロックコンポーネント - 改良版
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      // 必須の基本言語
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      
      // 人気のある言語
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-javascript.js'),
      import('prismjs/components/prism-typescript.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-css.js'),
      import('prismjs/components/prism-go.js'),
      import('prismjs/components/prism-rust.js'),
      import('prismjs/components/prism-jsx.js'),
      import('prismjs/components/prism-tsx.js'),
      import('prismjs/components/prism-yaml.js'),
      import('prismjs/components/prism-json.js'),
      import('prismjs/components/prism-markdown.js'),
      import('prismjs/components/prism-sql.js'),
      
      // その他の言語も含める
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-cpp.js'),
      import('prismjs/components/prism-csharp.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-coffeescript.js'),
      import('prismjs/components/prism-diff.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-less.js'),
      import('prismjs/components/prism-makefile.js'),
      import('prismjs/components/prism-objectivec.js'),
      import('prismjs/components/prism-ocaml.js'),
      import('prismjs/components/prism-reason.js'),
      import('prismjs/components/prism-sass.js'),
      import('prismjs/components/prism-scss.js'),
      import('prismjs/components/prism-solidity.js'),
      import('prismjs/components/prism-stylus.js'),
      import('prismjs/components/prism-swift.js'),
      import('prismjs/components/prism-wasm.js'),
      
      // HTMLテンプレート言語
      import('prismjs/components/prism-ejs.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-pug.js')
    ])
    return m.Code
  })
)

// データベースビューコンポーネント
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)

// 数式コンポーネント
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)

// PDFビューアーコンポーネント - SSRを無効化
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)

// モーダルコンポーネント - SSRを無効化
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

function Tweet({ id }: { id: string }) {
  const { recordMap } = useNotionContext()
  const tweet = (recordMap as types.ExtendedTweetRecordMap)?.tweets?.[id]

  return (
    <React.Suspense fallback={<TweetSkeleton />}>
      {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
    </React.Suspense>
  )
}

const propertyLastEditedTimeValue = (
  { block, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = (
  { data, schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = (
  { schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

// ナビゲーションメニュー項目
const getNavigationMenuItems = (site: types.Site) => {
  // デフォルトのメニュー項目
  const defaultMenuItems = [
    {
      id: 'home',
      title: 'ホーム',
      url: '/'
    }
  ]
  
  return defaultMenuItems
}

export function NotionPage({
  site,
  recordMap,
  error,
  pageId,
  menuItems // Notionデータベースからのメニューアイテムを受け取る
}: types.PageProps & { menuItems?: any[] }) {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const components = React.useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      // Notionのデフォルトヘッダーをカスタムヘッダーとして使わない
      Header: () => null, // ヘッダーを非表示にする
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue
    }),
    []
  )

  // ボディにNoNotionTabsクラスを追加
  React.useEffect(() => {
    document.body.classList.add('no-notion-tabs');
    
    return () => {
      document.body.classList.remove('no-notion-tabs');
    };
  }, []);

  // ナビゲーションメニュー項目を取得
  const navigationMenuItems = React.useMemo(() => 
    site ? getNavigationMenuItems(site) : [], [site]
  )

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const { isDarkMode } = useDarkMode()

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const pageAside = React.useMemo(
    () => (
      <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />
    ),
    [block, recordMap, isBlogPost]
  )

  const footer = React.useMemo(() => <Footer />, [])

  if (router.isFallback) {
    return <Loading />
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  console.log('notion page', {
    isDev: config.isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap
  })

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      {isLiteMode && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />}
      <BodyClassName className='no-notion-tabs' />

      {/* Notionレンダラー - 内部のヘッダーをnullに設定したので、カスタムヘッダーを外に配置 */}
      <Header menuItems={(menuItems && menuItems.length > 0) ? menuItems : navigationMenuItems} />

      <div className={styles.notionPageContainer}>
        <NotionRenderer
          bodyClassName={cs(
            styles.notion,
            'no-notion-tabs',
            pageId === site.rootNotionPageId && 'index-page'
          )}
          darkMode={isDarkMode}
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={!isLiteMode}
          previewImages={!!recordMap.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
          defaultPageIcon={config.defaultPageIcon}
          defaultPageCover={config.defaultPageCover}
          defaultPageCoverPosition={config.defaultPageCoverPosition}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          searchNotion={config.isSearchEnabled ? searchNotion : null}
          pageAside={pageAside}
          footer={footer}
          className="no-notion-tabs"
        />
      </div>

      <GitHubShareButton />
    </>
  )
}
</file>

<file path="NotionPageHeader.tsx">
import type * as types from 'notion-types'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import cs from 'classnames'
import * as React from 'react'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

function ToggleThemeButton() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  )
}

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
</file>

<file path="NotionPageWithMenu.module.css">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.menuContainer {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
}

.pageContainer {
  flex: 1;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .menuContainer {
    padding: 10px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</file>

<file path="NotionPageWithMenu.tsx">
import React from 'react';
import { useRouter } from 'next/router';
import { NotionPage } from './NotionPage';
import HamburgerMenu from './HamburgerMenu';
import styles from './NotionPageWithMenu.module.css';

type NotionPageWithMenuProps = {
  [key: string]: any; // NotionPageに渡すpropsの型
};

const NotionPageWithMenu: React.FC<NotionPageWithMenuProps> = (props) => {
  const router = useRouter();
  const currentPath = router.asPath;
  
  return (
    <div className={styles.container}>
      <div className={styles.menuContainer}>
        <HamburgerMenu currentPath={currentPath} />
      </div>
      
      <div className={styles.pageContainer}>
        <NotionPage {...props} />
      </div>
    </div>
  );
};

export default NotionPageWithMenu;
</file>

<file path="NotionViewTabs.module.css">
.notionViewTabs {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}

/* これは最小限のスタイルで、実際のスタイルは使用しないため */
</file>

<file path="NotionViewTabs.tsx">
import React from 'react';
import Link from 'next/link';

// タブのインターフェース定義
export interface ViewTab {
  id: string;
  name: string;
  path: string;
  pageId: string;
}

interface NotionViewTabsProps {
  tabs?: ViewTab[];
  activeTab?: string;
}

const NotionViewTabs: React.FC<NotionViewTabsProps> = ({ 
  tabs = [], 
  activeTab = 'all'
}) => {
  return (
    <div className="notion-view-tabs">
      {/* タブのコンテンツ（このコンポーネントは実際には使用しないため最小限に） */}
    </div>
  );
};

export default NotionViewTabs;
</file>

<file path="Page404.tsx">
import type * as types from '@/lib/types'

import { PageHead } from './PageHead'
import styles from './styles.module.css'

export function Page404({ site, pageId, error }: types.PageProps) {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Notion Page Not Found</h1>

          {error ? (
            <p>{error.message}</p>
          ) : (
            pageId && (
              <p>
                Make sure that Notion page &quot;{pageId}&quot; is publicly
                accessible.
              </p>
            )
          )}

          <img
            src='/404.png'
            alt='404 Not Found'
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  )
}
</file>

<file path="PageActions.tsx">
import { AiOutlineRetweet } from '@react-icons/all-files/ai/AiOutlineRetweet'
import { IoHeartOutline } from '@react-icons/all-files/io5/IoHeartOutline'

import styles from './styles.module.css'

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */
export function PageActions({ tweet }: { tweet: string }) {
  return (
    <div className={styles.pageActions}>
      <a
        className={styles.likeTweet}
        href={`https://twitter.com/intent/like?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        title='Like this post on Twitter'
      >
        <IoHeartOutline />
      </a>

      <a
        className={styles.retweet}
        href={`https://twitter.com/intent/retweet?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        title='Retweet this post on Twitter'
      >
        <AiOutlineRetweet />
      </a>
    </div>
  )
}
</file>

<file path="PageAside.tsx">
import { type Block, type ExtendedRecordMap } from 'notion-types'

import { getPageTweet } from '@/lib/get-page-tweet'

import { PageActions } from './PageActions'
import { PageSocial } from './PageSocial'

export function PageAside({
  block,
  recordMap,
  isBlogPost
}: {
  block: Block
  recordMap: ExtendedRecordMap
  isBlogPost: boolean
}) {
  if (!block) {
    return null
  }

  // only display comments and page actions on blog post pages
  if (isBlogPost) {
    const tweet = getPageTweet(block, recordMap)
    if (!tweet) {
      return null
    }

    return <PageActions tweet={tweet} />
  }

  return <PageSocial />
}
</file>

<file path="PageHead.tsx">
import Head from 'next/head'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { getSocialImageUrl } from '@/lib/get-social-image-url'

export function PageHead({
  site,
  title,
  description,
  pageId,
  image,
  url
}: types.PageProps & {
  title?: string
  description?: string
  image?: string
  url?: string
}) {
  const rssFeedUrl = `${config.host}/feed`

  title = title ?? site?.name
  description = description ?? site?.description

  const socialImageUrl = getSocialImageUrl(pageId) || image

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
      />

      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='black' />

      <meta
        name='theme-color'
        media='(prefers-color-scheme: light)'
        content='#fefffe'
        key='theme-color-light'
      />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: dark)'
        content='#2d3439'
        key='theme-color-dark'
      />

      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      {site && (
        <>
          <meta property='og:site_name' content={site.name} />
          <meta property='twitter:domain' content={site.domain} />
        </>
      )}

      {config.twitter && (
        <meta name='twitter:creator' content={`@${config.twitter}`} />
      )}

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {socialImageUrl ? (
        <>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image' content={socialImageUrl} />
          <meta property='og:image' content={socialImageUrl} />
        </>
      ) : (
        <meta name='twitter:card' content='summary' />
      )}

      {url && (
        <>
          <link rel='canonical' href={url} />
          <meta property='og:url' content={url} />
          <meta property='twitter:url' content={url} />
        </>
      )}

      <link
        rel='alternate'
        type='application/rss+xml'
        href={rssFeedUrl}
        title={site?.name}
      />

      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>
    </Head>
  )
}
</file>

<file path="PageSocial.module.css">
.pageSocial {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--fg-color);
}

.action {
  position: relative;
  border-radius: 50%;
  border: 2px solid var(--fg-color-6);
  transition: all 300ms ease-out;
  width: 3.5em;
  height: 3.5em;
  margin: 0 0 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none !important;
  user-select: none;
  cursor: pointer;
}

.action:last-child {
  margin-bottom: 0;
}

.actionBg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.actionBg svg {
  width: 50%;
  height: 50%;
  fill: var(--fg-color-6);
}

.actionBgPane {
  transition: all 300ms ease-out;
  border-radius: 50%;
  width: 0;
  height: 0;
}

.action:hover {
  transition: all 100ms ease-out;
}

.action:hover .actionBgPane {
  width: 100%;
  height: 100%;
  transition: all 100ms ease-out;
}

.action:hover svg {
  transition: fill 100ms ease-out;
  fill: var(--bg-color);
}

:global(.dark-mode) .action:hover svg {
  fill: var(--fg-color);
}

.facebook .actionBgPane {
  background: #3b5998;
}
.facebook:hover {
  border-color: #3b5998;
}

.twitter .actionBgPane {
  background: #2795e9;
}
.twitter:hover {
  border-color: #2795e9;
}

.linkedin .actionBgPane {
  background: #0077b5;
}
.linkedin:hover {
  border-color: #0077b5;
}

.github .actionBgPane {
  background: #c9510c;
}
.github:hover {
  border-color: #c9510c;
}

.youtube .actionBgPane {
  background: #ff0000;
}
.youtube:hover {
  border-color: #ff0000;
}

.medium .actionBgPane {
  background: #00ab6c;
}
.medium:hover {
  border-color: #00ab6c;
}

.newsletter .actionBgPane {
  background: #777777;
}
.newsletter:hover {
  border-color: #777777;
}

.instagram .actionBgPane {
  background: #e1306c;
}
.instagram:hover {
  border-color: #e1306c;
}

.email .actionBgPane {
  background: #777;
}
.email:hover {
  border-color: #777;
}

@media only screen and (max-width: 768px) {
  .links {
    position: relative;
    left: 0.5em;
    flex-wrap: wrap;
  }

  .action:last-child {
    margin-right: 1em;
  }
}
</file>

<file path="PageSocial.tsx">
import type * as React from 'react'
import cs from 'classnames'

import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'

import * as config from '@/lib/config'

import styles from './PageSocial.module.css'

interface SocialLink {
  name: string
  title: string
  icon: React.ReactNode
  href?: string
}

const socialLinks: SocialLink[] = [
  config.twitter && {
    name: 'twitter',
    href: `https://twitter.com/${config.twitter}`,
    title: `Twitter @${config.twitter}`,
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z' />
      </svg>
    )
  },

  config.github && {
    name: 'github',
    href: `https://github.com/${config.github}`,
    title: `GitHub @${config.github}`,
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'></path>
      </svg>
    )
  },

  config.linkedin && {
    name: 'linkedin',
    href: `https://www.linkedin.com/in/${config.linkedin}`,
    title: `LinkedIn ${config.author}`,
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z' />
      </svg>
    )
  },

  config.instagram && {
    name: 'instagram',
    href: `https://instagram.com/${config.instagram}`,
    title: `Instagram @${config.instagram}`,
    icon: <FaInstagram />
  },

  config.facebook && {
    name: 'facebook',
    href: `https://facebook.com/${config.facebook}`,
    title: `Facebook @${config.facebook}`,
    icon: <FaFacebook />
  },

  config.newsletter && {
    name: 'newsletter',
    href: `${config.newsletter}`,
    title: `Newsletter ${config.author}`,
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M12 .64L8.23 3H5V5L2.97 6.29C2.39 6.64 2 7.27 2 8V18C2 19.11 2.9 20 4 20H20C21.11 20 22 19.11 22 18V8C22 7.27 21.61 6.64 21.03 6.29L19 5V3H15.77M7 5H17V9.88L12 13L7 9.88M8 6V7.5H16V6M5 7.38V8.63L4 8M19 7.38L20 8L19 8.63M8 8.5V10H16V8.5Z' />
      </svg>
    )
  },

  config.youtube && {
    name: 'youtube',
    href: `https://www.youtube.com/${config.youtube}`,
    title: `YouTube ${config.youtube}`,
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z' />
      </svg>
    )
  }
].filter(Boolean)

export function PageSocial() {
  return (
    <div className={styles.pageSocial}>
      {socialLinks.map((action) => (
        <a
          className={cs(styles.action, styles[action.name], action.name)}
          href={action.href}
          key={action.name}
          title={action.title}
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className={styles.actionBg}>
            <div className={`${styles.actionBgPane} bgPane`} />
          </div>

          <div className={styles.actionBg}>{action.icon}</div>
        </a>
      ))}
    </div>
  )
}
</file>

<file path="SimplifiedSearch.module.css">
/* SimplifiedSearch.module.css */
.searchOverlay {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  z-index: 999;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.visible {
  opacity: 1;
  visibility: visible;
}

.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.searchContainer {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.searchHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.searchTitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  margin: 0;
  color: #333;
}

.closeButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.closeButton:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.searchInputContainer {
  margin-bottom: 1.5rem;
}

.searchInput {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.2s;
}

.searchInput:focus {
  outline: none;
  border-color: #605dec;
  box-shadow: 0 0 0 2px rgba(96, 93, 236, 0.2);
}

.categorySelector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.categoryButton {
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.categoryButton:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.activeCategory {
  background-color: #605dec;
  color: white;
}

.activeCategory:hover {
  background-color: #4e4acd;
}

.resultsContainer {
  max-height: 50vh;
  overflow-y: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1rem;
}

.resultsList {
  list-style: none;
  margin: 0;
  padding: 0;
}

.resultItem {
  margin-bottom: 0.5rem;
}

.resultLink {
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.2s;
}

.resultLink:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.resultTitle {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.resultCategory {
  font-size: 0.85rem;
  color: #777;
}

.noResults {
  padding: 2rem;
  text-align: center;
  color: #777;
  font-style: italic;
}

/* ダークモード対応 */
:global(.dark-mode) .searchOverlay {
  background-color: rgba(47, 52, 55, 0.98);
  color: #f1f1f1;
}

:global(.dark-mode) .searchContainer {
  background-color: #2f3437;
}

:global(.dark-mode) .searchTitle {
  color: #f1f1f1;
}

:global(.dark-mode) .searchInput {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f1f1f1;
}

:global(.dark-mode) .searchInput:focus {
  border-color: #8b63fe;
  box-shadow: 0 0 0 2px rgba(139, 99, 254, 0.3);
}

:global(.dark-mode) .closeButton {
  color: #aaa;
}

:global(.dark-mode) .closeButton:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #f1f1f1;
}

:global(.dark-mode) .categoryButton {
  background-color: rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .categoryButton:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

:global(.dark-mode) .activeCategory {
  background-color: #8b63fe;
}

:global(.dark-mode) .activeCategory:hover {
  background-color: #7a52ef;
}

:global(.dark-mode) .resultsContainer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .resultLink {
  background-color: rgba(255, 255, 255, 0.05);
}

:global(.dark-mode) .resultLink:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .resultCategory {
  color: #aaa;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .searchContainer {
    margin: 1rem;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .searchTitle {
    font-size: 1.2rem;
  }
  
  .categoryButton {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</file>

<file path="SimplifiedSearch.tsx">
// SimplifiedSearch.tsx - 簡易検索ナビゲーション
import React, { useState } from 'react';
import Link from 'next/link';
import { IoSearchOutline } from '@react-icons/all-files/io5/IoSearchOutline';
import { IoClose } from '@react-icons/all-files/io5/IoClose';
import cs from 'classnames';

import styles from './SimplifiedSearch.module.css';

// サイト内のページデータ（静的に設定）
const SITE_PAGES = [
  { id: '1ceb802cb0c680f29369dba86095fb38', title: 'ホーム', category: 'メインページ' },
  // カテゴリはここを修正して更新してください
  { id: 'page1', title: 'コーヒーの淹れ方', category: 'コーヒー' },
  { id: 'page2', title: 'エスプレッソの基礎', category: 'コーヒー' },
  { id: 'page3', title: 'おすすめコーヒー豆', category: 'コーヒー' },
  { id: 'page4', title: 'キネシオロジーとは', category: '健康' },
  { id: 'page5', title: '筋反射テスト', category: '健康' },
  { id: 'page6', title: 'セルフヒーリング', category: '健康' },
  { id: 'page7', title: 'カフェメニュー', category: 'カフェ' },
  { id: 'page8', title: '営業時間', category: 'カフェ' },
  { id: 'page9', title: 'アクセス', category: 'カフェ' },
];

// カテゴリーリスト（重複なし）
const CATEGORIES = [...new Set(SITE_PAGES.map(page => page.category))];

interface SimplifiedSearchProps {
  isVisible: boolean;
  onClose: () => void;
}

const SimplifiedSearch: React.FC<SimplifiedSearchProps> = ({ isVisible, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 検索テキストとカテゴリでフィルター
  const filteredPages = SITE_PAGES.filter(page => {
    // カテゴリーフィルター
    if (selectedCategory && page.category !== selectedCategory) {
      return false;
    }
    
    // テキストフィルター（空の場合はすべて表示）
    if (!searchText) return true;
    
    // タイトルに検索テキストが含まれるかどうか
    return page.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className={cs(
      styles.searchOverlay,
      isVisible ? styles.visible : styles.hidden
    )}>
      <div className={styles.searchContainer}>
        <div className={styles.searchHeader}>
          <h2 className={styles.searchTitle}>
            <IoSearchOutline size={20} /> ページ検索
          </h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="検索を閉じる"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="検索..."
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        
        <div className={styles.categorySelector}>
          <button
            className={cs(
              styles.categoryButton,
              selectedCategory === null && styles.activeCategory
            )}
            onClick={() => setSelectedCategory(null)}
          >
            すべて
          </button>
          
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={cs(
                styles.categoryButton,
                selectedCategory === category && styles.activeCategory
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className={styles.resultsContainer}>
          {filteredPages.length > 0 ? (
            <ul className={styles.resultsList}>
              {filteredPages.map(page => (
                <li key={page.id} className={styles.resultItem}>
                  <Link
                    href={`/${page.id}`}
                    className={styles.resultLink}
                    onClick={onClose}
                  >
                    <div className={styles.resultTitle}>{page.title}</div>
                    <div className={styles.resultCategory}>{page.category}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noResults}>
              検索結果が見つかりませんでした
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedSearch;
</file>

<file path="styles.module.css">
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vmin;

  font-size: 16px;
  line-height: 1.5;
  color: rgb(55, 53, 47);
  caret-color: rgb(55, 53, 47);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: var(--bg-color);
}

/* ヘッダーがfixedなのでコンテンツにMarginを追加 */
.notionPageContainer {
  margin-top: 60px; /* ヘッダーの高さに合わせる */
  min-height: calc(100vh - 60px);
}

/* モバイル対応 */
@media (max-width: 768px) {
  .notionPageContainer {
    margin-top: 55px;
    min-height: calc(100vh - 55px);
  }
}

@media (max-width: 480px) {
  .notionPageContainer {
    margin-top: 50px;
    min-height: calc(100vh - 50px);
  }
}

.loadingIcon {
  animation: spinner 0.6s linear infinite;
  display: block;
  width: 24px;
  height: 24px;
  color: rgba(55, 53, 47, 0.4);
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.errorImage {
  max-width: 100%;
  width: 640px;
}

.footer {
  width: 100%;
  max-width: 1100px;
  margin: auto auto 0;
  padding: 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 80%;
  padding: 0.5em;
}

.settings,
.social {
  user-select: none;
}

.settings a,
.social a {
  cursor: pointer;
  font-size: 2em;
  display: inline-flex;
  padding: 0.25em;
  margin-right: 1vw;
  transition: color 250ms ease-out;
}

.settings a:last-of-type,
.social a:last-of-type {
  margin-right: 0;
}

.settings a:hover,
.social a:hover {
  transition: color 50ms ease-out;
}

.toggleDarkMode:hover {
  color: #2795e9;
}

.twitter:hover {
  color: #2795e9;
}

.mastodon:hover {
  color: #5a4be1;
}

.zhihu:hover {
  color: #0066ff;
}

.github:hover {
  color: #c9510c;
}

.youtube:hover {
  color: #ff0000;
}

.linkedin:hover {
  color: #0077b5;
}

.newsletter:hover {
  color: #777777;
}

.comments {
  width: 100%;
  margin-top: 2em;
  border-top: 1px solid var(--fg-color-0);
}

@media only screen and (max-width: 566px) {
  .footer {
    flex-direction: column;
  }

  .footer>div {
    margin-top: 1em;
  }

  .footer .settings {
    order: 1;
  }

  .footer .social {
    order: 2;
  }

  .footer .copyright {
    order: 3;
  }
}

.pageActions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 6px 12px 12px;
}

.pageActions a {
  cursor: pointer;
  font-size: 24px;
  display: inline-flex;
  padding: 12px;
  margin-right: 1vw;
  border-radius: 50%;
  background: transparent;
  transition: all 250ms ease-out;
}

.pageActions a:last-of-type {
  margin-right: 0;
}

.pageActions a:hover {
  transition: all 50ms ease-out;
}

.likeTweet:hover {
  background: #f6e3e8;
  color: #e0265e;
}

.retweet:hover {
  color: #19bf64;
  background: #e5f2e8;
}

@media (max-width: 1360px) {
  .githubCorner {
    display: none;
  }
}

.githubCorner:hover .octoArm {
  animation: octocat-wave 560ms ease-in-out;
}

@keyframes octocat-wave {

  0%,
  100% {
    transform: rotate(0);
  }

  20%,
  60% {
    transform: rotate(-25deg);
  }

  40%,
  80% {
    transform: rotate(10deg);
  }
}

@media (max-width: 500px) {
  .githubCorner:hover .octoArm {
    animation: none;
  }

  .githubCorner .octoArm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

.hidden {
  visibility: hidden;
}


/* ========================================== */
/* ✅ PageSocial（右側縦並び）のスタイル限定 */
/* ========================================== */

/* 汎用クラスに対応したスタイル（クラス名が変わっても効く！） */

/* Instagram */
a.instagram:hover .bgPane {
  background-color: #e4405f;
}
a.instagram:hover {
  color: white;
}

/* Facebook */
a.facebook:hover .bgPane {
  background-color: #3b5998;
}
a.facebook:hover {
  color: white;
}



/* ========================================== */
/* ✅ Footer（下部）のスタイル限定 */
/* ========================================== */

/* Instagram（下部） */
.social .instagram:hover {
  color: #e4405f;
}
.social a.instagram svg {
  fill: currentColor;
}

/* Facebook（下部） */
.social .facebook:hover {
  color: #3b5998;
}
.social a.facebook svg {
  fill: currentColor;
}
</file>

<file path="WhatsNewStyling.tsx">
import { useEffect } from 'react';

/**
 * What's Newセクションのスタイリングを行うためのユーティリティコンポーネント
 * Notionページレンダリング後にDOMにアクセスして特定の要素にクラスを追加します
 */
const WhatsNewStyling = () => {
  useEffect(() => {
    // ページのレンダリング後に実行
    const applyWhatsNewStyling = () => {
      try {
        // What's Newセクションのタイトルを探す（タイトルがWhat's Newとなっているコレクションを探す）
        const collectionTitles = document.querySelectorAll('.notion-collection-header-title');
        
        collectionTitles.forEach((titleElement) => {
          if (titleElement.textContent?.includes("What") && titleElement.textContent?.includes("New")) {
            // What's Newセクションを特定
            console.log('Found What\'s New section, applying styles...');
            
            // 親のコレクション要素を取得
            const collectionElement = titleElement.closest('.notion-collection');
            
            if (collectionElement) {
              // カスタムクラスを追加
              collectionElement.classList.add('whats-new-collection');
              
              // カード内のタイトル要素を小さくする
              const cardTitles = collectionElement.querySelectorAll('.notion-collection-card-property-title');
              cardTitles.forEach(title => {
                title.classList.add('whats-new-title');
              });
              
              // カテゴリプロパティのスタイリング（select系のプロパティ）
              const categoryProps = collectionElement.querySelectorAll('.notion-property-select');
              categoryProps.forEach(category => {
                category.classList.add('whats-new-category');
              });
              
              // 日付プロパティのスタイリング
              const dateProps = collectionElement.querySelectorAll('.notion-property-date');
              dateProps.forEach(date => {
                date.classList.add('whats-new-date');
              });
            }
          }
        });
      } catch (err) {
        console.error('Error applying What\'s New styling:', err);
      }
    };

    // DOMが完全に読み込まれた後に実行
    // 初回実行
    setTimeout(applyWhatsNewStyling, 1000);
    
    // Notionコンテンツが動的に変更される可能性があるため、再度実行
    const intervalId = setInterval(applyWhatsNewStyling, 3000);
    
    // クリーンアップ関数
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // このコンポーネントは実際のUIをレンダリングしない
  return null;
};

export default WhatsNewStyling;
</file>

</files>
