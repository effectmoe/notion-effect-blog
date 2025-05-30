This file is a merged representation of the entire codebase, combined into a single document by Repomix.

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
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
components/
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
lib/
  font-customizer/
    font-settings.js
    font-utils.js
  acl.ts
  add-home-link.ts
  bootstrap-client.ts
  client-side-search.ts
  config.ts
  db.ts
  get-canonical-page-id.ts
  get-config-value.ts
  get-menu-items.ts
  get-page-tweet.ts
  get-site-map.ts
  get-social-image-url.ts
  get-tweets.ts
  map-image-url.ts
  map-page-url.ts
  menu-utils.ts
  notion-api.ts
  notion-direct-search.ts
  notion-display-utils.ts
  notion-utils.ts
  notion-views.ts
  notion.ts
  oembed.ts
  preview-images.ts
  resolve-notion-page.ts
  search-notion.ts
  site-config.ts
  types.ts
  use-dark-mode.ts
pages/
  admin/
    font-settings.jsx
  api/
    direct-search.ts
    fallback-search.ts
    font-settings.js
    search-notion.ts
    social-image.tsx
    test-notion-connection.ts
    test-search.ts
  view/
    [view].tsx
  _app.tsx
  _document.tsx
  _error.tsx
  [pageId].tsx
  404.tsx
  feed.tsx
  index.tsx
  robots.txt.tsx
  sitemap.xml.tsx
public/
  manifest.json
styles/
  global.css
  notion.css
  notionのコピー.css
  prism-theme.css
.editorconfig
.env.example
.eslintignore
.eslintrc.json
.gitattributes
.gitignore
.prettierignore
.prettierrc
.repomixignore
contributing.md
eslint.config.cjs
license
next-env.d.ts
next.config.js
package.json
readme.md
site.config.ts
tsconfig.json
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="components/ErrorPage.tsx">
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

<file path="components/FilterableNotionPage.tsx">
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

<file path="components/FilterSort.tsx">
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

<file path="components/Footer.tsx">
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

<file path="components/GitHubShareButton.tsx">
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

<file path="components/Loading.tsx">
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

<file path="components/LoadingIcon.tsx">
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

<file path="components/NotionPageHeader.tsx">
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

<file path="components/Page404.tsx">
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

<file path="components/PageActions.tsx">
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

<file path="components/PageHead.tsx">
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

<file path="components/PageSocial.module.css">
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

<file path="components/PageSocial.tsx">
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

<file path="lib/acl.ts">
import { type PageProps } from './types'

export async function pageAcl({
  site,
  recordMap,
  pageId
}: PageProps): Promise<PageProps> {
  if (!site) {
    return {
      error: {
        statusCode: 404,
        message: 'Unable to resolve notion site'
      }
    }
  }

  if (!recordMap) {
    return {
      error: {
        statusCode: 404,
        message: `Unable to resolve page for domain "${site.domain}". Notion page "${pageId}" not found.`
      }
    }
  }

  const keys = Object.keys(recordMap.block)
  const rootKey = keys[0]

  if (!rootKey) {
    return {
      error: {
        statusCode: 404,
        message: `Unable to resolve page for domain "${site.domain}". Notion page "${pageId}" invalid data.`
      }
    }
  }

  const rootValue = recordMap.block[rootKey]?.value
  const rootSpaceId = rootValue?.space_id

  if (
    rootSpaceId &&
    site.rootNotionSpaceId &&
    rootSpaceId !== site.rootNotionSpaceId
  ) {
    if (process.env.NODE_ENV) {
      return {
        error: {
          statusCode: 404,
          message: `Notion page "${pageId}" doesn't belong to the Notion workspace owned by "${site.domain}".`
        }
      }
    }
  }
}
</file>

<file path="lib/bootstrap-client.ts">
export function bootstrap() {
  console.log(`

████████╗██████╗  █████╗ ███╗   ██╗███████╗██╗████████╗██╗██╗   ██╗███████╗    ██████╗ ███████╗
╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██║╚══██╔══╝██║██║   ██║██╔════╝    ██╔══██╗██╔════╝
   ██║   ██████╔╝███████║██╔██╗ ██║███████╗██║   ██║   ██║██║   ██║█████╗      ██████╔╝███████╗
   ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██║   ██║   ██║╚██╗ ██╔╝██╔══╝      ██╔══██╗╚════██║
   ██║   ██║  ██║██║  ██║██║ ╚████║███████║██║   ██║   ██║ ╚████╔╝ ███████╗    ██████╔╝███████║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝    ╚═════╝ ╚══════╝

   This site is built using Notion, Next.js, and https://github.com/NotionX/react-notion-x.
`)
}
</file>

<file path="lib/db.ts">
import Keyv from '@keyvhq/core'
import KeyvRedis from '@keyvhq/redis'

import { isRedisEnabled, redisNamespace, redisUrl } from './config'

let db: Keyv
if (isRedisEnabled) {
  const keyvRedis = new KeyvRedis(redisUrl)
  db = new Keyv({ store: keyvRedis, namespace: redisNamespace || undefined })
} else {
  db = new Keyv()
}

export { db }
</file>

<file path="lib/get-canonical-page-id.ts">
import { type ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    return getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    })
  }
}
</file>

<file path="lib/get-config-value.ts">
import rawSiteConfig from '../site.config'
import { type SiteConfig } from './site-config'

if (!rawSiteConfig) {
  throw new Error(`Config error: invalid site.config.ts`)
}

// allow environment variables to override site.config.ts
let siteConfigOverrides: SiteConfig

try {
  if (process.env.NEXT_PUBLIC_SITE_CONFIG) {
    siteConfigOverrides = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG)
  }
} catch (err) {
  console.error('Invalid config "NEXT_PUBLIC_SITE_CONFIG" failed to parse')
  throw err
}

const siteConfig: SiteConfig = {
  ...rawSiteConfig,
  ...siteConfigOverrides
}

export function getSiteConfig<T>(key: string, defaultValue?: T): T {
  const value = siteConfig[key]

  if (value !== undefined) {
    return value
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  throw new Error(`Config error: missing required site config value "${key}"`)
}

export function getEnv(
  key: string,
  defaultValue?: string,
  env = process.env
): string {
  const value = env[key]

  if (value !== undefined) {
    return value
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  throw new Error(`Config error: missing required env variable "${key}"`)
}
</file>

<file path="lib/get-page-tweet.ts">
import { getPageProperty } from 'notion-utils'

import type * as types from './types'

export function getPageTweet(
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  return getPageProperty('Tweet', block, recordMap)
}
</file>

<file path="lib/get-social-image-url.ts">
import { api, host } from './config'

export function getSocialImageUrl(pageId: string) {
  try {
    const url = new URL(api.getSocialImage, host)

    if (pageId) {
      url.searchParams.set('id', pageId)
      return url.toString()
    }
  } catch (err) {
    console.warn('error invalid social image url', pageId, err.message)
  }

  return null
}
</file>

<file path="lib/get-tweets.ts">
import { type ExtendedRecordMap } from 'notion-types'
import { getPageTweetIds } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'
import { getTweet as getTweetData } from 'react-tweet/api'

import type { ExtendedTweetRecordMap } from './types'
import { db } from './db'

export async function getTweetsMap(
  recordMap: ExtendedRecordMap
): Promise<void> {
  const tweetIds = getPageTweetIds(recordMap)

  const tweetsMap = Object.fromEntries(
    await pMap(
      tweetIds,
      async (tweetId: string) => {
        return [tweetId, await getTweet(tweetId)]
      },
      {
        concurrency: 8
      }
    )
  )

  ;(recordMap as ExtendedTweetRecordMap).tweets = tweetsMap
}

async function getTweetImpl(tweetId: string): Promise<any> {
  if (!tweetId) return null

  const cacheKey = `tweet:${tweetId}`

  try {
    try {
      const cachedTweet = await db.get(cacheKey)
      if (cachedTweet || cachedTweet === null) {
        return cachedTweet
      }
    } catch (err) {
      // ignore redis errors
      console.warn(`redis error get "${cacheKey}"`, err.message)
    }

    const tweetData = (await getTweetData(tweetId)) || null

    try {
      await db.set(cacheKey, tweetData)
    } catch (err) {
      // ignore redis errors
      console.warn(`redis error set "${cacheKey}"`, err.message)
    }

    return tweetData
  } catch (err: any) {
    console.warn('failed to get tweet', tweetId, err.message)
    return null
  }
}

export const getTweet = pMemoize(getTweetImpl)
</file>

<file path="lib/map-image-url.ts">
import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  return defaultMapImageUrl(url, block)
}
</file>

<file path="lib/notion-display-utils.ts">
import { getPageProperty } from 'notion-utils'

// Notionページからカテゴリを抽出する関数（安全なバージョン）
export function extractCategories(recordMap: any): string[] {
  if (!recordMap || !recordMap.collection) {
    return []
  }

  try {
    // コレクションからスキーマ情報を取得
    const collectionValues = Object.values(recordMap.collection) as Array<{value: any}>
    const collection = collectionValues[0]?.value
    if (!collection || !collection.schema) {
      return []
    }

    // カテゴリとしてマークされたプロパティを探す（通常は 'select' タイプ）
    const categoryProp = Object.entries(collection.schema).find(
      ([_, value]: [string, any]) => {
        return (value as any).name.toLowerCase() === 'category' || 
               (value as any).name.toLowerCase() === 'カテゴリ'
      }
    )

    // カテゴリプロパティが見つからない場合、selectタイプのプロパティを探す
    const propertyId = categoryProp 
      ? categoryProp[0] 
      : Object.entries(collection.schema)
          .find(([_, value]: [string, any]) => (value as any).type === 'select')?.[0]
    
    if (!propertyId) {
      return []
    }

    // ページのブロックからカテゴリ値を抽出
    const categories = new Set<string>()
    
    Object.values(recordMap.block).forEach((block: any) => {
      if (block.value && block.value.properties) {
        const category = getPageProperty(propertyId, block.value, recordMap)
        if (category && typeof category === 'string') {
          categories.add(category)
        }
      }
    })

    return Array.from(categories).sort()
  } catch (err) {
    console.error('Failed to extract categories:', err)
    return []
  }
}

// ページのカテゴリを取得する関数
export function getPageCategory(page: any, recordMap: any): string {
  if (!page || !page.value || !recordMap || !recordMap.collection) {
    return ''
  }
  
  try {
    // コレクションからスキーマ情報を取得
    const collectionValues = Object.values(recordMap.collection) as Array<{value: any}>
    const collection = collectionValues[0]?.value
    if (!collection || !collection.schema) {
      return ''
    }

    // カテゴリプロパティを見つける
    const categoryProp = Object.entries(collection.schema).find(
      ([_, value]: [string, any]) => 
        (value as any).name.toLowerCase() === 'category' || 
        (value as any).name.toLowerCase() === 'カテゴリ'
    )

    // カテゴリプロパティが見つからない場合、selectタイプのプロパティを探す
    const propertyId = categoryProp 
      ? categoryProp[0] 
      : Object.entries(collection.schema)
          .find(([_, value]: [string, any]) => (value as any).type === 'select')?.[0]
    
    if (!propertyId) {
      return ''
    }

    // ページのカテゴリを取得
    const category = getPageProperty(propertyId, page.value, recordMap)
    return category ? category.toString() : ''
  } catch (err) {
    console.error('Failed to get page category:', err)
    return ''
  }
}

// ページの作成日時を取得
export function getPageCreationTime(page: any): number {
  if (!page || !page.value || !page.value.created_time) {
    return 0
  }
  
  try {
    return page.value.created_time
  } catch (err) {
    console.error('Failed to get page creation time:', err)
    return 0
  }
}

// ページのタイトルを取得
export function getPageTitle(page: any, recordMap: any): string {
  if (!page || !page.value || !recordMap) {
    return ''
  }
  
  try {
    // ページのプロパティからタイトルを探す
    const titleProp = Object.values(page.value.properties || {}).find(
      (prop: any) => Array.isArray(prop) && prop[0] && prop[0][0] === 'Page'
    )
    
    if (titleProp && Array.isArray(titleProp) && titleProp[0] && titleProp[0][1]) {
      return titleProp[0][1].toString()
    }
    
    // ページ名が見つからない場合は空文字を返す
    return ''
  } catch (err) {
    console.error('Failed to get page title:', err)
    return ''
  }
}

// フィルタとソート条件を適用し、表示すべきページIDのリストを返す
// 元のデータ構造は変更せず、表示/非表示するブロックのIDだけを返す
export function getFilteredSortedPageIds(
  recordMap: any, 
  selectedCategory: string, 
  sortOrder: string
): string[] {
  if (!recordMap || !recordMap.block) {
    return []
  }
  
  try {
    // ページブロックを抽出
    const pageBlocks = Object.entries(recordMap.block)
      .filter(([_, block]: [string, any]) => 
        (block as any).value && (block as any).value.type === 'page'
      )
    
    // カテゴリでフィルタリング
    const filteredBlocks = selectedCategory
      ? pageBlocks.filter(([_, block]: [string, any]) => {
          const category = getPageCategory((block as any), recordMap)
          return category === selectedCategory
        })
      : pageBlocks
    
    // ソート
    let sortedBlocks = [...filteredBlocks]
    
    switch (sortOrder) {
      case 'newest':
        sortedBlocks.sort(([_, a]: [string, any], [__, b]: [string, any]) => {
          const timeA = getPageCreationTime((a as any))
          const timeB = getPageCreationTime((b as any))
          return timeB - timeA // 降順（新しい順）
        })
        break
        
      case 'oldest':
        sortedBlocks.sort(([_, a]: [string, any], [__, b]: [string, any]) => {
          const timeA = getPageCreationTime((a as any))
          const timeB = getPageCreationTime((b as any))
          return timeA - timeB // 昇順（古い順）
        })
        break
        
      case 'title_asc':
        sortedBlocks.sort(([_, a]: [string, any], [__, b]: [string, any]) => {
          const titleA = getPageTitle((a as any), recordMap) || ''
          const titleB = getPageTitle((b as any), recordMap) || ''
          return titleA.localeCompare(titleB) // 昇順（A-Z）
        })
        break
        
      case 'title_desc':
        sortedBlocks.sort(([_, a]: [string, any], [__, b]: [string, any]) => {
          const titleA = getPageTitle((a as any), recordMap) || ''
          const titleB = getPageTitle((b as any), recordMap) || ''
          return titleB.localeCompare(titleA) // 降順（Z-A）
        })
        break
        
      default:
        // デフォルトは新しい順
        sortedBlocks.sort(([_, a]: [string, any], [__, b]: [string, any]) => {
          const timeA = getPageCreationTime((a as any))
          const timeB = getPageCreationTime((b as any))
          return timeB - timeA // 降順（新しい順）
        })
    }
    
    // ページIDのリストとして返す
    return sortedBlocks.map(([id]: [string, any]) => id)
  } catch (err) {
    console.error('Filter/Sort error:', err)
    return Object.keys(recordMap.block).filter(id => {
      const block = (recordMap.block[id] as any)
      return block.value && block.value.type === 'page'
    })
  }
}
</file>

<file path="lib/oembed.ts">
import { getPageTitle, parsePageId } from 'notion-utils'

import * as config from './config'
import { getPage } from './notion'

export const oembed = async ({
  url,
  maxWidth,
  maxHeight,
  dark = false
}: {
  url: string
  maxWidth?: number
  maxHeight?: number
  dark?: boolean
}) => {
  // TODO: handle pages with no pageId via domain
  const pageId = parsePageId(url)

  let title = config.name
  let authorName = config.author

  // TODO: handle errors gracefully

  const page = await getPage(pageId)
  const pageTitle = getPageTitle(page)
  if (pageTitle) title = pageTitle

  const user = page.notion_user[Object.keys(page.notion_user)[0]]?.value
  const name = [user.given_name, user.family_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  if (name) authorName = name

  const params: any = { lite: 'true' }
  if (dark) {
    params.dark = 'true'
  }

  const query = new URLSearchParams(params).toString()
  const embedUrl = `${config.host}/${pageId}?${query}`
  const defaultWidth = 800
  const defaultHeight = 600
  const width = maxWidth ? Math.min(maxWidth, defaultWidth) : defaultWidth
  const height = maxHeight ? Math.min(maxHeight, defaultHeight) : defaultHeight

  return {
    version: '1.0',
    type: 'rich',
    provider_name: config.author,
    provider_url: config.host,
    title,
    author_name: authorName,
    url,
    // TODO
    // thumbnail_url: 'https://repl.it/public/images/replit-logo-800x600.png',
    // thumbnail_width: 800,
    // thumbnail_height: 600,
    width,
    height,
    html: `<iframe src="${embedUrl}" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts" width="${width}" height="${height}" frameborder="0"></iframe>`
  }
}
</file>

<file path="lib/resolve-notion-page.ts">
import { type ExtendedRecordMap } from 'notion-types'
import { parsePageId } from 'notion-utils'

import * as acl from './acl'
import { environment, pageUrlAdditions, pageUrlOverrides, site } from './config'
import { db } from './db'
import { getSiteMap } from './get-site-map'
import { getPage } from './notion'

export async function resolveNotionPage(domain: string, rawPageId?: string) {
  let pageId: string
  let recordMap: ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    pageId = parsePageId(rawPageId)

    if (!pageId) {
      // check if the site configuration provides an override or a fallback for
      // the page's URI
      const override =
        pageUrlOverrides[rawPageId] || pageUrlAdditions[rawPageId]

      if (override) {
        pageId = parsePageId(override)
      }
    }

    const useUriToPageIdCache = true
    const cacheKey = `uri-to-page-id:${domain}:${environment}:${rawPageId}`
    // TODO: should we use a TTL for these mappings or make them permanent?
    // const cacheTTL = 8.64e7 // one day in milliseconds
    const cacheTTL = undefined // disable cache TTL

    if (!pageId && useUriToPageIdCache) {
      try {
        // check if the database has a cached mapping of this URI to page ID
        pageId = await db.get(cacheKey)

        // console.log(`redis get "${cacheKey}"`, pageId)
      } catch (err) {
        // ignore redis errors
        console.warn(`redis error get "${cacheKey}"`, err.message)
      }
    }

    if (pageId) {
      recordMap = await getPage(pageId)
    } else {
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
      const siteMap = await getSiteMap()
      pageId = siteMap?.canonicalPageMap[rawPageId]

      if (pageId) {
        // TODO: we're not re-using the page recordMap from siteMaps because it is
        // cached aggressively
        // recordMap = siteMap.pageMap[pageId]

        recordMap = await getPage(pageId)

        if (useUriToPageIdCache) {
          try {
            // update the database mapping of URI to pageId
            await db.set(cacheKey, pageId, cacheTTL)

            // console.log(`redis set "${cacheKey}"`, pageId, { cacheTTL })
          } catch (err) {
            // ignore redis errors
            console.warn(`redis error set "${cacheKey}"`, err.message)
          }
        }
      } else {
        // note: we're purposefully not caching URI to pageId mappings for 404s
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404
          }
        }
      }
    }
  } else {
    pageId = site.rootNotionPageId

    console.log(site)
    recordMap = await getPage(pageId)
  }

  const props = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
