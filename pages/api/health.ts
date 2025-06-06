import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    basePath: '/blog',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? 'true' : 'false',
      hasNotionPageId: !!process.env.NOTION_PAGE_ID,
      hasNotionApiSecret: !!process.env.NOTION_API_SECRET,
    }
  })
}