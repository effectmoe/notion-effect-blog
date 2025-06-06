import rawSiteConfig from '../site.config'
import { type SiteConfig } from './site-config'

if (!rawSiteConfig) {
  throw new Error(`Config error: invalid site.config.ts`)
}

// allow environment variables to override site.config.ts
let siteConfigOverrides: SiteConfig

try {
  if (process.env.NEXT_PUBLIC_SITE_CONFIG) {
    console.log('[get-config-value] NEXT_PUBLIC_SITE_CONFIG is set, parsing...')
    console.log('[get-config-value] Raw value:', process.env.NEXT_PUBLIC_SITE_CONFIG)
    siteConfigOverrides = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG)
    console.log('[get-config-value] Parsed overrides:', JSON.stringify(siteConfigOverrides, null, 2))
  }
} catch (err) {
  console.error('Invalid config "NEXT_PUBLIC_SITE_CONFIG" failed to parse')
  throw err
}

const siteConfig: SiteConfig = {
  ...rawSiteConfig,
  ...siteConfigOverrides
}

// Log the final config if in development or on Vercel
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
  console.log('[get-config-value] Final siteConfig.pageUrlOverrides:', JSON.stringify(siteConfig.pageUrlOverrides, null, 2))
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