</file>

<file path="lib/site-config.ts">
import type * as types from './types'

export interface SiteConfig {
  rootNotionPageId: string
  rootNotionSpaceId?: string

  name: string
  domain: string
  author: string
  description?: string
  language?: string

  twitter?: string
  github?: string
  linkedin?: string
  newsletter?: string
  youtube?: string
  zhihu?: string
  mastodon?: string
  instagram?: string
  facebook?: string

  defaultPageIcon?: string | null
  defaultPageCover?: string | null
  defaultPageCoverPosition?: number | null

  isPreviewImageSupportEnabled?: boolean
  isTweetEmbedSupportEnabled?: boolean
  isRedisEnabled?: boolean
  isSearchEnabled?: boolean

  includeNotionIdInUrls?: boolean
  pageUrlOverrides?: types.PageUrlOverridesMap
  pageUrlAdditions?: types.PageUrlOverridesMap

  navigationStyle?: types.NavigationStyle
  navigationLinks?: Array<NavigationLink>
}

export interface NavigationLink {
  title: string
  pageId?: string
  url?: string
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config
}
</file>

<file path="lib/use-dark-mode.ts">
import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  const darkMode = useDarkModeImpl(false, { classNameDark: 'dark-mode' })

  return {
    isDarkMode: darkMode.value,
    toggleDarkMode: darkMode.toggle
  }
}
</file>

<file path="pages/api/social-image.tsx">
import ky from 'ky'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { ImageResponse } from 'next/og'
import { type PageBlock } from 'notion-types'
import {
  getBlockIcon,
  getBlockTitle,
  getPageProperty,
  isUrl,
  parsePageId
} from 'notion-utils'

import * as libConfig from '@/lib/config'
import interSemiBoldFont from '@/lib/fonts/inter-semibold'
import { mapImageUrl } from '@/lib/map-image-url'
import { notion } from '@/lib/notion-api'
import { type NotionPageInfo, type PageError } from '@/lib/types'

export const runtime = 'edge'

export default async function OGImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchParams } = new URL(req.url)
  const pageId = parsePageId(
    searchParams.get('id') || libConfig.rootNotionPageId
  )
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 })
  }

  const pageInfoOrError = await getNotionPageInfo({ pageId })
  if (pageInfoOrError.type === 'error') {
    return res.status(pageInfoOrError.error.statusCode).send({
      error: pageInfoOrError.error.message
    })
  }
  const pageInfo = pageInfoOrError.data
  console.log(pageInfo)

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1F2027',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black'
        }}
      >
        {pageInfo.image && (
          <img
            src={pageInfo.image}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
              // TODO: satori doesn't support background-size: cover and seems to
              // have inconsistent support for filter + transform to get rid of the
              // blurred edges. For now, we'll go without a blur filter on the
              // background, but Satori is still very new, so hopefully we can re-add
              // the blur soon.

              // backgroundImage: pageInfo.image
              //   ? `url(${pageInfo.image})`
              //   : undefined,
              // backgroundSize: '100% 100%'
              // TODO: pageInfo.imageObjectPosition
              // filter: 'blur(8px)'
              // transform: 'scale(1.05)'
            }}
          />
        )}

        <div
          style={{
            position: 'relative',
            width: 900,
            height: 465,
            display: 'flex',
            flexDirection: 'column',
            border: '16px solid rgba(0,0,0,0.3)',
            borderRadius: 8,
            zIndex: '1'
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              backgroundColor: '#fff',
              padding: 24,
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {pageInfo.detail && (
              <div style={{ fontSize: 32, opacity: 0 }}>{pageInfo.detail}</div>
            )}

            <div
              style={{
                fontSize: 70,
                fontWeight: 700,
                fontFamily: 'Inter'
              }}
            >
              {pageInfo.title}
            </div>

            {pageInfo.detail && (
              <div style={{ fontSize: 32, opacity: 0.6 }}>
                {pageInfo.detail}
              </div>
            )}
          </div>
        </div>

        {pageInfo.authorImage && (
          <div
            style={{
              position: 'absolute',
              top: 47,
              left: 104,
              height: 128,
              width: 128,
              display: 'flex',
              borderRadius: '50%',
              border: '4px solid #fff',
              zIndex: '5'
            }}
          >
            <img
              src={pageInfo.authorImage}
              style={{
                width: '100%',
                height: '100%'
                // transform: 'scale(1.04)'
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBoldFont,
          style: 'normal',
          weight: 700
        }
      ]
    }
  )
}

export async function getNotionPageInfo({
  pageId
}: {
  pageId: string
}): Promise<
  | { type: 'success'; data: NotionPageInfo }
  | { type: 'error'; error: PageError }
> {
  const recordMap = await notion.getPage(pageId)

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (!block) {
    throw new Error('Invalid recordMap for page')
  }

  const blockSpaceId = block.space_id

  if (
    blockSpaceId &&
    libConfig.rootNotionSpaceId &&
    blockSpaceId !== libConfig.rootNotionSpaceId
  ) {
    return {
      type: 'error',
      error: {
        statusCode: 400,
        message: `Notion page "${pageId}" belongs to a different workspace.`
      }
    }
  }

  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'
  const title = getBlockTitle(block, recordMap) || libConfig.name

  const imageCoverPosition =
    (block as PageBlock).format?.page_cover_position ??
    libConfig.defaultPageCoverPosition
  const imageObjectPosition = imageCoverPosition
    ? `center ${(1 - imageCoverPosition) * 100}%`
    : null

  const imageBlockUrl = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover,
    block
  )
  const imageFallbackUrl = mapImageUrl(libConfig.defaultPageCover, block)

  const blockIcon = getBlockIcon(block, recordMap)
  const authorImageBlockUrl = mapImageUrl(
    blockIcon && isUrl(blockIcon) ? blockIcon : null,
    block
  )
  const authorImageFallbackUrl = mapImageUrl(libConfig.defaultPageIcon, block)
  const [authorImage, image] = await Promise.all([
    getCompatibleImageUrl(authorImageBlockUrl, authorImageFallbackUrl),
    getCompatibleImageUrl(imageBlockUrl, imageFallbackUrl)
  ])

  const author =
    getPageProperty<string>('Author', block, recordMap) || libConfig.author

  // const socialDescription =
  //   getPageProperty<string>('Description', block, recordMap) ||
  //   libConfig.description

  // const lastUpdatedTime = getPageProperty<number>(
  //   'Last Updated',
  //   block,
  //   recordMap
  // )
  const publishedTime = getPageProperty<number>('Published', block, recordMap)
  const datePublished = publishedTime ? new Date(publishedTime) : undefined
  // const dateUpdated = lastUpdatedTime
  //   ? new Date(lastUpdatedTime)
  //   : publishedTime
  //   ? new Date(publishedTime)
  //   : undefined
  const date =
    isBlogPost && datePublished
      ? `${datePublished.toLocaleString('en-US', {
          month: 'long'
        })} ${datePublished.getFullYear()}`
      : undefined
  const detail = date || author || libConfig.domain

  const pageInfo: NotionPageInfo = {
    pageId,
    title,
    image,
    imageObjectPosition,
    author,
    authorImage,
    detail
  }

  return {
    type: 'success',
    data: pageInfo
  }
}

async function isUrlReachable(url: string | null): Promise<boolean> {
  if (!url) {
    return false
  }

  try {
    await ky.head(url)
    return true
  } catch {
    return false
  }
}

async function getCompatibleImageUrl(
  url: string | null,
  fallbackUrl: string | null
): Promise<string | null> {
  const image = (await isUrlReachable(url)) ? url : fallbackUrl

  if (image) {
    const imageUrl = new URL(image)

    if (imageUrl.host === 'images.unsplash.com') {
      if (!imageUrl.searchParams.has('w')) {
        imageUrl.searchParams.set('w', '1200')
        imageUrl.searchParams.set('fit', 'max')
        return imageUrl.toString()
      }
    }
  }

  return image
}
</file>

<file path="pages/_document.tsx">
import { IconContext } from '@react-icons/all-files'
import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Html lang='en'>
          <Head>
            <link rel='shortcut icon' href='/favicon.ico' />
            <link
              rel='icon'
              type='image/png'
              sizes='32x32'
              href='favicon.png'
            />

            <link rel='manifest' href='/manifest.json' />
          </Head>

          <body>
            <script
              dangerouslySetInnerHTML={{
                __html: `
/** Inlined version of noflash.js from use-dark-mode */
;(function () {
  var storageKey = 'darkMode'
  var classNameDark = 'dark-mode'
  var classNameLight = 'light-mode'
  function setClassOnDocumentBody(darkMode) {
    document.body.classList.add(darkMode ? classNameDark : classNameLight)
    document.body.classList.remove(darkMode ? classNameLight : classNameDark)
  }
  var preferDarkQuery = '(prefers-color-scheme: dark)'
  var mql = window.matchMedia(preferDarkQuery)
  var supportsColorSchemeQuery = mql.media === preferDarkQuery
  var localStorageTheme = null
  try {
    localStorageTheme = localStorage.getItem(storageKey)
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme)
  }
  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClassOnDocumentBody(localStorageTheme)
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    setClassOnDocumentBody(mql.matches)
    localStorage.setItem(storageKey, mql.matches)
  } else {
    // source of truth from document.body
    var isDarkMode = document.body.classList.contains(classNameDark)
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode))
  }
})();
`
              }}
            />
            <Main />

            <NextScript />
          </body>
        </Html>
      </IconContext.Provider>
    )
  }
}
</file>

<file path="pages/_error.tsx">
export { ErrorPage as default } from '@/components/ErrorPage'
</file>

<file path="pages/404.tsx">
export { Page404 as default } from '@/components/Page404'
</file>

<file path="pages/feed.tsx">
import type { GetServerSideProps } from 'next'
import { type ExtendedRecordMap } from 'notion-types'
import {
  getBlockParentPage,
  getBlockTitle,
  getPageProperty,
  idToUuid
} from 'notion-utils'
import RSS from 'rss'

import * as config from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { getSocialImageUrl } from '@/lib/get-social-image-url'
import { getCanonicalPageUrl } from '@/lib/map-page-url'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return { props: {} }
  }

  const siteMap = await getSiteMap()
  const ttlMinutes = 24 * 60 // 24 hours
  const ttlSeconds = ttlMinutes * 60

  const feed = new RSS({
    title: config.name,
    site_url: config.host,
    feed_url: `${config.host}/feed.xml`,
    language: config.language,
    ttl: ttlMinutes
  })

  for (const pagePath of Object.keys(siteMap.canonicalPageMap)) {
    const pageId = siteMap.canonicalPageMap[pagePath]
    const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap
    if (!recordMap) continue

    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]]?.value
    if (!block) continue

    const parentPage = getBlockParentPage(block, recordMap)
    const isBlogPost =
      block.type === 'page' &&
      block.parent_table === 'collection' &&
      parentPage?.id === idToUuid(config.rootNotionPageId)
    if (!isBlogPost) {
      continue
    }

    const title = getBlockTitle(block, recordMap) || config.name
    const description =
      getPageProperty<string>('Description', block, recordMap) ||
      config.description
    const url = getCanonicalPageUrl(config.site, recordMap)(pageId)
    const lastUpdatedTime = getPageProperty<number>(
      'Last Updated',
      block,
      recordMap
    )
    const publishedTime = getPageProperty<number>('Published', block, recordMap)
    const date = lastUpdatedTime
      ? new Date(lastUpdatedTime)
      : publishedTime
        ? new Date(publishedTime)
        : undefined
    const socialImageUrl = getSocialImageUrl(pageId)

    feed.item({
      title,
      url,
      date,
      description,
      enclosure: socialImageUrl
        ? {
            url: socialImageUrl,
            type: 'image/jpeg'
          }
        : undefined
    })
  }

  const feedText = feed.xml({ indent: true })

  res.setHeader(
    'Cache-Control',
    `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
  )
  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.write(feedText)
  res.end()

  return { props: {} }
}

export default function noop() {
  return null
}
</file>

<file path="pages/robots.txt.tsx">
import type { GetServerSideProps } from 'next'

import { host } from '@/lib/config'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()

    return {
      props: {}
    }
  }

  // cache for up to one day
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.setHeader('Content-Type', 'text/plain')

  // only allow the site to be crawlable on the production deployment
  if (process.env.VERCEL_ENV === 'production') {
    res.write(`User-agent: *
Allow: /
Disallow: /api/get-tweet-ast/*
Disallow: /api/search-notion

Sitemap: ${host}/sitemap.xml
`)
  } else {
    res.write(`User-agent: *
Disallow: /

Sitemap: ${host}/sitemap.xml
`)
  }

  res.end()

  return {
    props: {}
  }
}

export default function noop() {
  return null
}
</file>

<file path="pages/sitemap.xml.tsx">
import type { GetServerSideProps } from 'next'

import type { SiteMap } from '@/lib/types'
import { host } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return {
      props: {}
    }
  }

  const siteMap = await getSiteMap()

  // cache for up to 8 hours
  res.setHeader(
    'Cache-Control',
    'public, max-age=28800, stale-while-revalidate=28800'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMap))
  res.end()

  return {
    props: {}
  }
}

const createSitemap = (siteMap: SiteMap) =>
  `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${host}</loc>
    </url>

    <url>
      <loc>${host}/</loc>
    </url>

    ${Object.keys(siteMap.canonicalPageMap)
      .map((canonicalPagePath) =>
        `
          <url>
            <loc>${host}/${canonicalPagePath}</loc>
          </url>
        `.trim()
      )
      .join('')}
  </urlset>
`

export default function noop() {
  return null
}
</file>

<file path="public/manifest.json">
{
  "name": "Next.js Notion Starter Kit",
  "short_name": "Starter Kit",
  "icons": [
    {
      "src": "/favicon.png",
      "type": "image/png",
      "sizes": "32x32"
    },
    {
      "src": "/favicon-128x128.png",
      "type": "image/png",
      "sizes": "128x128"
    },
    {
      "src": "/favicon-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    }
  ],
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone"
}
</file>

<file path="styles/notionのコピー.css">
/**
 * This file contains site-specifc style overrides for Notion elements from
 * react-notion-x.
 *
 * react-notion-x's goal is to match styling as close as possible to Notion,
 * whereas our goal with this site is to adjust Notion's styling in a few key
 * places to add some flare.
 */

.notion {
  --notion-max-width: 720px;
  --notion-header-height: 54px;
}

.notion-frame {
  padding: 0;
}

.notion-page {
  padding-bottom: calc(max(5vh, 32px)) !important;
  line-height: 1.65;
}

.index-page {
  --notion-max-width: 900px;
}

.notion-text {
  padding: 0.5em 2px;
}

.notion-asset-caption {
  text-align: center;
}

.notion-asset-wrapper {
  margin-top: 1em;
  margin-bottom: 1em;
}

.notion-asset-wrapper-video > div,
.notion-asset-wrapper-video video {
  width: 100% !important;
}

.notion-header .notion-nav-header {
  max-width: 1100px;
  margin: 0 auto;
  overflow-x: auto;
}

.notion-nav-header-rhs {
  gap: 0.5rem;
}

.notion-gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-gap: 2vmin;
  gap: 2vmin;
}

.notion-gallery-grid .notion-page-icon-inline {
  display: none;
}

.notion-gallery-grid .notion-page-title-text {
  font-size: 2em;
  white-space: unset;
}

.notion-gallery-grid .notion-collection-card-property {
  white-space: unset;
  text-overflow: unset;
}

.notion-gallery-grid .notion-property-text {
  font-size: 14px;
}

.notion-collection-card {
  border-radius: 16px;
  box-shadow: none;
}

.notion-collection-card-cover img {
  border-radius: 16px;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 画像のアスペクト比を維持しながら領域いっぱいに表示 */
}

.notion-collection-card {
  overflow: visible;
}

