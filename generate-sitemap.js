import { SitemapStream, streamToPromise } from 'sitemap'
import { writeFile } from 'fs/promises'

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: 'https://immortal-vault.litolax.dev' })

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/privacy-policy', changefreq: 'monthly', priority: 0.5 },
    { url: '/auth/signIn', changefreq: 'monthly', priority: 0.8 },
    { url: '/auth/signIn/approve', changefreq: 'monthly', priority: 0.8 },
    { url: '/auth/signUp', changefreq: 'monthly', priority: 0.8 },
    { url: '/menu', changefreq: 'weekly', priority: 0.9 },
  ]

  for (const link of links) {
    sitemap.write(link)
  }
  sitemap.end()

  const data = await streamToPromise(sitemap)
  await writeFile('./public/sitemap.xml', data.toString())
}

generateSitemap().catch(console.error)
