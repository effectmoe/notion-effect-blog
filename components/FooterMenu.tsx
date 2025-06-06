import React from 'react'
import Link from 'next/link'
import styles from './FooterMenu.module.css'

interface FooterMenuItem {
  id: string
  title: string
  url: string
}

interface FooterMenuProps {
  menuItems?: FooterMenuItem[]
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const defaultMenuItems: FooterMenuItem[] = [
  { id: '1', title: 'Notion機能紹介', url: `${basePath}/notion-features` },
  { id: '2', title: 'オールインワン情報管理', url: `${basePath}/all-in-one` },
  { id: '3', title: '既存ツールとの連携', url: `${basePath}/integrations` },
  { id: '4', title: 'API連携と自動化', url: `${basePath}/api-automation` },
  { id: '5', title: '業務フロー自動化', url: `${basePath}/workflow-automation` },
  { id: '6', title: '多角的データ分析', url: `${basePath}/data-analysis` },
  { id: '7', title: 'セキュアなアクセス管理', url: `${basePath}/access-management` }
]

export const FooterMenu: React.FC<FooterMenuProps> = ({ 
  menuItems = defaultMenuItems 
}) => {
  return (
    <div className={styles.footerMenu}>
      <h3 className={styles.title}>Notion機能紹介</h3>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li key={item.id} className={styles.menuItem}>
            <Link href={item.url}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