.notion-collection-card-cover {
  border-radius: 16px;
  box-shadow: 2px 2px 8px 4px rgba(15, 15, 15, 0.1);
  /* 高さは各メディアクエリで設定するため、ここでは切り替えの基本値のみ設定 */
  height: 300px;
}

.notion-collection-card-cover {
  border-bottom: 0 none;
  transition: filter 150ms linear;
  filter: none;
}

.notion-collection-card:hover .notion-collection-card-cover {
  filter: brightness(120%);
}

.notion-collection-card-body {
  padding: 10px;
}

/* only target safari */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  _::-webkit-full-page-media,
  _:future,
  :root,
  .notion-collection-card-cover {
    transition: none 0ms linear;
  }
}

.notion-quote {
  padding: 0.2em 0.75em;
  line-height: 1.5;
  font-style: italic;
  font-size: 1.2em;
  border-left: 4px solid #67bdfc;
}

.notion-h1,
.notion-h2,
.notion-h3 {
  margin-bottom: 0.25em;
}

.notion-callout {
  margin: 0.75em 0;
}

.notion-hr {
  margin: 2em 0;
}

@media only screen and (max-width: 920px) {
  .index-page.notion-page {
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

@media only screen and (max-width: 720px) {
  .notion-page {
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

@media only screen and (max-width: 600px) {
  .notion-search-button {
    display: none !important;
  }
}

.notion .notion-page-icon-cover {
  margin-left: auto;
  margin-right: auto;
}

.notion-title {
  display: block;
  text-align: center;
}

/* タイトルフォント設定の強制適用 */
.notion-page-title-text {
  font-family: 'Shippori Mincho', serif !important;
}

/* Googleフォントの直接インポート */
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&display=swap');

.notion-collection-row {
  padding-bottom: 1em;
}

.notion-collection-page-properties .notion-collection-column-title {
  display: none;
}

.notion-collection-row-property .notion-property {
  display: flex;
  justify-content: center;
}

.notion-collection-row-value {
  display: flex;
  align-items: center;
  padding: 0;
  min-height: 23px;
}

.notion-page-cover-wrapper,
.notion-page-cover-wrapper span,
.notion-page-cover-wrapper img {
  max-width: 1200px !important;
  border-radius: 24px;
}

.notion-page-cover-wrapper {
  box-shadow: 2px 2px 8px 4px rgba(15, 15, 15, 0.1);
}

@media only screen and (max-width: 1200px) {
  .notion-page-cover-wrapper,
  .notion-page-cover-wrapper span,
  .notion-page-cover-wrapper img {
    border-radius: 0;
  }
}

.notion-block-ab9a258d6cf444f3bb40dc2600feae91 .notion-page-link {
  justify-content: center;
  padding: 2em;
}

.notion-code {
  background: rgba(249, 250, 251, 1);
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 0.375rem;
}

.notion-link {
  position: relative;
  transition: unset;
  opacity: 1;
  border-bottom-width: 0.1rem;
  background: transparent;
  background-origin: border-box;
  background-repeat: no-repeat;
  background-position: 50% 100%;
  background-size: 0 0.1rem;
}

.notion-link:focus,
.notion-link:hover {
  border-bottom-color: transparent;

  background-image: linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 0.1rem;

  transition-property: background-position, background-size;
  transition-duration: 300ms;
}

.notion-red_background,
.notion-pink_background,
.notion-blue_background,
.notion-purple_background,
.notion-teal_background,
.notion-yellow_background,
.notion-orange_background,
.notion-brown_background,
.notion-gray_background {
  padding: 0 0.5rem;
  margin: 0 -0.5rem 0 -0.25rem;
  border-radius: 0.5rem;
  border-bottom-left-radius: 0.125rem;
  box-decoration-break: clone;

  background-color: none;

  /* light yellow */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #fff697 10.5%,
    #fdf59d 85.29%,
    var(--bg-color)
  );
}

.notion-purple_background,
.notion-pink_background {
  /* light pink */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #f5b8d1 10.5%,
    #f9bcd3 85.29%,
    var(--bg-color)
  );
}

.notion-blue_background,
.notion-gray_background {
  /* light blue */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #adedfc 10.5%,
    #adebfd 85.29%,
    var(--bg-color)
  );
}

.notion-red_background,
.notion-orange_background {
  /* light red */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #f5c4ff 10.5%,
    #e7a8fc 85.29%,
    var(--bg-color)
  );
}

.notion-teal_background {
  /* light green */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #d4eabc 10.5%,
    #d2eabc 85.29%,
    var(--bg-color)
  );
}

.notion-brown_background {
  /* dark blue */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #96b8ec 10.5%,
    #a6c3f0 85.29%,
    var(--bg-color)
  );
}

/* disable highlighting in dark mode */
.dark-mode .notion-red_background,
.dark-mode .notion-pink_background,
.dark-mode .notion-blue_background,
.dark-mode .notion-purple_background,
.dark-mode .notion-teal_background,
.dark-mode .notion-yellow_background,
.dark-mode .notion-orange_background,
.dark-mode .notion-brown_background,
.dark-mode .notion-gray_background {
  padding: 0;
  margin: 0;
  border-radius: 0;
  background: none !important;
}

/* if you don't want rounded page icon images, remove this */
.notion-page-icon-hero.notion-page-icon-image {
  border-radius: 50%;
  box-shadow: 0 8px 40px 0 rgb(0 0 0 / 21%);
}
.notion-page-icon-hero.notion-page-icon-image span,
.notion-page-icon-hero.notion-page-icon-image img {
  border-radius: 50%;
}

.notion-header {
  background: hsla(0, 0%, 100%, 0.8);
  backdrop-filter: saturate(180%) blur(16px);
}

.dark-mode .notion-header {
  background: transparent;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: saturate(180%) blur(20px);
}

/* Workaround for Firefox not supporting backdrop-filter yet */
@-moz-document url-prefix() {
  .dark-mode .notion-header {
    background: hsla(203, 8%, 20%, 0.8);
  }
}

.notion-bookmark:hover {
  border-image: linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%);
  border-image-slice: 1;
}

.notion-block-ab9a258d6cf444f3bb40dc2600feae91 .notion-column {
  padding: 0;
}

.notion-block-260baa77f1e1428b97fb14ac99c7c385 {
  display: none;
}

.notion-search .searchBar {
  box-shadow: var(--fg-color-0) 0px 1px 0px;
}

.notion-search .noResults {
  color: var(--fg-color-3);
}

.notion-search .noResultsDetail {
  color: var(--fg-color-2);
}

.notion-equation.notion-equation-block {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1em;
  margin: 1em 0;
  overflow-x: auto;
  font-size: 1.2em;
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.dark-mode .notion-equation.notion-equation-block {
  background-color: rgba(17, 24, 39, 0.6);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

/* インライン数式のスタイル改善 */
.notion-equation.notion-equation-inline {
  padding: 0 3px;
  vertical-align: middle;
  font-size: 1.1em;
}

/* ホバー時の効果 */
.notion-equation.notion-equation-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(249, 250, 251, 1);
}

.dark-mode .notion-equation.notion-equation-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background-color: rgba(17, 24, 39, 0.8);
}

/* PDFビューアーの改善スタイル */
.notion-pdf {
  width: 100%;
  height: auto;
  min-height: 600px;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 2em 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);
  background-color: white;
}

/* PDFビューアーにホバー効果を追加 */
.notion-pdf:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* PDF上部にPDFを示すバッジを追加 */
.notion-pdf::before {
  content: "PDF";
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(217, 119, 6, 0.9);
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ダークモード対応 */
.dark-mode .notion-pdf {
  border-color: rgba(55, 65, 81, 0.5);
  background-color: rgba(31, 41, 55, 1);
}

.dark-mode .notion-pdf:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* モバイル端末の場合はPDFビューアーの高さを調整 */
@media only screen and (max-width: 767px) {
  .notion-pdf {
    min-height: 400px;
  }
  
  /* モバイルでは変形効果を抑える */
  .notion-pdf:hover {
    transform: translateY(-1px);
  }
}

/* コレクションビュー改善スタイル */
.notion-collection-view-tabs {
  margin: 1.5em 0 1em;
  border-bottom: 1px solid rgba(55, 53, 47, 0.16);
  padding-bottom: 0.5em;
  position: relative;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.notion-collection-view-tabs::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.notion-collection-view-tabs-content {
  display: flex;
  align-items: center;
  padding-bottom: 2px;
}

.notion-collection-view-tabs-content button {
  padding: 6px 12px;
  border-radius: 4px;
  margin-right: 8px;
  transition: all 180ms ease-in-out;
  background: transparent;
  border: 1px solid transparent;
  font-size: 0.95em;
}

.notion-collection-view-tabs-content button:hover {
  background: rgba(55, 53, 47, 0.08);
  transform: translateY(-1px);
}

.notion-collection-view-tabs-content button.active {
  background: rgba(55, 53, 47, 0.16);
  font-weight: 500;
  border: 1px solid rgba(55, 53, 47, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark-mode .notion-collection-view-tabs {
  border-bottom-color: rgba(255, 255, 255, 0.13);
}

.dark-mode .notion-collection-view-tabs-content button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark-mode .notion-collection-view-tabs-content button.active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.2);
}

/* テーブルビューの改善 */
.notion-table {
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(55, 53, 47, 0.16);
}

.notion-table-view {
  margin-top: 1em;
}

.notion-table-header {
  background: rgba(247, 246, 243, 0.8);
  font-weight: 600;
  padding: 8px 16px;
}

.dark-mode .notion-table-header {
  background: rgba(48, 47, 45, 0.8);
}

.notion-table-header-cell {
  padding: 8px 12px;
}

.notion-table-cell {
  padding: 8px 12px;
  font-size: 0.9em;
}

.notion-table-row {
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  transition: background 120ms ease-in;
}

.notion-table-row:last-child {
  border-bottom: none;
}

.notion-table-row:hover {
  background: rgba(55, 53, 47, 0.03);
}

.dark-mode .notion-table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* デバイス別のメディアクエリ設定 */
/* PC標準 (1025px〜1439px) */
@media only screen and (min-width: 1025px) and (max-width: 1439px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* 3カラム固定 */
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 240px; /* 少し小さめにして3つ並べても見やすくする */
  }
}

/* 大型PC (1440px以上) */
@media only screen and (min-width: 1440px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(4, 1fr); /* 4カラム固定 */
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 220px; /* さらに少し小さめに */
  }
}

/* タブレット (768px〜1024px) */
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 320px; /* タブレット用の高さ調整 */
  }
}

/* スマートフォン (767px以下) */
@media only screen and (max-width: 767px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 280px; /* スマートフォン用の高さ調整 */
  }
  
  .notion-gallery-grid .notion-page-title-text {
    font-size: 1.5em; /* スマートフォン用のフォントサイズ縮小 */
  }
}
</file>

<file path=".editorconfig">
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
</file>

<file path=".env.example">
# ------------------------------------------------------------------------------
# This is an example .env file.
#
# All of these environment vars must be defined either in your environment or in
# a local .env file in order to run this app.
#
# @see https://github.com/rolodato/dotenv-safe for more details.
# ------------------------------------------------------------------------------

# Optional (for fathom analytics)
#NEXT_PUBLIC_FATHOM_ID=

# Optional (for PostHog analytics)
#NEXT_PUBLIC_POSTHOG_ID=

# Optional (for rendering tweets more efficiently)
#TWITTER_ACCESS_TOKEN=

# Optional (for persisting preview images to redis)
# NOTE: if you want to enable redis, only REDIS_HOST and REDIS_PASSWORD are required
# NOTE: don't forget to set isRedisEnabled to true in the site.config.ts file
#REDIS_HOST=
#REDIS_PASSWORD=
#REDIS_USER='default'
#REDIS_NAMESPACE='preview-images'
</file>

<file path=".gitignore">
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# ide
.idea

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.build
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel
</file>

<file path=".prettierignore">
.snapshots/
build/
dist/
node_modules/
.next/
.vercel/

.demo/
.renderer/
</file>

<file path=".prettierrc">
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "semi": false,
  "useTabs": false,
  "tabWidth": 2,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "trailingComma": "none"
}
</file>

<file path=".repomixignore">
# Dependencies
node_modules/
**/node_modules/

# Next.js build output
.next/
out/
build/

# Environment files
.env*
!.env.example

# Version control
.git/
.github/

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Testing
coverage/
.nyc_output/

# Temporary files
temp/
tmp/
*.tmp
*.temp

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml

# Backup files
*.backup
*.bak
*.jpg
*.png
*.gif

# Cache
.cache/
.eslintcache
.prettierCache

# Build files
dist/

