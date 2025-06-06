import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
  
  const environment = process.env.VERCEL ? 'vercel' : 'local'
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  
  res.status(200).json({
    status: 'ok',
    environment,
    baseUrl,
    basePath,
    headers: {
      host: req.headers.host,
      'x-forwarded-host': req.headers['x-forwarded-host'],
      'x-forwarded-proto': req.headers['x-forwarded-proto']
    },
    url: req.url,
    timestamp: new Date().toISOString()
  })
}