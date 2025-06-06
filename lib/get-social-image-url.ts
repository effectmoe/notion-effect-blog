import { api, host } from './config'

export function getSocialImageUrl(pageId: string) {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/blog'
    const url = new URL(`${basePath}${api.getSocialImage}`, host)

    if (pageId) {
      url.searchParams.set('id', pageId)
      return url.toString()
    }
  } catch (err) {
    console.warn('error invalid social image url', pageId, err.message)
  }

  return null
}