# Large font files
lib/fonts/
**/fonts/*.ts
**/fonts/*.js

# Duplicate files
*のコピー*
</file>

<file path="contributing.md">
# Contributing

Suggestions and pull requests are highly encouraged. Have a look at the [open issues](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+sort%3Areactions-%2B1-desc), especially [the easy ones](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+sort%3Areactions-%2B1-desc).

## Development

To develop the project locally, you'll need a recent version of Node.js and `pnpm` installed globally.

To get started, clone the repo and run `pnpm` from the root directory:

```bash
git clone https://github.com/transitive-bullshit/nextjs-notion-starter-kit
cd nextjs-notion-starter-kit
pnpm
```

Now that your dependencies are installed, you can run the local Next.js dev server:

```bash
pnpm dev
```

You should now be able to open `http://localhost:3000` to view the webapp.

## Production

To build for production, you can run:

```bash
pnpm build
```

Which just runs `next build` under the hood.

### Local-linked react-notion-x

If you are making changes to `react-notion-x` and want to test them out with `nextjs-notion-starter-kit`, you'll first need to [set up and build `react-notion-x` locally](https://github.com/NotionX/react-notion-x/blob/master/contributing.md).

Once you have `react-notion-x` set up and built locally, you can link these local deps into `nextjs-notion-starter-kit`:

```bash
pnpm deps:link
```

With this setup, in one tab, you can run `pnpm dev` to keep `react-notion-x` up-to-date, and in another tab, you can run `pnpm dev` to keep `nextjs-notion-starter-kit` up-to-date.

### Gotchas

Whenever you make a change to one of the `react-notion-x` packages, it will automatically be recompiled into its respective `build` folder, and the `pnpm dev` from `nextjs-notion-starter-kit` should hot-reload it in the browser.

Sometimes, this process gets a little out of whack, and if you're not sure what's going on, I usually just quit one or both of the `pnpm dev` commands and restart them.

If you're seeing something unexpected while debugging with Next.js, try running `rm -rf .next` to refresh the Next.js cache before running `pnpm dev` again.
</file>

<file path="eslint.config.cjs">
const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const parser = require('@typescript-eslint/parser')
const next = require('@next/eslint-plugin-next')

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      '.next/**',
      'build/**',
      'node_modules/**',
      'public/**',
      '.github/**',
      '.vscode/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'off' // anyの使用を許可
    }
  },
  {
    plugins: {
      '@next/next': next
    },
    rules: {
      ...next.configs.recommended.rules,
      'react/prop-types': 'off',
      'no-process-env': 'off',
      'array-callback-return': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/anchor-is-valid': 'off'
    }
  }
]
</file>

<file path="license">
MIT License

Copyright (c) 2024 Travis Fischer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</file>

<file path="next-env.d.ts">
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/pages/api-reference/config/typescript for more information.
</file>

<file path="readme.md">
<p align="center">
  <a href="https://transitivebullsh.it/nextjs-notion-starter-kit">
    <img alt="Example article page" src="https://user-images.githubusercontent.com/552829/160132094-12875e09-41ec-450a-80fc-ae8cd488129d.jpg" width="689">
  </a>
</p>

# Next.js Notion Starter Kit

> The perfect starter kit for building websites with Next.js and Notion.

[![Build Status](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/actions/workflows/build.yml/badge.svg)](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/actions/workflows/build.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Intro

This repo is what I use to power my personal blog and portfolio site [transitivebullsh.it](https://transitivebullsh.it).

It uses Notion as a CMS, [react-notion-x](https://github.com/NotionX/react-notion-x), [Next.js](https://nextjs.org/), and [Vercel](https://vercel.com).

## Features

- Setup only takes a few minutes ([single config file](./site.config.ts)) 💪
- Robust support for Notion content via [react-notion-x](https://github.com/NotionX/react-notion-x)
- Built using Next.js, TS, and React
- Excellent page speeds
- Smooth image previews
- Automatic social images
- Automatic pretty URLs
- Automatic table of contents
- Full support for dark mode
- Quick search via CMD+K / CMD+P
- Responsive for different devices
- Optimized for Next.js and Vercel

## Demos

- [Default demo](https://nextjs-notion-starter-kit.transitivebullsh.it) - Deployed from the `main` branch
- [My site](https://transitivebullsh.it) - Deployed from the `transitive-bullshit` branch

## Setup

**All config is defined in [site.config.ts](./site.config.ts).**

This project requires a recent version of Node.js (we recommend >= 16).

1. Fork / clone this repo
2. Change a few values in [site.config.ts](./site.config.ts)
3. `npm install`
4. `npm run dev` to test locally
5. `npm run deploy` to deploy to vercel 💪
6. Double check your [Vercel project settings](#vercel-configuration)

I tried to make configuration as easy as possible — All you really need to do to get started is edit `rootNotionPageId`.

We recommend duplicating the [default page](https://notion.so/7875426197cf461698809def95960ebf) as a starting point, but you can use any public notion page you want.

Make sure your root Notion page is **public** and then copy the link to your clipboard. Extract the last part of the URL that looks like `7875426197cf461698809def95960ebf`, which is your page's Notion ID.

In order to find your Notion workspace ID (optional), just load any of your site's pages into your browser and open up the developer console. There will be a global variable that you can access called `block` which is the Notion data for the current page. If you enter `block.space_id`, it will print out your page's workspace ID.

I recommend setting up a collection on your home page that contains all of your articles / projects / content. There are no structural constraints on your Notion workspace, however, so feel free to add content as you normally would in Notion.

### Vercel Configuration

**Social media preview images won't work by default on Vercel**. You'll need to ensure that your site doesn't require auth.

From your Vercel project settings, you'll want to **disable Vercel Authentication** from `Project -> Settings -> Deployment Protection`.

![How to disable Vercel Deployment Protection setting](https://github.com/user-attachments/assets/a1eb5a1f-da7a-497e-b4f6-f7e851a6cd8a 'How to disable Vercel Deployment Protection setting which causes social media preview image endpoint to return 401 Unauthorized')

💡 If you forget to do this your site will return `401 Unauthorized` responses when crawlers are trying to retrieve the images.

## URL Paths

The app defaults to slightly different URL paths in dev vs prod (though pasting any dev pathname into prod will work and vice-versa).

In development, it will use `/nextjs-notion-blog-d1b5dcf8b9ff425b8aef5ce6f0730202` which is a slugified version of the page's title suffixed with its Notion ID. I've found that it's really useful to always have the Notion Page ID front and center during local development.

In production, it will use `/nextjs-notion-blog` which is a bit nicer as it gets rid of the extra ID clutter.

The mapping of Notion ID to slugified page titles is done automatically as part of the build process. Just keep in mind that if you plan on changing page titles over time, you probably want to make sure old links will still work, and we don't currently provide a solution for detecting old links aside from Next.js's built-in [support for redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects).

See [mapPageUrl](./lib/map-page-url.ts) and [getCanonicalPageId](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-canonical-page-id.ts) for more details.

You can override the default slug generation on a per-page basis by adding a `Slug` text property to your database. Any page which has a `Slug` property will use that as its slug.

NOTE: if you have multiple pages in your workspace with the same slugified name, the app will throw an error letting you know that there are duplicate URL pathnames.

## Preview Images

<p align="center">
  <img alt="Example preview image" src="https://user-images.githubusercontent.com/552829/160142320-35343317-aa9e-4710-bcf7-67e5cdec586d.gif" width="458">
</p>

We use [next/image](https://nextjs.org/docs/api-reference/next/image) to serve images efficiently, with preview images optionally generated via [lqip-modern](https://github.com/transitive-bullshit/lqip-modern). This gives us extremely optimized image support for sexy smooth images.

Preview images are **enabled by default**, but they can be slow to generate, so if you want to disable them, set `isPreviewImageSupportEnabled` to `false` in `site.config.ts`.

### Redis

If you want to cache generated preview images to speed up subsequent builds, you'll need to first set up an external [Redis](https://redis.io) data store. To enable redis caching, set `isRedisEnabled` to `true` in `site.config.ts` and then set `REDIS_HOST` and `REDIS_PASSWORD` environment variables to point to your redis instance.

You can do this locally by adding a `.env` file:

```bash
REDIS_HOST='TODO'
REDIS_PASSWORD='TODO'
```

If you're not sure which Redis provider to use, we recommend [Redis Labs](https://redis.com), which provides a free plan.

Note that preview images and redis caching are both optional features. If you’d rather not deal with them, just disable them in your site config.

## Styles

All CSS styles that customize Notion content are located in [styles/notion.css](./styles/notion.css). They mainly target global CSS classes exported by react-notion-x [styles.css](https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/styles.css).

Every notion block gets its own unique classname, so you can target individual blocks like this:

```css
.notion-block-260baa77f1e1428b97fb14ac99c7c385 {
  display: none;
}
```

## Dark Mode

<p align="center">
  <img alt="Light Mode" src="https://transitive-bs.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F83ea9f0f-4761-4c0b-b53e-1913627975fc%2Ftransitivebullsh.it_-opt.jpg?table=block&id=ed7e8f60-c6d1-449e-840b-5c7762505c44&spaceId=fde5ac74-eea3-4527-8f00-4482710e1af3&width=2000&userId=&cache=v2" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark Mode" src="https://transitive-bs.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fc0839d6c-7141-48df-8afd-69b27fed84aa%2Ftransitivebullsh.it__(1)-opt.jpg?table=block&id=23b11fe5-d6df-422d-9674-39cf7f547523&spaceId=fde5ac74-eea3-4527-8f00-4482710e1af3&width=2000&userId=&cache=v2" width="45%">
</p>

Dark mode is fully supported and can be toggled via the sun / moon icon in the footer.

## Automatic Social Images

<p align="center">
  <img alt="Example social image" src="https://user-images.githubusercontent.com/552829/162001133-34d4cf24-123a-4569-a540-f683b22830d1.jpeg" width="600">
</p>

All Open Graph and social meta tags are generated from your Notion content, which makes social sharing look professional by default.

Social images are generated automatically using [Vercel OG Image Generation](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation). You can tweak the default React template for social images by editing [api/social-images.tsx](./pages/api/social-image.tsx).

You can view an example social image live in production [here](https://transitivebullsh.it/api/social-image?id=dfc7f709-ae3e-42c6-9292-f6543d5586f0).

## Automatic Table of Contents

<p align="center">
  <img alt="Smooth ToC Scrollspy" src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcb2df62d-9028-440b-964b-117711450921%2Ftoc2.gif?table=block&id=d7e9951b-289c-4ff2-8b82-b0a61fe260b1&cache=v2" width="240">
</p>

By default, every article page will have a table of contents displayed as an `aside` on desktop. It uses **scrollspy** logic to automatically update the current section as the user scrolls through your document, and makes it really easy to jump between different sections.

If a page has less than `minTableOfContentsItems` (default 3), the table of contents will be hidden. It is also hidden on the index page and if the browser window is too small.

This table of contents uses the same logic that Notion uses for its built-in Table of Contents block (see [getPageTableOfContents](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts) for the underlying logic).

## Responsive

<p align="center">
  <img alt="Mobile article page" src="https://user-images.githubusercontent.com/552829/160132983-c2dd5830-80b3-4a0e-a8f1-abab5dbeed11.jpg" width="300">
</p>

All pages are designed to be responsive across common device sizes.

## Analytics

Analytics are an optional feature that are easy to enable if you want.

### Fathom Analytics

[Fathom](https://usefathom.com/ref/42TFOZ) provides a lightweight alternative to Google Analytics.

To enable, just add a `NEXT_PUBLIC_FATHOM_ID` environment variable, which will only be used in production.

### PostHog Analytics

[PostHog](https://posthog.com/) provides a lightweight, **open source** alternative to Google Analytics.

To enable, just add a `NEXT_PUBLIC_POSTHOG_ID` environment variable, which will only be used in production.

## Environment Variables

If you're using Redis, analytics, or any other feature which requires environment variables, then you'll need to [add them to your Vercel project](https://vercel.com/docs/concepts/projects/environment-variables).

If you want to test your redis builds with GitHub Actions, then you'll need to edit the [default build action](./.github/workflows/build.yml) to add `REDIS_HOST` and `REDIS_PASSWORD`. Here is an [example from my personal branch](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/transitive-bullshit/.github/workflows/build.yml#L17-L21). You'll also need to add these environment variables to your GitHub repo as [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Contributing

See the [contribution guide](contributing.md) and join our amazing list of [contributors](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/graphs/contributors)!

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my open source work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
</file>

<file path="tsconfig.json">
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "typeRoots": ["./node_modules/@types"],
    "incremental": true,
    "paths": {
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/styles/*": ["styles/*"]
    }
  },
  "exclude": ["node_modules"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "site.config.ts"]
}
</file>

<file path="components/FilterableImageGallery.jsx">
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

<file path="components/FilterableImageGallery.module.css">
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

<file path="components/FilterableImageGallery.tsx">
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

<file path="components/FilterSort.module.css">
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

<file path="components/FontSettingsPanel.jsx">
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

<file path="components/FontStyler.jsx">
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

<file path="components/HamburgerMenu.tsx">
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

<file path="components/NotionPageWithMenu.module.css">
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

<file path="components/NotionPageWithMenu.tsx">
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

<file path="components/SimplifiedSearch.module.css">
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

<file path="components/SimplifiedSearch.tsx">
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

<file path="components/WhatsNewStyling.tsx">
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

<file path="lib/font-customizer/font-settings.js">
// lib/font-customizer/font-settings.js
// デフォルトのフォント設定を定義
export const fontSettings = {
  // タイトル
  title: {
    fontFamily: "'Shippori Mincho', serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&display=swap",
    color: "#333333",
    fontSize: "2.5rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "center", 
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  },
  
  // 見出し1
  heading1: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "2rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  },
  
  // 見出し2
  heading2: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "1.75rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  },
  
  // 見出し3
  heading3: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "1.5rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  },
  
  // テキスト
  text: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "1rem",
    fontWeight: "400",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.03em",
    lineHeight: "1.7"
  },
  
  // トグル
  toggle: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "1rem",
    fontWeight: "400",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.03em",
    lineHeight: "1.7"
  },
  
  // トグル見出し1
  toggleHeading1: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "2rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  },
  
  // トグル見出し2
  toggleHeading2: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "1.75rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  },
  
  // トグル見出し3
  toggleHeading3: {
    fontFamily: "'Noto Sans JP', sans-serif",
    fontImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
    color: "#333333",
    fontSize: "1.5rem",
    fontWeight: "700",
    backgroundColor: "transparent",
    textAlign: "left",
    letterSpacing: "0.02em",
    lineHeight: "1.4"
  }
};
</file>

<file path="lib/font-customizer/font-utils.js">
// lib/font-customizer/font-utils.js
import { fontSettings as defaultSettings } from './font-settings';

// フォント設定からCSSを生成する関数
export function generateFontCSS(settings = defaultSettings) {
  let css = '';
  let fontImports = new Set();
  
  // フォントのインポート部分を抽出
  Object.values(settings).forEach(setting => {
    if (setting.fontImport) {
      fontImports.add(setting.fontImport);
    }
  });
  
  // フォントインポートをCSSに追加
  fontImports.forEach(importUrl => {
    css += `@import url('${importUrl}');\n`;
  });
  
  // 各要素のスタイルを生成
  css += generateElementCSS('.notion-page-title-text', settings.title);
  css += generateElementCSS('.notion-h1', settings.heading1);
  css += generateElementCSS('.notion-h2', settings.heading2);
  css += generateElementCSS('.notion-h3', settings.heading3);
  css += generateElementCSS('.notion-text', settings.text);
  css += generateElementCSS('.notion-toggle', settings.toggle);
  css += generateElementCSS('.notion-toggle.notion-h1', settings.toggleHeading1);
  css += generateElementCSS('.notion-toggle.notion-h2', settings.toggleHeading2);
  css += generateElementCSS('.notion-toggle.notion-h3', settings.toggleHeading3);
  
  return css;
}

// 要素ごとのCSS生成ヘルパー関数
function generateElementCSS(selector, styles) {
  return `
${selector} {
  font-family: ${styles.fontFamily};
  color: ${styles.color};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  background-color: ${styles.backgroundColor};
  text-align: ${styles.textAlign};
  letter-spacing: ${styles.letterSpacing};
  line-height: ${styles.lineHeight};
}
`;
}

// ローカルストレージからフォント設定を読み込む関数
export function loadFontSettingsFromLocalStorage() {
  try {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('fontSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    }
  } catch (error) {
    console.error('フォント設定の読み込みに失敗しました:', error);
  }
  return defaultSettings;
}

// ローカルストレージにフォント設定を保存する関数
export function saveFontSettingsToLocalStorage(settings) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fontSettings', JSON.stringify(settings));
      return true;
    }
  } catch (error) {
    console.error('フォント設定の保存に失敗しました:', error);
  }
  return false;
}
</file>

<file path="lib/client-side-search.ts">
// クライアントサイド検索用のユーティリティ
// これはNotionのAPIでの検索が機能しない場合のフォールバックです

// 簡易的なクライアントサイド検索ロジック
export function clientSideSearch(content: Record<string, any>[], query: string) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return [];
  }
  
  // 空のクエリの場合はすべてを返す
  if (!query || query.trim() === '') {
    return content;
  }
  
  // 検索クエリの正規化
  const normalizedQuery = query.trim().toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/);
  
  // 各ページを検索してスコアリング
  return content
    .map(item => {
      // 検索対象テキストを抽出
      const title = extractText(item.title);
      const description = extractText(item.description);
      const text = extractText(item.text);
      
      // 検索対象のコンテンツ
      const searchableContent = `${title} ${description} ${text}`.toLowerCase();
      
      // スコアリング（単純なヒット数）
      let score = 0;
      for (const term of queryTerms) {
        // 完全一致の場合はより高いスコア
        if (title.toLowerCase().includes(term)) {
          score += 10;
        }
        
        // 通常の一致
        const matches = (searchableContent.match(new RegExp(term, 'g')) || []).length;
        score += matches;
      }
      
      return {
        ...item,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

// テキスト抽出ヘルパー（様々な形式に対応）
function extractText(value: any): string {
  if (!value) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(extractText).join(' ');
  }
  
  if (typeof value === 'object') {
    // Notionの一般的なプロパティ構造
    if (value.plain_text) {
      return value.plain_text;
    }
    
    if (value.title && Array.isArray(value.title)) {
      return value.title.map(extractText).join(' ');
    }
    
    // その他のオブジェクト構造を再帰的に処理
    return Object.values(value).map(extractText).join(' ');
  }
  
  return String(value);
}
</file>

<file path="lib/notion-direct-search.ts">
// 検索専用のシンプルなNotionクライアント実装
// Next.jsではグローバルなfetchが使用可能

// 簡易版Notion APIクライアント（検索専用）
export async function searchNotion(query: string) {
  if (!query || query.trim().length < 2) {
    return { results: [], total: 0 };
  }

  // 環境変数からの設定読み込み
  const notionToken = process.env.NOTION_API_SECRET;
  const rootPageId = process.env.NOTION_PAGE_ID;
  
  // 認証トークンがない場合はエラー
  if (!notionToken) {
    console.error('NOTION_API_SECRET環境変数が設定されていません。');
    return { results: [], total: 0 };
  }
  
  console.log(`検索クエリ: "${query}", 対象ページID: ${rootPageId || '指定なし'}`);
  
  try {
    // Notion APIのエンドポイント
    const url = 'https://api.notion.com/v1/search';
    
    // リクエストボディ
    const body = {
      query: query.trim(),
      page_size: 20,
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      }
    };
    
    // 特定のページIDが指定されている場合、検索対象を制限
    if (rootPageId) {
      body['filter'] = {
        value: 'page',
        property: 'object'
      };
    }
    
    // APIリクエスト
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    // レスポンスのステータスコードをチェック
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Notion API エラー: ${response.status} ${response.statusText}`, errorText);
      return { results: [], total: 0 };
    }
    
    // レスポンスをJSONとしてパース
    const data = await response.json();
    
    console.log(`検索結果: ${data.results?.length || 0}件`);
    
    // 検索結果を返す（最初の2件のみ詳細をログに出力）
    if (data.results?.length > 0) {
      console.log('検索結果サンプル:', 
        JSON.stringify(data.results.slice(0, 2).map(r => ({
          id: r.id,
          url: r.url,
          title: r.properties?.title?.title?.[0]?.plain_text || r.title?.[0]?.[0] || '無題'
        })), null, 2)
      );
    }
    
    return data;
  } catch (error) {
    console.error('Notion検索エラー:', error);
    return { results: [], total: 0 };
  }
}
</file>

<file path="lib/notion-views.ts">
import { ViewTab } from '../components/NotionViewTabs';

// Notionのメインデータベースビュー設定
// 注意: 実際のNotionビューIDとページIDに置き換えてください
export const notionViews: ViewTab[] = [
  { 
    id: 'all', 
    name: 'すべて', 
    path: '/', 
    // メインページID（site.config.tsのrootNotionPageIdと同じ）
    pageId: '1ceb802cb0c680f29369dba86095fb38'
  },
  { 
    id: 'blog', 
    name: 'ブログ', 
    path: '/view/blog',
    // ブログカテゴリのビューID（Notionで作成したビューのID）
    pageId: '1ceb802cb0c680f29369dba86095fb38?v=xxxxxxxxxxxx' // 実際のビューIDに置き換え
  },
  { 
    id: 'website', 
    name: 'Webサイト', 
    path: '/view/website',
    pageId: '1ceb802cb0c680f29369dba86095fb38?v=xxxxxxxxxxxx' // 実際のビューIDに置き換え
  },
  { 
    id: 'profile', 
    name: 'プロフィール', 
    path: '/view/profile',
    pageId: '1ceb802cb0c680f29369dba86095fb38?v=xxxxxxxxxxxx' // 実際のビューIDに置き換え
  },
  { 
    id: 'new', 
    name: '新着順', 
    path: '/view/new',
    pageId: '1ceb802cb0c680f29369dba86095fb38?v=xxxxxxxxxxxx' // 実際のビューIDに置き換え
  }
];

// 各ビューIDとページIDのマッピング
export const viewPageIds: Record<string, string> = notionViews.reduce((acc, view) => {
  if (view.id !== 'all') {
    acc[view.id] = view.pageId || '';
  }
  return acc;
}, {} as Record<string, string>);
</file>

<file path="lib/preview-images.ts">
import ky from 'ky'
// import lqip from 'lqip-modern' // 一時的に無効化
import {
  type ExtendedRecordMap,
  type PreviewImage,
  type PreviewImageMap
} from 'notion-types'
import { getPageImageUrls, normalizeUrl } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

import { defaultPageCover, defaultPageIcon } from './config'
import { db } from './db'
import { mapImageUrl } from './map-image-url'

export async function getPreviewImageMap(
  recordMap: ExtendedRecordMap
): Promise<PreviewImageMap> {
  const urls: string[] = getPageImageUrls(recordMap, {
    mapImageUrl
  })
    .concat([defaultPageIcon, defaultPageCover])
    .filter(Boolean)

  const previewImagesMap = Object.fromEntries(
    await pMap(
      urls,
      async (url) => {
        const cacheKey = normalizeUrl(url)
        return [cacheKey, await getPreviewImage(url, { cacheKey })]
      },
      {
        concurrency: 8
      }
    )
  )

  return previewImagesMap
}

async function createPreviewImage(
  url: string,
  { cacheKey }: { cacheKey: string }
): Promise<PreviewImage | null> {
  try {
    try {
      const cachedPreviewImage = await db.get(cacheKey)
      if (cachedPreviewImage) {
        return cachedPreviewImage
      }
    } catch (err) {
      // ignore redis errors
      console.warn(`redis error get "${cacheKey}"`, err.message)
    }

    const body = await ky(url).arrayBuffer()
    // const result = await lqip(body)
    // console.log('lqip', { ...result.metadata, url, cacheKey })

    // 一時的にダミーデータを返す
    const previewImage = {
      originalWidth: 1200,
      originalHeight: 630,
      dataURIBase64: ''
    }

    try {
      await db.set(cacheKey, previewImage)
    } catch (err) {
      // ignore redis errors
      console.warn(`redis error set "${cacheKey}"`, err.message)
    }

    return previewImage
  } catch (err) {
    console.warn('failed to create preview image', url, err.message)
    return null
  }
}

export const getPreviewImage = pMemoize(createPreviewImage)
</file>

<file path="pages/admin/font-settings.jsx">
// pages/admin/font-settings.jsx
import FontSettingsPanel from '../../components/FontSettingsPanel';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 簡易的な管理画面パスワード（本番環境では.envファイルなどで管理することをお勧めします）
const ADMIN_PASSWORD = 'cafeinesi2024';

export default function FontSettingsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 簡易的な管理者認証
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const adminPassword = localStorage.getItem('adminPassword');
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsLoading(false);
    } else {
      const password = prompt('管理者パスワードを入力してください:');
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminPassword', password);
        setIsAdmin(true);
      } else {
        alert('パスワードが正しくありません');
        window.location.href = '/';
      }
      setIsLoading(false);
    }
  }, []);
  
  if (isLoading) return <div className="p-8 text-center">読み込み中...</div>;
  if (!isAdmin) return <div className="p-8 text-center">アクセス権限がありません</div>;
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Head>
        <title>フォント設定 - Notion-Effect-Blog</title>
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-800">フォント設定管理</h1>
          <Link href="/" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700 transition-colors">
            ホームに戻る
          </Link>
        </div>
        
        <FontSettingsPanel />
        
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Notion-Effect-Blog</p>
        </div>
      </div>
    </div>
  );
}
</file>

<file path="pages/api/direct-search.ts">
// このファイルはNotion公式APIを使った検索エンドポイント
import { type NextApiRequest, type NextApiResponse } from 'next'
import { searchNotion } from '@/lib/notion-direct-search'

export default async function directSearch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS (プリフライト) リクエストには200を返す
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // リクエスト内容を確認
    console.log('Direct Search API: リクエスト本文', JSON.stringify(req.body, null, 2));
    
    // 検索クエリ取得
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // 環境変数チェック
    console.log('環境変数:', {
      NOTION_API_SECRET: process.env.NOTION_API_SECRET ? '設定済み' : '未設定',
      NOTION_PAGE_ID: process.env.NOTION_PAGE_ID
    });
    
    // 検索実行
    console.log(`検索実行: "${query}"`);
    const results = await searchNotion(query);
    
    // 結果をログに出力
    console.log('検索結果概要:', {
      total: results.total || 0,
      count: results.results?.length || 0
    });
    
    // 結果を返す
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
    );
    res.status(200).json(results);
  } catch (error) {
    console.error('Direct search API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
</file>

<file path="pages/api/fallback-search.ts">
// ハードコードされた検索結果を提供するAPI（NotionのAPIが機能しない場合のフォールバック）
import { type NextApiRequest, type NextApiResponse } from 'next'

export default async function fallbackSearch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // 検索クエリ取得
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // 標準的なサンプルコンテンツ（デモ用）
    const demoContent = [
      {
        id: 'page1',
        title: 'カフェでのキネシオロジー入門',
        url: 'https://notion-effect-blog2.vercel.app/',
        description: 'キネシオロジーとは何か、基本的な考え方と実践方法について解説します。',
        object: 'page'
      },
      {
        id: 'page2',
        title: 'リラクゼーションテクニック',
        url: 'https://notion-effect-blog2.vercel.app/',
        description: '日常で簡単に実践できるリラクゼーション方法を紹介します。',
        object: 'page'
      },
      {
        id: 'page3',
        title: 'マインドフルネスと瞑想',
        url: 'https://notion-effect-blog2.vercel.app/',
        description: '集中力を高め、ストレスを軽減するためのテクニックについて解説します。',
        object: 'page'
      },
      {
        id: 'page4',
        title: '筋肉テスト基礎講座',
        url: 'https://notion-effect-blog2.vercel.app/',
        description: 'キネシオロジーにおける筋肉テストの基本と応用について学びます。',
        object: 'page'
      },
      {
        id: 'page5',
        title: 'エネルギーバランスの調整法',
        url: 'https://notion-effect-blog2.vercel.app/',
        description: '体のエネルギーバランスを整えるための実践的な方法を紹介します。',
        object: 'page'
      }
    ];

    // 非常にシンプルな検索ロジック
    const normalizedQuery = query.toLowerCase().trim();
    const results = demoContent.filter(item => 
      item.title.toLowerCase().includes(normalizedQuery) || 
      item.description.toLowerCase().includes(normalizedQuery)
    );

    // 検索統計情報
    console.log(`フォールバック検索: "${query}" の結果が ${results.length} 件見つかりました`);

    // Notionの検索結果形式に合わせる
    res.status(200).json({
      results: results,
      next_cursor: null,
      has_more: false,
      type: 'page',
      page: {}
    });
  } catch (error) {
    console.error('フォールバック検索エラー:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
</file>

<file path="pages/api/font-settings.js">
// pages/api/font-settings.js
import fs from 'fs';
import path from 'path';
import { fontSettings as defaultSettings } from '../../lib/font-customizer/font-settings';

// font-settings.jsonのパスを設定
const configPath = path.join(process.cwd(), 'font-settings.json');

export default async function handler(req, res) {
  // GET: 設定を読み込む
  if (req.method === 'GET') {
    try {
      if (fs.existsSync(configPath)) {
        const settings = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return res.status(200).json(settings);
      } else {
        // デフォルト設定を返す
        return res.status(200).json(defaultSettings);
      }
    } catch (error) {
      console.error('設定読み込みエラー:', error);
      return res.status(500).json({ error: '設定の読み込みに失敗しました' });
    }
  }
  
  // POST: 設定を保存する
  if (req.method === 'POST') {
    try {
      // リクエストボディから設定を取得
      const settings = req.body;
      
      // JSONファイルに保存
      fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), 'utf8');
      
      return res.status(200).json({ success: true, message: '設定が保存されました' });
    } catch (error) {
      console.error('設定保存エラー:', error);
      return res.status(500).json({ error: '設定の保存に失敗しました' });
    }
  }
  
  // サポートされていないメソッド
  return res.status(405).end('Method Not Allowed');
}
</file>

<file path="pages/api/test-notion-connection.ts">
// Notionとの接続をテストするための最もシンプルなエンドポイント
import { type NextApiRequest, type NextApiResponse } from 'next'

export default async function testNotionConnection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // 環境変数の確認
    const apiKey = process.env.NOTION_API_SECRET;
    const pageId = process.env.NOTION_PAGE_ID;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'NOTION_API_SECRET環境変数が設定されていません' 
      });
    }
    
    // 非常にシンプルなリクエストをNotionのAPIに送信する
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: '', // 空のクエリは全ての閲覧可能なページを返す
        page_size: 1 // 1つだけ結果を取得
      })
    });
    
    // レスポンスのステータスコードをチェック
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Notion API Error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }
    
    // 正常なレスポンスをパース
    const data = await response.json();
    
    // 簡易的なレスポンスを返す
    res.status(200).json({
      status: 'success',
      message: 'Notion APIに正常に接続できました',
      apiKeyIsValid: true,
      resultsCount: data.results?.length || 0,
      pageIdConfigured: !!pageId,
      pageId: pageId ? `${pageId.substring(0, 6)}...` : null,
      firstResult: data.results?.[0] ? {
        id: data.results[0].id,
        object: data.results[0].object,
        hasUrl: !!data.results[0].url
      } : null
    });
  } catch (error) {
    console.error('Notion接続テストエラー:', error);
    res.status(500).json({
      error: 'Notion APIとの接続中にエラーが発生しました',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
</file>

<file path="pages/api/test-search.ts">
// このファイルはNotion検索機能のテスト用APIです
import { type NextApiRequest, type NextApiResponse } from 'next'
import { NotionAPI } from 'notion-client'

export default async function testSearch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'Method not allowed. Use GET.' })
  }

  try {
    // 環境変数と接続情報
    const info = {
      notionPageId: process.env.NOTION_PAGE_ID,
      notionApiSecret: process.env.NOTION_API_SECRET ? '設定されています' : '設定されていません',
      apiBaseUrl: process.env.NOTION_API_BASE_URL || 'https://www.notion.so/api/v3'
    }

    // Notionクライアントを初期化
    const notion = new NotionAPI({
      apiBaseUrl: process.env.NOTION_API_BASE_URL || 'https://www.notion.so/api/v3',
      authToken: process.env.NOTION_API_SECRET
    })

    // シンプルな検索を実行
    const results = await notion.search({
      query: 'test', // シンプルなテスト検索
      ancestorId: undefined, // rootページを指定しない
      filters: {
        isDeletedOnly: false,
        excludeTemplates: true,
        isNavigableOnly: false,
        requireEditPermissions: false,
      },
      limit: 10
    })

    // 結果を返す
    res.status(200).json({
      info,
      searchResultsCount: results.results?.length || 0,
      hasResults: (results.results?.length || 0) > 0,
      hasRecordMap: !!results.recordMap,
      // サンプル結果（最初の2件のみ）
      sampleResults: results.results?.slice(0, 2) || []
    })
  } catch (error) {
    console.error('Test search error:', error)
    res.status(500).json({
      error: 'Search test error',
      message: error.message,
      stack: error.stack
    })
  }
}
</file>

<file path="pages/view/[view].tsx">
import { GetStaticProps, GetStaticPaths } from 'next';
import { NotionPage } from '@/components/NotionPage';
import NotionViewTabs from '@/components/NotionViewTabs';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { notionViews, viewPageIds } from '@/lib/notion-views';

// 静的パスの生成
export const getStaticPaths: GetStaticPaths = async () => {
  // notionViews から 'all' 以外のビューのIDを取得
  const paths = notionViews
    .filter(view => view.id !== 'all')
    .map(view => ({
      params: { view: view.id }
    }));

  return {
    paths,
    fallback: false // 未定義のパスは404に
  };
};

// 各ビューのプロパティを取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const viewId = params?.view as string;
  const pageId = viewPageIds[viewId];

  if (!pageId) {
    // 該当するビューIDがない場合はエラー
    return {
      notFound: true
    };
  }

  try {
    // Notionページのデータを取得
    const props = await resolveNotionPage(pageId);
    return { 
      props,
      revalidate: 10 // ISRを有効化（10秒ごとに再検証）
    };
  } catch (err) {
    console.error('page error', viewId, err);
    throw err;
  }
};

// ビュー別ページコンポーネント
export default function ViewPage(props) {
  return (
    <>
      <NotionViewTabs tabs={notionViews} />
      <NotionPage {...props} />
    </>
  );
}
</file>

<file path="styles/prism-theme.css">
/* prism theme adjustments */

