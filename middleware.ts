import { copy, t } from './src/i18n/copy'
import { localeFromAcceptLanguage } from './src/i18n/detect'
import { decodeHit } from './src/share/codec'
import { composeShareOg } from './src/share/compose'
import { countryDisplayName, countryIdFromSlug } from './src/share/countryNames'

export const config = {
  matcher: '/nuke/:code*',
}

/** Fallback art when we can't personalize. */
const OG_IMAGE_FALLBACK = '/breaking.jpg?v=1'

/** Bump when OG card layout changes (CDN is immutable for a year). */
const OG_V = '4'

function challengeOgImage(site: string, place: string): string {
  const q = new URLSearchParams({ kind: 'challenge', place, v: OG_V })
  return `${site}/api/og?${q}`
}

function hitOgImage(site: string, place: string, km: number, grade: string): string {
  const q = new URLSearchParams({
    kind: 'hit',
    place,
    km: String(Math.round(km)),
    grade,
    v: OG_V,
  })
  return `${site}/api/og?${q}`
}

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/nuke\/([0-9A-Za-z-]+)$/)
  if (!match) return undefined

  const ua = request.headers.get('user-agent') ?? ''
  const isBot =
    /bot|crawl|spider|slurp|facebookexternalhit|Twitterbot|LinkedInBot|Discordbot|TelegramBot|WhatsApp|Preview|SkypeUriPreview|Slackbot|redditbot/i.test(
      ua,
    )
  if (!isBot) return undefined

  const locale = localeFromAcceptLanguage(request.headers.get('accept-language'))
  const c = copy(locale)
  const site = url.origin
  const code = match[1]!
  const pageUrl = `${site}/nuke/${code}`
  let image = `${site}${OG_IMAGE_FALLBACK}`
  let imageType = 'image/jpeg'

  let title = 'NUKE ACADEMY'
  let description = c.ogDescription
  let imageAlt = 'NUKE ACADEMY'

  // Country challenge slugs first — words like "argentina" falsely decode as hits.
  const challengeId = countryIdFromSlug(code)
  if (challengeId) {
    const place = countryDisplayName(challengeId, locale)
    title = t(c.ogChallengeTitle, { place })
    description = t(c.ogChallengeDescription, { place })
    image = challengeOgImage(site, place)
    imageType = 'image/png'
    imageAlt = title
  } else {
    const hit = decodeHit(code)
    if (hit) {
      const place = countryDisplayName(hit.countryId, locale)
      const og = composeShareOg(hit.grade, hit.distanceKm, place, locale)
      title = og.title
      description = og.description
      image = hitOgImage(site, place, hit.distanceKm, hit.grade)
      imageType = 'image/png'
      imageAlt = title
    }
  }

  const html = `<!doctype html>
<html lang="${locale === 'zh' ? 'zh-CN' : locale}">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(title)} | NUKE ACADEMY</title>
<meta name="description" content="${escapeHtml(description)}"/>
<link rel="canonical" href="${escapeHtml(pageUrl)}"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="NUKE ACADEMY"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:url" content="${escapeHtml(pageUrl)}"/>
<meta property="og:image" content="${escapeHtml(image)}"/>
<meta property="og:image:secure_url" content="${escapeHtml(image)}"/>
<meta property="og:image:type" content="${escapeHtml(imageType)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="${escapeHtml(imageAlt)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="@nukeacademy"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<meta name="twitter:image" content="${escapeHtml(image)}"/>
<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}"/>
</head>
<body>
<p>${escapeHtml(title)}</p>
<p>${escapeHtml(description)}</p>
<p><a href="${escapeHtml(pageUrl)}">${escapeHtml(c.openAcademy)}</a></p>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
