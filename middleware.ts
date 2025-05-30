import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// HTMLサイトのパスをNext.jsアプリのパスにマッピング
const pathMapping: Record<string, string> = {
  '/all-in-one/': '/all-in-one',
  '/internal-tools/': '/integrations',
  '/api-integration/': '/api-automation',
  '/workflow-automation/': '/workflow-automation',
  '/multiview-database/': '/data-analysis',
  '/security-access/': '/access-management'
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // パスマッピングをチェック
  if (pathMapping[pathname]) {
    return NextResponse.redirect(new URL(pathMapping[pathname], request.url))
  }

  // 末尾のスラッシュを削除
  if (pathname.endsWith('/') && pathname !== '/') {
    return NextResponse.redirect(new URL(pathname.slice(0, -1), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // HTMLサイトのパスにマッチ
    '/all-in-one/',
    '/internal-tools/',
    '/api-integration/',
    '/workflow-automation/',
    '/multiview-database/', 
    '/security-access/',
    // その他のパス
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