.notion-code {
  background-color: rgba(249, 250, 251, 1);
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 0.5rem;
  padding: 1.5em !important;
  margin: 1.5em 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

/* コードブロックの右上に言語名を表示 */
.notion-code::before {
  content: attr(data-language);
  position: absolute;
  top: 0;
  right: 0;
  color: rgba(156, 163, 175, 1);
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(229, 231, 235, 0.5);
  padding: 0.25rem 0.5rem;
  border-bottom-left-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* ホバー時の効果 */
.notion-code:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark-mode .notion-code {
  background-color: rgba(17, 24, 39, 1);
  border-color: rgba(55, 65, 81, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

/* ダークモード時のコードブロック言語表示 */
.dark-mode .notion-code::before {
  background: rgba(55, 65, 81, 0.7);
  color: rgba(209, 213, 219, 1);
}

/* ダークモード時のホバー効果 */
.dark-mode .notion-code:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.notion code {
  color: rgba(31, 41, 55, 1);
  border: 0 none !important;
  box-shadow: none !important;
  background: none !important;
  padding: 0 !important;
}
.dark-mode .notion code {
  color: rgba(229, 231, 235, 1);
}

.dark-mode .notion .notion-inline-code {
  background: rgb(71, 76, 80) !important;
  color: #ff4081;
  padding: 0.2em 0.4em !important;
}

.notion .notion-inline-code {
  color: #ff4081;
  background: rgba(127, 122, 107, 0.1) !important;
  padding: 0.2em 0.4em !important;
}

.token.cdata,
.token.doctype,
.token.prolog {
  color: rgba(55, 65, 81, 1);
}
.token.comment {
  color: #5b9b4c;
}
.dark-mode .token.cdata,
.dark-mode .token.doctype,
.dark-mode .token.prolog {
  color: rgba(209, 213, 219, 1);
}
.token.punctuation {
  color: rgba(55, 65, 81, 1);
}
.dark-mode .token.punctuation {
  color: rgba(209, 213, 219, 1);
}
.token.boolean,
.token.constant,
.token.deleted,
.token.number,
.token.property,
.token.symbol,
.token.tag {
  color: rgba(16, 185, 129, 1);
}
.token.attr-name,
.token.builtin,
.token.char,
.token.inserted,
.token.selector,
.token.string {
  color: rgba(139, 92, 246, 1);
}
.language-css .token.string,
.style .token.string,
.token.entity,
.token.operator,
.token.url {
  color: rgba(245, 158, 11, 1);
}
.token.atrule,
.token.attr-value,
.token.keyword {
  color: rgba(59, 130, 246, 1);
}
.token.class-name,
.token.function {
  color: rgba(236, 72, 153, 1);
}
.token.important,
.token.regex,
.token.variable {
  color: rgba(245, 158, 11, 1);
}
code[class*='language-'],
pre[class*='language-'] {
  color: rgba(31, 41, 55, 1);
}
.dark-mode code[class*='language-'],
.dark-mode pre[class*='language-'] {
  color: rgba(249, 250, 251, 1);
}
pre::-webkit-scrollbar {
  display: none;
}
pre {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.token.operator,
.token.entity,
.token.url,
.token.variable {
  background: none;
}

pre[class*='language-'] > code {
  border-left: 0 none !important;
  box-shadow: none !important;
  background: none !important;
}

pre[class*='language-']:before,
pre[class*='language-']:after {
  display: none !important;
}
</file>

<file path=".eslintignore">
.next
build
node_modules
public
.github
.vscode
package-lock.json
pnpm-lock.yaml
</file>

<file path=".eslintrc.json">
{
  "root": true,
  "extends": ["@fisch0920/eslint-config"],
  "rules": {
    "react/prop-types": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/filename-case": "off",
    "no-process-env": "off",
    "array-callback-return": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/media-has-caption": "off",
    "jsx-a11y/interactive-supports-focus": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "@typescript-eslint/naming-convention": "off"
  }
}
</file>

<file path=".gitattributes">
# Auto detect text files and perform LF normalization
* text=auto
</file>

<file path="components/CategoryFilterButton.module.css">
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

<file path="components/CategoryFilterButton.tsx">
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

<file path="components/HamburgerMenu.module.css">
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

<file path="components/HeaderMenu.module.css">
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

<file path="components/HeaderMenu.tsx">
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

<file path="components/PageAside.tsx">
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

<file path="lib/config.ts">
/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.ts" as well as environment variables
 * for optional depenencies.
 */
import { parsePageId } from 'notion-utils'
import { type PostHogConfig } from 'posthog-js'

import { getEnv, getSiteConfig } from './get-config-value'
import { type NavigationLink } from './site-config'
import {
  type NavigationStyle,
  type PageUrlOverridesInverseMap,
  type PageUrlOverridesMap,
  type Site
} from './types'

export const rootNotionPageId: string = parsePageId(
  getSiteConfig('rootNotionPageId'),
  { uuid: false }
)

if (!rootNotionPageId) {
  throw new Error('Config error invalid "rootNotionPageId"')
}

// if you want to restrict pages to a single notion workspace (optional)
export const rootNotionSpaceId: string | null = parsePageId(
  getSiteConfig('rootNotionSpaceId', null),
  { uuid: true }
)

export const pageUrlOverrides = cleanPageUrlMap(
  getSiteConfig('pageUrlOverrides', {}) || {},
  { label: 'pageUrlOverrides' }
)

export const pageUrlAdditions = cleanPageUrlMap(
  getSiteConfig('pageUrlAdditions', {}) || {},
  { label: 'pageUrlAdditions' }
)

export const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides)

export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'

// general site config
export const name: string = getSiteConfig('name')
export const author: string = getSiteConfig('author')
export const domain: string = getSiteConfig('domain')
export const description: string = getSiteConfig('description', 'Notion Blog')
export const language: string = getSiteConfig('language', 'en')

// social accounts
export const twitter: string | null = getSiteConfig('twitter', null)
export const mastodon: string | null = getSiteConfig('mastodon', null)
export const github: string | null = getSiteConfig('github', null)
export const youtube: string | null = getSiteConfig('youtube', null)
export const linkedin: string | null = getSiteConfig('linkedin', null)
export const instagram: string | null = getSiteConfig('instagram', null)
export const facebook: string | null = getSiteConfig('facebook', null)
export const newsletter: string | null = getSiteConfig('newsletter', null)
export const zhihu: string | null = getSiteConfig('zhihu', null)

export const getMastodonHandle = (): string | null => {
  if (!mastodon) {
    return null
  }

  // Since Mastodon is decentralized, handles include the instance domain name.
  // e.g. @example@mastodon.social
  const url = new URL(mastodon)
  return `${url.pathname.slice(1)}@${url.hostname}`
}

// default notion values for site-wide consistency (optional; may be overridden on a per-page basis)
export const defaultPageIcon: string | null = getSiteConfig(
  'defaultPageIcon',
  null
)
export const defaultPageCover: string | null = getSiteConfig(
  'defaultPageCover',
  null
)
export const defaultPageCoverPosition: number = getSiteConfig(
  'defaultPageCoverPosition',
  0.5
)

// Optional whether or not to enable support for LQIP preview images
export const isPreviewImageSupportEnabled: boolean = getSiteConfig(
  'isPreviewImageSupportEnabled',
  false
)

// Optional whether or not to include the Notion ID in page URLs or just use slugs
export const includeNotionIdInUrls: boolean = getSiteConfig(
  'includeNotionIdInUrls',
  !!isDev
)

export const navigationStyle: NavigationStyle = getSiteConfig(
  'navigationStyle',
  'default'
)

export const navigationLinks: Array<NavigationLink | null> = getSiteConfig(
  'navigationLinks',
  null
)

// Optional site search
export const isSearchEnabled: boolean = getSiteConfig('isSearchEnabled', true)

// ----------------------------------------------------------------------------

// Optional redis instance for persisting preview images
export const isRedisEnabled: boolean =
  getSiteConfig('isRedisEnabled', false) || !!getEnv('REDIS_ENABLED', null)

// (if you want to enable redis, only REDIS_HOST and REDIS_PASSWORD are required)
// we recommend that you store these in a local `.env` file
export const redisHost: string | null = getEnv('REDIS_HOST', null)
export const redisPassword: string | null = getEnv('REDIS_PASSWORD', null)
export const redisUser: string = getEnv('REDIS_USER', 'default')
export const redisUrl = getEnv(
  'REDIS_URL',
  `redis://${redisUser}:${redisPassword}@${redisHost}`
)
export const redisNamespace: string | null = getEnv(
  'REDIS_NAMESPACE',
  'preview-images'
)

// ----------------------------------------------------------------------------

export const isServer = typeof window === 'undefined'

export const port = getEnv('PORT', '3000')
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`
export const apiHost = isDev
  ? host
  : `https://${process.env.VERCEL_URL || domain}`

export const apiBaseUrl = `/api`

export const api = {
  searchNotion: `${apiBaseUrl}/search-notion`,
  getNotionPageInfo: `${apiBaseUrl}/notion-page-info`,
  getSocialImage: `${apiBaseUrl}/social-image`,
  notionPageId: process.env.NOTION_PAGE_ID  // NOTION_PAGE_IDを追加
}

// ----------------------------------------------------------------------------

export const site: Site = {
  domain,
  name,
  rootNotionPageId,
  rootNotionSpaceId,
  description
}

export const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID
export const fathomConfig = fathomId
  ? {
      excludedDomains: ['localhost', 'localhost:3000']
    }
  : undefined

export const posthogId = process.env.NEXT_PUBLIC_POSTHOG_ID
export const posthogConfig: Partial<PostHogConfig> = {
  api_host: 'https://app.posthog.com'
}

function cleanPageUrlMap(
  pageUrlMap: PageUrlOverridesMap,
  {
    label
  }: {
    label: string
  }
): PageUrlOverridesMap {
  return Object.keys(pageUrlMap).reduce((acc, uri) => {
    const pageId = pageUrlMap[uri]
    const uuid = parsePageId(pageId, { uuid: false })

    if (!uuid) {
      throw new Error(`Invalid ${label} page id "${pageId}"`)
    }

    if (!uri) {
      throw new Error(`Missing ${label} value for page "${pageId}"`)
    }

    if (!uri.startsWith('/')) {
      throw new Error(
        `Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`
      )
    }

    const path = uri.slice(1)

    return {
      ...acc,
      [path]: uuid
    }
  }, {})
}

function invertPageUrlOverrides(
  pageUrlOverrides: PageUrlOverridesMap
): PageUrlOverridesInverseMap {
  return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
    const pageId = pageUrlOverrides[uri]

    return {
      ...acc,
      [pageId]: uri
    }
  }, {})
}
</file>

<file path="lib/get-menu-items.ts">
import { ExtendedRecordMap } from 'notion-types'
import { getPageProperty } from 'notion-utils'
import { ViewTab } from '../components/NotionViewTabs'

/**
 * Notionデータベースから「Menu」チェックボックスがオンのページを取得
 * tabs形式で返す
 */
export function getMenuItemsFromNotion(recordMap: ExtendedRecordMap): ViewTab[] {
  if (!recordMap || !recordMap.collection) {
    return []
  }

  try {
    // 基本のすべて表示タブ
    const tabs: ViewTab[] = [
      { id: 'all', name: 'すべて', path: '/', pageId: 'all' }
    ]
    
    // コレクションを探す（カフェキネシコンテンツDB）
    const collections = Object.values(recordMap.collection)
    
    for (const collection of collections) {
      const collectionValue = collection.value
      if (!collectionValue || !collectionValue.schema) continue
      
      // Menuプロパティを探す
      const menuPropId = Object.entries(collectionValue.schema).find(
        ([_, prop]: [string, any]) => 
          prop.name === 'Menu' && 
          prop.type === 'checkbox'
      )?.[0]
      
      if (!menuPropId) continue
      
      // タイトルプロパティを探す
      const titlePropId = Object.entries(collectionValue.schema).find(
        ([_, prop]: [string, any]) => prop.type === 'title'
      )?.[0]
      
      if (!titlePropId) continue
      
      // コレクションに属するページを探す
      for (const [blockId, block] of Object.entries(recordMap.block)) {
        const blockValue = block.value
        
        // ページタイプのブロックで、このコレクションに属しているものを探す
        if (
          blockValue?.type === 'page' && 
          blockValue?.parent_table === 'collection' && 
          blockValue?.parent_id === collectionValue.id
        ) {
          // Menuチェックボックスの値を取得
          const menuChecked = getPageProperty(menuPropId, blockValue, recordMap)
          
          // Menuがチェックされている場合
          if (menuChecked === 'Yes' || menuChecked === 'true' || menuChecked === true) {
            // タイトルを取得
            const title = getPageProperty(titlePropId, blockValue, recordMap)
            
            if (title) {
              // URLスラッグを作成（ページのタイトルから）
              const slug = String(title)
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
              
              // タブを追加
              tabs.push({
                id: blockId,
                name: String(title),
                path: `/page/${blockId.replace(/-/g, '')}`,
                pageId: blockId
              })
            }
          }
        }
      }
    }
    
    return tabs
  } catch (error) {
    console.error('Error extracting menu items from Notion:', error)
    return [{ id: 'all', name: 'すべて', path: '/', pageId: 'all' }]
  }
}
</file>

<file path="lib/get-site-map.ts">
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
</file>

<file path="lib/map-page-url.ts">
import { type ExtendedRecordMap } from 'notion-types'
import { parsePageId, uuidToId } from 'notion-utils'

import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'
import { type Site } from './types'

// include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)
const uuid = !!includeNotionIdInUrls

export const mapPageUrl =
  (site: Site, recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
  (pageId = '') => {
    const pageUuid = parsePageId(pageId, { uuid: true })

    if (uuidToId(pageUuid) === site.rootNotionPageId) {
      return createUrl('/', searchParams)
    } else {
      return createUrl(
        `/${getCanonicalPageId(pageUuid, recordMap, { uuid })}`,
        searchParams
      )
    }
  }

export const getCanonicalPageUrl =
  (site: Site, recordMap: ExtendedRecordMap) =>
  (pageId = '') => {
    const pageUuid = parsePageId(pageId, { uuid: true })

    if (uuidToId(pageId) === site.rootNotionPageId) {
      return `https://${site.domain}`
    } else {
      return `https://${site.domain}/${getCanonicalPageId(pageUuid, recordMap, {
        uuid
      })}`
    }
  }

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
</file>

<file path="lib/notion-utils.ts">
import { getPageProperty } from 'notion-utils'

// Notionページからカテゴリを抽出する関数
export function extractCategories(recordMap: any): string[] {
  if (!recordMap || !recordMap.collection) {
    return []
  }

  try {
    // コレクションからスキーマ情報を取得
    const collectionValues = Object.values(recordMap.collection) as Array<{value: any}>
    const collection = collectionValues[0]?.value
    if (!collection || !collection.schema) {
      return []
    }

    // カテゴリとしてマークされたプロパティを探す（通常は 'select' タイプ）
    const categoryProp = Object.entries(collection.schema).find(
      ([_, value]: [string, any]) => {
        return (value as any).name.toLowerCase() === 'category' || 
               (value as any).name.toLowerCase() === 'カテゴリ'
      }
    )

    if (!categoryProp) {
      // バックアップ：タグやタイプなど他の選択系プロパティを探す
      const selectProps = Object.entries(collection.schema).filter(
        ([_, value]: [string, any]) => (value as any).type === 'select'
      )
      
      if (selectProps.length > 0) {
        const firstSelectProp = selectProps[0]
        
        const categoryPropId = firstSelectProp[0]
        // ページのブロックからカテゴリ値を抽出
        const categories = new Set<string>()
        
        Object.values(recordMap.block).forEach((block: any) => {
          if (block.value && block.value.properties) {
            const category = getPageProperty(categoryPropId, block.value, recordMap)
            if (category && typeof category === 'string') {
              categories.add(category)
            }
          }
        })
        
        return Array.from(categories).sort()
      }
      
      return []
    }

    const categoryPropId = categoryProp[0]

    // ページのブロックからカテゴリ値を抽出
    const categories = new Set<string>()
    
    Object.values(recordMap.block).forEach((block: any) => {
      if (block.value && block.value.properties) {
        const category = getPageProperty(categoryPropId, block.value, recordMap)
        if (category && typeof category === 'string') {
          categories.add(category)
        }
      }
    })

    return Array.from(categories).sort()
  } catch (err) {
    console.error('Failed to extract categories:', err)
    return []
  }
}

// Notionブロック配列からカテゴリを抽出
export function getPageCategory(page: any, recordMap: any): string {
  if (!page || !recordMap || !recordMap.collection) {
    return ''
  }
  
  try {
    // コレクションからスキーマ情報を取得
    const collectionValues = Object.values(recordMap.collection) as Array<{value: any}>
    const collection = collectionValues[0]?.value
    if (!collection || !collection.schema) {
      return ''
    }

    // カテゴリプロパティを見つける
    const categoryProp = Object.entries(collection.schema).find(
      ([_, value]: [string, any]) => 
        value.name.toLowerCase() === 'category' || 
        value.name.toLowerCase() === 'カテゴリ'
    )

    if (!categoryProp) {
      // バックアップ：最初のセレクトタイプのプロパティを使用
      const selectProps = Object.entries(collection.schema).filter(
        ([_, value]: [string, any]) => value.type === 'select'
      )
      
      if (selectProps.length > 0) {
        const fallbackProp = selectProps[0]
        
        const fallbackPropId = fallbackProp[0]
        const fallbackCategory = getPageProperty(fallbackPropId, page, recordMap)
        return fallbackCategory ? fallbackCategory.toString() : ''
      }
      
      return ''
    }

    const categoryPropId = categoryProp[0]
    
    // ページのカテゴリを取得
    const category = getPageProperty(categoryPropId, page, recordMap)
    return category ? category.toString() : ''
  } catch (err) {
    console.error('Failed to get page category:', err)
    return ''
  }
}

// ページの作成日を取得
export function getPageCreationTime(page: any): string {
  if (!page) return ''
  
  try {
    return page.created_time || ''
  } catch (err) {
    console.error('Failed to get page creation time:', err)
    return ''
  }
}

// ページをソートする関数
export function sortPages(pages: any[], sortOrder: string, recordMap: any): any[] {
  if (!pages || !pages.length) return []
  
  const sortedPages = [...pages]
  
  switch (sortOrder) {
    case 'newest':
      sortedPages.sort((a, b) => {
        const dateA = new Date(getPageCreationTime(a)).getTime()
        const dateB = new Date(getPageCreationTime(b)).getTime()
        return dateB - dateA
      })
      break
      
    case 'oldest':
      sortedPages.sort((a, b) => {
        const dateA = new Date(getPageCreationTime(a)).getTime()
        const dateB = new Date(getPageCreationTime(b)).getTime()
        return dateA - dateB
      })
      break
      
    case 'title_asc':
      sortedPages.sort((a, b) => {
        const titleA = a.title || ''
        const titleB = b.title || ''
        return titleA.localeCompare(titleB)
      })
      break
      
    case 'title_desc':
      sortedPages.sort((a, b) => {
        const titleA = a.title || ''
        const titleB = b.title || ''
        return titleB.localeCompare(titleA)
      })
      break
      
    default:
      // デフォルトは新しい順
      sortedPages.sort((a, b) => {
        const dateA = new Date(getPageCreationTime(a)).getTime()
        const dateB = new Date(getPageCreationTime(b)).getTime()
        return dateB - dateA
      })
  }
  
  return sortedPages
}

// カテゴリでページをフィルタリングする関数
export function filterPagesByCategory(pages: any[], category: string, recordMap: any): any[] {
  if (!pages || !pages.length) {
    return []
  }
  if (!category) {
    return pages
  }
  
  return pages.filter(page => {
    const pageCategory = getPageCategory(page, recordMap)
    return pageCategory === category
  })
}
</file>

<file path="components/NotionViewTabs.tsx">
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

<file path="lib/add-home-link.ts">
// ページタイトルに自動的にホームリンクを追加するスクリプト
export function addHomeLinkToPageTitle() {
  if (typeof window === 'undefined') return; // サーバーサイドでは実行しない

  // DOMが読み込まれるのを待つ
  const addLink = () => {
    // ページタイトル要素を取得
    const pageTitleElement = document.querySelector('.notion-page-title-text');
    if (!pageTitleElement) {
      // 要素が見つからない場合は少し待ってから再試行
      setTimeout(addLink, 100);
      return;
    }

    // すでにリンクが設定されている場合は何もしない
    if (pageTitleElement.parentElement?.tagName === 'A') return;

    // リンク要素を作成
    const linkElement = document.createElement('a');
    linkElement.href = '/';
    linkElement.title = 'ホームに戻る';
    
    // クリックイベントを追加
    linkElement.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/';
    });

    // 親要素を取得して置き換え
    const parentElement = pageTitleElement.parentElement;
    if (parentElement) {
      // 元の要素をリンクで包む
      parentElement.insertBefore(linkElement, pageTitleElement);
      linkElement.appendChild(pageTitleElement);
    }
  };

  // 検索とヘッダーの調整
  const adjustSearchAndHeader = () => {
    // 検索ボックスと見出し要素を取得
    const searchElement = document.querySelector('.notion-search button');
    const headerRightElement = document.querySelector('.header-right');
    
    if (!searchElement) {
      // 要素が見つからない場合は少し待ってから再試行
      setTimeout(adjustSearchAndHeader, 100);
      return;
    }
    
    // 検索ボックスのスタイルを調整
    const searchParent = searchElement.parentElement;
    if (searchParent) {
      searchParent.style.position = 'relative';
      searchParent.style.zIndex = '1050';
    }
  };

  // ページが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addLink();
      adjustSearchAndHeader();
    });
  } else {
    addLink();
    adjustSearchAndHeader();
  }

  // 動的に読み込まれる可能性があるので、数秒後にももう一度実行
  setTimeout(() => {
    addLink();
    adjustSearchAndHeader();
  }, 1000);
}
</file>

<file path="lib/notion-api.ts">
import { NotionAPI } from 'notion-client'

// 認証情報のログ出力（実際の値は表示されません）
console.log('Notion API設定状況:');
console.log('- NOTION_API_BASE_URL:', process.env.NOTION_API_BASE_URL ? '設定済み' : '未設定（デフォルト使用）');
console.log('- NOTION_API_SECRET:', process.env.NOTION_API_SECRET ? '設定済み' : '未設定（警告: 認証なしで検索が制限される可能性あり）');

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL || 'https://www.notion.so/api/v3',
  authToken: process.env.NOTION_API_SECRET,  // 認証トークンを追加
  activeUser: process.env.NOTION_ACTIVE_USER || undefined,
  userTimeZone: 'Asia/Tokyo' // タイムゾーンを設定
})
</file>

<file path="pages/[pageId].tsx">
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
      }, 
      revalidate: 10 
    }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)
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
</file>

<file path="next.config.js">
import bundleAnalyzer from '@next/bundle-analyzer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default withBundleAnalyzer({
  // basePathの追加（最重要）
  // basePath: '/blog',
  // trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintエラーを無視
  },
  
  experimental: {
    webpackBuildWorker: true,
  },
  
  staticPageGenerationTimeout: 300,
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  webpack: (config, _context) => {
    // Workaround for ensuring that `react` and `react-dom` resolve correctly
    // when using a locally-linked version of `react-notion-x`.
    // @see https://github.com/vercel/next.js/issues/50391
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    config.resolve.alias.react = path.resolve(dirname, 'node_modules/react')
    config.resolve.alias['react-dom'] = path.resolve(
      dirname,
      'node_modules/react-dom'
    )
    return config
  },

  // See https://react-tweet.vercel.app/next#troubleshooting
  transpilePackages: ['react-tweet'],
  
  // 環境変数の設定（必要に応じて）
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  }
})
</file>

<file path="site.config.ts">
import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '3e7769818f7a4ddfa9c19e03d2aadbf2',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Notion Effect Blog',
  domain: 'notion.effect.moe',
  author: 'EFFEC TCo., Ltd.',

  // open graph metadata (optional)
  description: 'カフェで出来るキネシオロジー',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',
  instagram: 'your_instagram_username',
  facebook: 'your_facebook_username_or_page_id',
  // youtube: 'your_channel_id_or_name',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: false,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  navigationStyle: 'default'
  // navigationStyle: 'custom',
  // navigationLinks: [
  //   {
  //     title: 'About',
  //     pageId: 'f1199d37579b41cbabfc0b5174f4256a'
  //   },
  //   {
  //     title: 'Contact',
  //     pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
  //   }
  // ]
})
</file>

<file path="components/styles.module.css">
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

<file path="pages/_app.tsx">
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import * as React from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'
import { getMenuItemsForStaticProps } from '@/lib/menu-utils'
import FontStyler from '@/components/FontStyler'

if (!isServer) {
  bootstrap()
}

// カスタムAppPropsの型定義を追加
type CustomAppProps = AppProps & {
  pageProps: {
    menuItems?: any[]
    [key: string]: any
  }
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  // FontStylerコンポーネントを追加してフォントをカスタマイズ
  return (
    <>
      <FontStyler />
      <Component {...pageProps} />
    </>
  )
}

// サーバーサイドでメニュー項目を取得
App.getInitialProps = async (appContext: any) => {
  // 元のgetInitialPropsを実行
  const appProps = appContext.Component.getInitialProps
    ? await appContext.Component.getInitialProps(appContext.ctx)
    : {}

  // Notionからメニュー項目を取得
  try {
    const menuItems = await getMenuItemsForStaticProps()
    
    // メニュー項目をページProps全体に追加
    return {
      pageProps: {
        ...appProps,
        menuItems
      }
    }
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return {
      pageProps: {
        ...appProps,
        menuItems: []
      }
    }
  }
}
</file>

<file path="package.json">
{
  "name": "nextjs-notion-starter-kit",
  "version": "2.0.0",
  "private": true,
  "description": "The perfect starter kit for building beautiful websites with Next.js and Notion.",
  "author": "Travis Fischer <travis@transitivebullsh.it>",
  "repository": "transitive-bullshit/nextjs-notion-starter-kit",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "deploy": "vercel deploy",
    "deps:upgrade": "[ -z $GITHUB_ACTIONS ] && pnpm up -L notion-client notion-types notion-utils react-notion-x || echo 'Skipping deps:update on CI'",
    "deps:link": "[ -z $GITHUB_ACTIONS ] && run-s deps:link:* || echo 'Skipping deps:update on CI'",
    "deps:unlink": "[ -z $GITHUB_ACTIONS ] && pnpm add notion-client notion-types notion-utils react-notion-x || echo 'Skipping deps:update on CI'",
    "deps:link:notion-types": "pnpm link ../react-notion-x/packages/notion-types",
    "deps:link:notion-utils": "pnpm link ../react-notion-x/packages/notion-utils",
    "deps:link:notion-client": "pnpm link ../react-notion-x/packages/notion-client",
    "deps:link:react-notion-x": "pnpm link ../react-notion-x/packages/react-notion-x",
    "analyze": "cross-env ANALYZE=true next build",
    "analyze:server": "cross-env BUNDLE_ANALYZE=server next build",
    "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build",
    "test": "run-p test:*",
    "test:lint": "eslint .",
    "test:prettier": "prettier '**/*.{js,jsx,ts,tsx}' --check"
  },
  "dependencies": {
    "@fisch0920/use-dark-mode": "^2.4.0",
    "@keyvhq/core": "^1.6.9",
    "@keyvhq/redis": "^1.6.10",
    "@react-icons/all-files": "^4.1.0",
    "classnames": "^2.5.1",
    "date-fns": "^4.1.0",
    "expiry-map": "^2.0.0",
    "fathom-client": "^3.4.1",
    "framer-motion": "^12.7.3",
    "katex": "^0.16.22",
    "ky": "^1.7.2",
    "next": "^15.0.3",
    "notion-client": "^7.1.3",
    "notion-types": "^7.1.3",
    "notion-utils": "^7.1.3",
    "p-map": "^7.0.2",
    "p-memoize": "^7.1.1",
    "posthog-js": "^1.181.0",
    "prismjs": "^1.30.0",
    "react": "^18.2.0",
    "react-body-classname": "^1.3.1",
    "react-dom": "^18.2.0",
    "react-notion-x": "^7.2.3",
    "react-tweet": "^3.2.1",
    "react-use": "^17.4.2",
    "rss": "^1.2.2",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "@fisch0920/eslint-config": "^1.4.0",
    "@next/bundle-analyzer": "^15.0.2",
    "@next/eslint-plugin-next": "^15.3.0",
    "@types/node": "^22.8.6",
    "@types/react": "^18.0.21",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "cross-env": "^7.0.2",
    "eslint": "^8.57.1",
    "npm-run-all2": "^7.0.1",
    "prettier": "^3.3.3",
    "typescript": "^5.6.3"
  },
  "overrides": {
    "cacheable-request": {
      "keyv": "npm:@keyvhq/core@~1.6.6"
    }
  }
}
</file>

<file path="components/NotionViewTabs.module.css">
.notionViewTabs {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
}

/* これは最小限のスタイルで、実際のスタイルは使用しないため */
</file>

<file path="lib/search-notion.ts">
import ExpiryMap from 'expiry-map'
import pMemoize from 'p-memoize'
import { SearchParams, SearchResults } from 'notion-types' // オリジナルの型をインポート

import type * as types from './types'
import { api } from './config'

// オリジナルの型を使用したタイプエイリアス
type SearchNotionFn = (params: SearchParams) => Promise<SearchResults>

export const searchNotion = pMemoize(searchNotionImpl, {
  cacheKey: (args) => args[0]?.query,
  cache: new ExpiryMap(10_000)
}) as SearchNotionFn // 型キャストを追加

async function searchNotionImpl(
  params: types.SearchParams | { query: string }
): Promise<SearchResults> { // 戻り値の型を修正
  // クエリのロギング
  console.log('Client search query:', params.query)

  // 検索パラメータの標準化
  const searchParams: types.SearchParams = {
    query: params.query,
    ancestorId: api.notionPageId,
    filters: {
      isDeletedOnly: false,
      excludeTemplates: true,
      isNavigableOnly: false,
      requireEditPermissions: false,
      includePublicPagesWithoutExplicitAccess: true
    },
    limit: 20
  };
  
  return fetch(api.searchNotion, {
    method: 'POST',
    body: JSON.stringify(searchParams),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then((res) => {
      if (res.ok) {
        return res
      }

      // convert non-2xx HTTP responses into errors
      const error: any = new Error(res.statusText)
      error.response = res
      console.error('Search API error:', error)
      throw error
    })
    .then((res) => res.json())
    .then((results) => {
      // 結果のロギング
      console.log('Search API Response:', JSON.stringify(results, null, 2));
      console.log(`Client received ${results.results?.length || 0} results for query: ${params.query}`);
      
      // results.resultsが配列でなければ初期化
      if (!Array.isArray(results.results)) {
        console.warn('Search results is not an array, initializing empty array');
        results.results = [];
      }
      
      return results as SearchResults // 型キャスト
    })
    .catch((err) => {
      console.error('Search request failed:', err)
      return { results: [], total: 0, recordMap: { block: {} } } as SearchResults
    })
}
</file>

<file path="pages/index.tsx">
import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { getMenuItems } from '@/lib/menu-utils'
import { notionViews } from '@/lib/notion-views'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)
    
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
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
</file>

<file path="components/NotionPage.tsx">
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

<file path="styles/global.css">
* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}

body,
html {
  padding: 0;
  margin: 0;
}

body {
  --notion-font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', 'Noto Sans', sans-serif;
  font-family: var(--notion-font);
  overflow-x: hidden;
}

.static-tweet blockquote {
  margin: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

.static-tweet-emoji {
  height: 1.2em !important;
  width: 1.2em !important;
}

.searchInput {
  color: var(--fg-color);
  caret-color: var(--fg-color);
}

::-webkit-scrollbar
{
  width: 5px;
  height: 5px;
  background-color: #F5F5F5;
  background-color: var(--bg-color-1);
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: var(--fg-color-1);
}

::-webkit-scrollbar-track {           
    background-color: var(--bg-color);
}
</file>

<file path="styles/notion.css">
/**
 * This file contains site-specifc style overrides for Notion elements from
 * react-notion-x.
 *
 * react-notion-x's goal is to match styling as close as possible to Notion,
 * whereas our goal with this site is to adjust Notion's styling in a few key
 * places to add some flare.
 */

.notion {
  --notion-max-width: 720px;
  --notion-header-height: 54px;
}

.notion-frame {
  padding: 0;
}

.notion-page {
  padding-bottom: calc(max(5vh, 32px)) !important;
  line-height: 1.65;
}

.index-page {
  --notion-max-width: 900px;
}

.notion-text {
  padding: 0.5em 2px;
}

.notion-asset-caption {
  text-align: center;
}

.notion-asset-wrapper {
  margin-top: 1em;
  margin-bottom: 1em;
}

.notion-asset-wrapper-video > div,
.notion-asset-wrapper-video video {
  width: 100% !important;
}

.notion-header .notion-nav-header {
  max-width: 1100px;
  margin: 0 auto;
  overflow-x: auto;
}

.notion-nav-header-rhs {
  gap: 0.5rem;
}

.notion-gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-gap: 2vmin;
  gap: 2vmin;
}

.notion-gallery-grid .notion-page-icon-inline {
  display: none;
}

.notion-gallery-grid .notion-page-title-text {
  font-size: 2em;
  white-space: unset;
}

.notion-gallery-grid .notion-collection-card-property {
  white-space: unset;
  text-overflow: unset;
}

.notion-gallery-grid .notion-property-text {
  font-size: 14px;
}

.notion-collection-card {
  border-radius: 16px;
  box-shadow: none;
}

.notion-collection-card-cover img {
  border-radius: 16px;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 画像のアスペクト比を維持しながら領域いっぱいに表示 */
}

.notion-collection-card {
  overflow: visible;
}

.notion-collection-card-cover {
  border-radius: 16px;
  box-shadow: 2px 2px 8px 4px rgba(15, 15, 15, 0.1);
  /* 高さは各メディアクエリで設定するため、ここでは切り替えの基本値のみ設定 */
  height: 300px;
}

.notion-collection-card-cover {
  border-bottom: 0 none;
  transition: filter 150ms linear;
  filter: none;
}

.notion-collection-card:hover .notion-collection-card-cover {
  filter: brightness(120%);
}

.notion-collection-card-body {
  padding: 10px;
}

/* only target safari */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  _::-webkit-full-page-media,
  _:future,
  :root,
  .notion-collection-card-cover {
    transition: none 0ms linear;
  }
}

.notion-quote {
  padding: 0.2em 0.75em;
  line-height: 1.5;
  font-style: italic;
  font-size: 1.2em;
  border-left: 4px solid #67bdfc;
}

.notion-h1,
.notion-h2,
.notion-h3 {
  margin-bottom: 0.25em;
}

.notion-callout {
  margin: 0.75em 0;
}

.notion-hr {
  margin: 2em 0;
}

@media only screen and (max-width: 920px) {
  .index-page.notion-page {
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

@media only screen and (max-width: 720px) {
  .notion-page {
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

@media only screen and (max-width: 600px) {
  .notion-search-button {
    display: none !important;
  }
}

.notion .notion-page-icon-cover {
  margin-left: auto;
  margin-right: auto;
}

.notion-title {
  display: block;
  text-align: center;
}

/* タイトルフォント設定の強制適用 */
.notion-page-title-text {
  font-family: 'Shippori Mincho', serif !important;
}

/* Googleフォントの直接インポート */
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&display=swap');

.notion-collection-row {
  padding-bottom: 1em;
}

.notion-collection-page-properties .notion-collection-column-title {
  display: none;
}

.notion-collection-row-property .notion-property {
  display: flex;
  justify-content: center;
}

.notion-collection-row-value {
  display: flex;
  align-items: center;
  padding: 0;
  min-height: 23px;
}

.notion-page-cover-wrapper,
.notion-page-cover-wrapper span,
.notion-page-cover-wrapper img {
  max-width: 1200px !important;
  border-radius: 24px;
}

.notion-page-cover-wrapper {
  box-shadow: 2px 2px 8px 4px rgba(15, 15, 15, 0.1);
}

@media only screen and (max-width: 1200px) {
  .notion-page-cover-wrapper,
  .notion-page-cover-wrapper span,
  .notion-page-cover-wrapper img {
    border-radius: 0;
  }
}

.notion-block-ab9a258d6cf444f3bb40dc2600feae91 .notion-page-link {
  justify-content: center;
  padding: 2em;
}

.notion-code {
  background: rgba(249, 250, 251, 1);
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 0.375rem;
}

.notion-link {
  position: relative;
  transition: unset;
  opacity: 1;
  border-bottom-width: 0.1rem;
  background: transparent;
  background-origin: border-box;
  background-repeat: no-repeat;
  background-position: 50% 100%;
  background-size: 0 0.1rem;
}

.notion-link:focus,
.notion-link:hover {
  border-bottom-color: transparent;

  background-image: linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 0.1rem;

  transition-property: background-position, background-size;
  transition-duration: 300ms;
}

.notion-red_background,
.notion-pink_background,
.notion-blue_background,
.notion-purple_background,
.notion-teal_background,
.notion-yellow_background,
.notion-orange_background,
.notion-brown_background,
.notion-gray_background {
  padding: 0 0.5rem;
  margin: 0 -0.5rem 0 -0.25rem;
  border-radius: 0.5rem;
  border-bottom-left-radius: 0.125rem;
  box-decoration-break: clone;

  background-color: none;

  /* light yellow */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #fff697 10.5%,
    #fdf59d 85.29%,
    var(--bg-color)
  );
}

.notion-purple_background,
.notion-pink_background {
  /* light pink */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #f5b8d1 10.5%,
    #f9bcd3 85.29%,
    var(--bg-color)
  );
}

.notion-blue_background,
.notion-gray_background {
  /* light blue */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #adedfc 10.5%,
    #adebfd 85.29%,
    var(--bg-color)
  );
}

.notion-red_background,
.notion-orange_background {
  /* light red */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #f5c4ff 10.5%,
    #e7a8fc 85.29%,
    var(--bg-color)
  );
}

.notion-teal_background {
  /* light green */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #d4eabc 10.5%,
    #d2eabc 85.29%,
    var(--bg-color)
  );
}

.notion-brown_background {
  /* dark blue */
  background-image: linear-gradient(
    119deg,
    var(--bg-color),
    #96b8ec 10.5%,
    #a6c3f0 85.29%,
    var(--bg-color)
  );
}

/* disable highlighting in dark mode */
.dark-mode .notion-red_background,
.dark-mode .notion-pink_background,
.dark-mode .notion-blue_background,
.dark-mode .notion-purple_background,
.dark-mode .notion-teal_background,
.dark-mode .notion-yellow_background,
.dark-mode .notion-orange_background,
.dark-mode .notion-brown_background,
.dark-mode .notion-gray_background {
  padding: 0;
  margin: 0;
  border-radius: 0;
  background: none !important;
}

/* if you don't want rounded page icon images, remove this */
.notion-page-icon-hero.notion-page-icon-image {
  border-radius: 50%;
  box-shadow: 0 8px 40px 0 rgb(0 0 0 / 21%);
}
.notion-page-icon-hero.notion-page-icon-image span,
.notion-page-icon-hero.notion-page-icon-image img {
  border-radius: 50%;
}

.notion-header {
  background: hsla(0, 0%, 100%, 0.8);
  backdrop-filter: saturate(180%) blur(16px);
}

.dark-mode .notion-header {
  background: transparent;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: saturate(180%) blur(20px);
}

/* Workaround for Firefox not supporting backdrop-filter yet */
@-moz-document url-prefix() {
  .dark-mode .notion-header {
    background: hsla(203, 8%, 20%, 0.8);
  }
}

.notion-bookmark:hover {
  border-image: linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%);
  border-image-slice: 1;
}

.notion-block-ab9a258d6cf444f3bb40dc2600feae91 .notion-column {
  padding: 0;
}

.notion-block-260baa77f1e1428b97fb14ac99c7c385 {
  display: none;
}

.notion-search .searchBar {
  box-shadow: var(--fg-color-0) 0px 1px 0px;
}

.notion-search .noResults {
  color: var(--fg-color-3);
}

.notion-search .noResultsDetail {
  color: var(--fg-color-2);
}

.notion-equation.notion-equation-block {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1em;
  margin: 1em 0;
  overflow-x: auto;
  font-size: 1.2em;
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.dark-mode .notion-equation.notion-equation-block {
  background-color: rgba(17, 24, 39, 0.6);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

/* インライン数式のスタイル改善 */
.notion-equation.notion-equation-inline {
  padding: 0 3px;
  vertical-align: middle;
  font-size: 1.1em;
}

/* ホバー時の効果 */
.notion-equation.notion-equation-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(249, 250, 251, 1);
}

.dark-mode .notion-equation.notion-equation-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background-color: rgba(17, 24, 39, 0.8);
}

/* PDFビューアーの改善スタイル */
.notion-pdf {
  width: 100%;
  height: auto;
  min-height: 600px;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 2em 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.5);
  background-color: white;
}

/* PDFビューアーにホバー効果を追加 */
.notion-pdf:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* PDF上部にPDFを示すバッジを追加 */
.notion-pdf::before {
  content: "PDF";
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(217, 119, 6, 0.9);
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ダークモード対応 */
.dark-mode .notion-pdf {
  border-color: rgba(55, 65, 81, 0.5);
  background-color: rgba(31, 41, 55, 1);
}

.dark-mode .notion-pdf:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* モバイル端末の場合はPDFビューアーの高さを調整 */
@media only screen and (max-width: 767px) {
  .notion-pdf {
    min-height: 400px;
  }
  
  /* モバイルでは変形効果を抑える */
  .notion-pdf:hover {
    transform: translateY(-1px);
  }
}

/* コレクションビュー改善スタイル */
.notion-collection-view-tabs {
  margin: 1.5em 0 1em;
  border-bottom: 1px solid rgba(55, 53, 47, 0.16);
  padding-bottom: 0.5em;
  position: relative;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.notion-collection-view-tabs::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.notion-collection-view-tabs-content {
  display: flex;
  align-items: center;
  padding-bottom: 2px;
}

.notion-collection-view-tabs-content button {
  padding: 6px 12px;
  border-radius: 4px;
  margin-right: 8px;
  transition: all 180ms ease-in-out;
  background: transparent;
  border: 1px solid transparent;
  font-size: 0.95em;
}

.notion-collection-view-tabs-content button:hover {
  background: rgba(55, 53, 47, 0.08);
  transform: translateY(-1px);
}

.notion-collection-view-tabs-content button.active {
  background: rgba(55, 53, 47, 0.16);
  font-weight: 500;
  border: 1px solid rgba(55, 53, 47, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark-mode .notion-collection-view-tabs {
  border-bottom-color: rgba(255, 255, 255, 0.13);
}

.dark-mode .notion-collection-view-tabs-content button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark-mode .notion-collection-view-tabs-content button.active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.2);
}

/* テーブルビューの改善 */
.notion-table {
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(55, 53, 47, 0.16);
}

.notion-table-view {
  margin-top: 1em;
}

.notion-table-header {
  background: rgba(247, 246, 243, 0.8);
  font-weight: 600;
  padding: 8px 16px;
}

.dark-mode .notion-table-header {
  background: rgba(48, 47, 45, 0.8);
}

.notion-table-header-cell {
  padding: 8px 12px;
}

.notion-table-cell {
  padding: 8px 12px;
  font-size: 0.9em;
}

.notion-table-row {
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  transition: background 120ms ease-in;
}

.notion-table-row:last-child {
  border-bottom: none;
}

.notion-table-row:hover {
  background: rgba(55, 53, 47, 0.03);
}

.dark-mode .notion-table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* デバイス別のメディアクエリ設定 */
/* PC標準 (1025px〜1439px) */
@media only screen and (min-width: 1025px) and (max-width: 1439px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* 3カラム固定 */
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 240px; /* 少し小さめにして3つ並べても見やすくする */
  }
}

/* 大型PC (1440px以上) */
@media only screen and (min-width: 1440px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(4, 1fr); /* 4カラム固定 */
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 220px; /* さらに少し小さめに */
  }
}

/* タブレット (768px〜1024px) */
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 320px; /* タブレット用の高さ調整 */
  }
}

/* スマートフォン (767px以下) */
@media only screen and (max-width: 767px) {
  .notion-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 2vmin;
    gap: 2vmin;
  }
  
  .notion-collection-card-cover {
    height: 280px; /* スマートフォン用の高さ調整 */
  }
  
  .notion-gallery-grid .notion-page-title-text {
    font-size: 1.5em; /* スマートフォン用のフォントサイズ縮小 */
  }
}
</file>

<file path="lib/notion.ts">
import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

import {
  isPreviewImageSupportEnabled,
  navigationLinks,
  navigationStyle
} from './config'
import { getTweetsMap } from './get-tweets'
import { notion } from './notion-api'
import { getPreviewImageMap } from './preview-images'

const getNavigationLinkPages = pMemoize(
  async (): Promise<ExtendedRecordMap[]> => {
    const navigationLinkPageIds = (navigationLinks || [])
      .map((link) => link.pageId)
      .filter(Boolean)

    if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
      return pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) =>
          notion.getPage(navigationLinkPageId, {
            chunkLimit: 1,
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false
          }),
        {
          concurrency: 4
        }
      )
    }

    return []
  }
)

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)

  if (navigationStyle !== 'default') {
    // ensure that any pages linked to in the custom navigation header have
    // their block info fully resolved in the page record map so we know
    // the page title, slug, etc.
    const navigationLinkRecordMaps = await getNavigationLinkPages()

    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) =>
          mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
  }

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  await getTweetsMap(recordMap)

  return recordMap
}

export async function search(params: SearchParams | { query: string }): Promise<SearchResults> {
  // 環境変数の確認
  console.log('NOTION_PAGE_ID:', process.env.NOTION_PAGE_ID);
  console.log('rootNotionPageId:', process.env.NOTION_ROOT_PAGE_ID || 'not set');
  
  // 検索パラメータの設定
  // ancestorIdは必ず文字列を渡すようにする
  const rootId = process.env.NOTION_PAGE_ID || '';
  
  const searchParams: SearchParams = {
    query: params.query,
    ancestorId: rootId,
    filters: {
      isDeletedOnly: false,
      excludeTemplates: true,
      isNavigableOnly: false,    // falseに変更して検索範囲を広げる
      requireEditPermissions: false,
      includePublicPagesWithoutExplicitAccess: true,
      // ancestorIdsは検索範囲を広げるため一時的にコメントアウト
      // ancestorIds: rootId ? [rootId] : undefined
    } as any,
    sort: {
      field: 'relevance',
      direction: 'desc'
    },
    limit: 100 // 検索結果を増やす
  } as SearchParams;
  
  // クエリがない場合や短すぎる場合は空の結果を返す
  if (!searchParams.query || searchParams.query.trim().length < 2) {
    return { results: [], total: 0, recordMap: { block: {} } } as SearchResults
  }

  // クエリをトリム
  searchParams.query = searchParams.query.trim();
  
  console.log('検索パラメータ詳細:', JSON.stringify(searchParams, null, 2));
  
  try {
    console.log('Notion API search実行...');
    const results = await notion.search(searchParams);
    
    console.log('検索結果概要:', {
      resultsCount: results?.results?.length || 0,
      totalCount: results?.total || 0
    });
    
    if (results?.results?.length === 0) {
      console.log('検索結果が見つかりませんでした。検索クエリ:', params.query);
      console.log('ancestorIdを外して再検索を試みます...');
      
      // ancestorIdを外して再検索
      const searchParamsWithoutAncestor = {
        ...searchParams,
        ancestorId: undefined,
        filters: {
          ...searchParams.filters,
          ancestorIds: undefined
        } as any
      };
      
      try {
        const fallbackResults = await notion.search(searchParamsWithoutAncestor);
        console.log('ancestorIdなしの検索結果:', {
          resultsCount: fallbackResults?.results?.length || 0,
          totalCount: fallbackResults?.total || 0
        });
        
        return fallbackResults as SearchResults;
      } catch (fallbackErr) {
        console.error('ancestorIdなしの検索エラー:', fallbackErr);
        return results as SearchResults;
      }
    }
    
    return results as SearchResults;
  } catch (err) {
    console.error('Notion検索エラー:', err);
    return { results: [], total: 0, recordMap: { block: {} } } as SearchResults;
  }
}
</file>

<file path="lib/menu-utils.ts">
import * as config from './config'
import { notion } from './notion-api'

// プロパティ値を取得する独自関数
function getPropertyValue(block: any, propertyName: string, recordMap: any): any {
  if (!block || !recordMap) return null
  
  try {
    // タイトルの場合は特別な処理
    if (propertyName === 'title') {
      const titleElements = block.properties?.title
      if (Array.isArray(titleElements) && titleElements.length > 0) {
        return titleElements.map(t => t[0]).join('')
      }
      return ''
    }
    
    // 通常のプロパティ
    if (block.properties && propertyName in block.properties) {
      const prop = block.properties[propertyName]
      if (Array.isArray(prop) && prop.length > 0) {
        return prop.map(p => p[0]).join('')
      }
    }
    
    return null
  } catch (err) {
    console.error('Error getting property value:', err)
    return null
  }
}

// メニュー項目の型定義
export type MenuItem = {
  id: string
  title: string
  url: string
  icon?: string
  emoji?: string
  isActive?: boolean
}

// フォールバック用のハードコードされたメニュー項目
const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    title: 'ホーム',
    url: '/'
  },
  {
    id: 'blog',
    title: 'ブログ',
    url: '/blog'
  },
  {
    id: 'profile',
    title: 'プロフィール',
    url: '/profile'
  }
]

// Notionデータベースからメニュー項目を取得する関数
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    // rootNotionPageIdを取得
    const rootNotionPageId = process.env.NOTION_PAGE_ID || config.rootNotionPageId
    if (!rootNotionPageId) {
      console.error('Root notion page ID not found')
      return FALLBACK_MENU_ITEMS
    }

    // NotionデータベースのページデータをAPI経由で取得
    const pageData = await notion.getPage(rootNotionPageId)
    if (!pageData) {
      console.error('Failed to get page data')
      return FALLBACK_MENU_ITEMS
    }

    // ブロックデータからデータベースのブロックを見つける
    const blocks = Object.values(pageData.block)
    
    // データベースのブロックを見つける
    const collectionBlocks = blocks.filter(block => 
      (block.value?.type === 'collection_view' || 
      block.value?.type === 'collection_view_page') &&
      block.value?.collection_id // collection_idプロパティが存在するブロックのみをフィルタリング
    )
    
    if (collectionBlocks.length === 0) {
      console.error('No collection blocks found')
      return FALLBACK_MENU_ITEMS
    }

    // 各コレクションブロックからレコードを取得
    const menuItems: MenuItem[] = []

    // 各コレクションブロックを処理
    for (const block of collectionBlocks) {
      // 型アサーションを使用してTypeScriptのエラーを回避
      // collection_idが存在することがすでにフィルタリングされている
      const blockValue = block.value as any
      const collectionId = blockValue.collection_id
      const collection = pageData.collection?.[collectionId]
      
      if (!collection) continue

      // コレクションのスキーマからMenuプロパティを探す
      const menuPropertyId = Object.entries(collection.value?.schema || {}).find(
        ([, prop]: [string, any]) => prop.name === 'Menu'
      )?.[0]

      if (!menuPropertyId) continue

      // このコレクションのすべてのページを取得
      const pageIds = Object.keys(pageData.block).filter(id => {
        const blockValue = pageData.block[id]?.value
        return blockValue?.parent_id === collectionId && blockValue?.type === 'page'
      })

      // ページごとにMenuプロパティをチェック
      for (const pageId of pageIds) {
        const blockValue = pageData.block[pageId]?.value as any
        if (!blockValue) continue

        try {
          // Menuプロパティの値を取得
          const menuValue = getPropertyValue(blockValue, menuPropertyId, pageData)
          
          // Menuプロパティがtrueの場合のみ処理
          if (menuValue === 'Yes' || menuValue === 'True' || menuValue === '✓') {
            // ページタイトルを取得
            const titleProp = getPropertyValue(blockValue, 'title', pageData) as string
            
            // タイトルが空の場合はスキップ
            if (!titleProp) continue

            // ページIDからURLを生成（IDをそのまま使用するシンプルな方法）
            const url = `/${pageId.replace(/-/g, '')}`

            // メニュー項目を追加
            menuItems.push({
              id: pageId,
              title: titleProp,
              url: url,
              icon: blockValue.format?.page_icon || '',
              emoji: blockValue.format?.page_icon || ''
            })
          }
        } catch (err) {
          console.error(`Error processing page ${pageId}:`, err)
          continue
        }
      }
    }

    // 少なくとも「ホーム」は常に表示
    if (menuItems.length === 0 || !menuItems.some(item => item.url === '/')) {
      menuItems.unshift({
        id: 'home',
        title: 'ホーム',
        url: '/'
      })
    }

    return menuItems
  } catch (error) {
    console.error('Error fetching menu items from Notion:', error)
    return FALLBACK_MENU_ITEMS
  }
}

// サーバーサイドでメニュー項目を取得するためのヘルパー関数
export async function getMenuItemsForStaticProps() {
  const menuItems = await getMenuItems()
  return menuItems
}
</file>

<file path="lib/types.ts">
import { type ParsedUrlQuery } from 'node:querystring'

import { type ExtendedRecordMap, type PageMap } from 'notion-types'

export * from 'notion-types'

export type NavigationStyle = 'default' | 'custom'

export interface PageError {
  message?: string
  statusCode: number
}

export interface PageProps {
  site?: Site
  recordMap?: ExtendedRecordMap
  pageId?: string
  error?: PageError
}

export interface ExtendedTweetRecordMap extends ExtendedRecordMap {
  tweets: Record<string, any>
}

export interface Params extends ParsedUrlQuery {
  pageId: string
}

export interface Site {
  name: string
  domain: string

  rootNotionPageId: string
  rootNotionSpaceId: string

  // settings
  html?: string
  fontFamily?: string
  darkMode?: boolean
  previewImages?: boolean

  // opengraph metadata
  description?: string
  image?: string
}

export interface SiteMap {
  site: Site
  pageMap: PageMap
  canonicalPageMap: CanonicalPageMap
}

export interface CanonicalPageMap {
  [canonicalPageId: string]: string
}

export interface PageUrlOverridesMap {
  // maps from a URL path to the notion page id the page should be resolved to
  // (this overrides the built-in URL path generation for these pages)
  [pagePath: string]: string
}

export interface PageUrlOverridesInverseMap {
  // maps from a notion page id to the URL path the page should be resolved to
  // (this overrides the built-in URL path generation for these pages)
  [pageId: string]: string
}

export interface NotionPageInfo {
  pageId: string
  title: string
  image: string
  imageObjectPosition: string
  author: string
  authorImage: string
  detail: string
}

export interface SearchParams {
  query: string
  ancestorId?: string
  filters?: {
    isDeletedOnly?: boolean
    excludeTemplates?: boolean
    isNavigableOnly?: boolean
    requireEditPermissions?: boolean
    includePublicPagesWithoutExplicitAccess?: boolean
    ancestorIds?: string[]
    [key: string]: any
  }
  sort?: {
    field: string
    direction: 'asc' | 'desc'
  }
  limit?: number
  searchUrlOverride?: string
}

export interface SearchResults {
  results: Array<{
    id: string
    title: string
    description?: string
    url?: string
    icon?: string
    [key: string]: any
  }>
  total: number
  recordMap: {
    block: Record<string, any>
    [key: string]: any
  }
  hasMore?: boolean
}
</file>

<file path="components/Header.module.css">
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

<file path="components/Header.tsx">
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

<file path="pages/api/search-notion.ts">
import { type NextApiRequest, type NextApiResponse } from 'next'

import type * as types from '@/lib/types'
import { search } from '@/lib/notion'

export default async function searchNotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  // リクエストの詳細をログに出力
  console.log('Search API: リクエスト本文', JSON.stringify(req.body, null, 2))
  
  // rootNotionPageIdの確認
  console.log('Search API: NOTION_PAGE_ID', process.env.NOTION_PAGE_ID)
  console.log('Search API: NOTION_API_SECRET', process.env.NOTION_API_SECRET ? 'セットされています' : 'セットされていません')

  const searchParams: types.SearchParams = req.body

  try {
    console.log('<<< lambda search-notion リクエスト:', JSON.stringify(searchParams, null, 2))
    const results = await search(searchParams)
    console.log('>>> lambda search-notion 結果概要:', {
      hasResults: results?.results?.length > 0,
      resultsCount: results?.results?.length || 0,
      hasRecordMap: !!results?.recordMap
    })
    
    // 検索結果のサンプルをログに出力（最初の2件のみ）
    if (results?.results?.length > 0) {
      console.log('検索結果サンプル (最初の2件):', 
        JSON.stringify(results.results.slice(0, 2), null, 2)
      )
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
    )
    res.status(200).json(results)
  } catch (error) {
    console.error('検索エラー:', error)
    res.status(500).json({ error: 'search error', message: error.message })
  }
}
</file>

</files>
