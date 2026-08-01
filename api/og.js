import React from 'react'
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

const WIDTH = 1200
const HEIGHT = 630

function clampText(s, max) {
  const t = String(s || '').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function parseOg(reqUrl) {
  const url = new URL(reqUrl)
  const kind = url.searchParams.get('kind') === 'hit' ? 'hit' : 'challenge'
  const place = clampText(url.searchParams.get('place') || 'EARTH', 40).toUpperCase()
  const kmRaw = url.searchParams.get('km')
  const km = kmRaw && /^\d{1,6}$/.test(kmRaw) ? kmRaw : null
  const gradeRaw = url.searchParams.get('grade')
  const grade = gradeRaw ? clampText(gradeRaw, 24).toUpperCase() : null
  return { kind, place, km, grade, origin: url.origin }
}

export default async function handler(req) {
  try {
    const { kind, place, km, grade, origin } = parseOg(req.url)
    const bg = `${origin}/breaking.jpg`

    const fontRes = await fetch(`${origin}/fonts/BebasNeue-Regular.ttf`)
    if (!fontRes.ok) {
      return new Response(`font fetch failed: ${fontRes.status}`, { status: 500 })
    }
    const fontData = await fontRes.arrayBuffer()

    // Hit cards keep the baked-in BREAKING NEWS on breaking.jpg.
    // Challenge cards paint over it and show CHALLENGE instead.
    const kicker = kind === 'challenge' ? 'CHALLENGE' : null
    const headline =
      kind === 'hit' && km != null
        ? `${Number(km).toLocaleString('en-US')} KM FROM ${place}`
        : place
    const sub =
      kind === 'hit' && grade
        ? grade
        : 'FINAL EXAM · HIT THE CAPITAL'

    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
            backgroundColor: '#0b1c22',
            fontFamily: 'Bebas Neue',
          },
        },
        React.createElement('img', {
          src: bg,
          width: WIDTH,
          height: HEIGHT,
          style: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },
        }),
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              kind === 'challenge'
                ? 'linear-gradient(180deg, rgba(8,22,28,0.78) 0%, rgba(8,22,28,0.28) 40%, rgba(8,22,28,0.9) 100%)'
                : 'linear-gradient(180deg, rgba(8,22,28,0.2) 0%, rgba(8,22,28,0.15) 45%, rgba(8,22,28,0.88) 100%)',
          },
        }),
        // Scrub the baked "BREAKING NEWS" for challenge cards
        kind === 'challenge'
          ? React.createElement('div', {
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: 820,
                height: 170,
                display: 'flex',
                background:
                  'linear-gradient(95deg, #0b1c22 0%, #0b1c22 72%, rgba(11,28,34,0) 100%)',
              },
            })
          : null,
        React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              left: 56,
              top: 44,
              display: 'flex',
              color: 'rgba(231,242,244,0.55)',
              fontSize: 22,
              letterSpacing: 6,
            },
          },
          'NUKE ACADEMY',
        ),
        React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              left: 56,
              right: 56,
              bottom: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
          },
          kicker
            ? React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    color: '#e85d3a',
                    fontSize: 36,
                    letterSpacing: 8,
                    marginBottom: 8,
                  },
                },
                kicker,
              )
            : null,
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                color: '#e7f2f4',
                fontSize: headline.length > 28 ? 64 : 84,
                lineHeight: 1.05,
                letterSpacing: 2,
                maxWidth: 1080,
              },
            },
            headline,
          ),
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                color: '#d9b87a',
                fontSize: 28,
                letterSpacing: 4,
                marginTop: 14,
              },
            },
            sub,
          ),
        ),
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          {
            name: 'Bebas Neue',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
        headers: {
          'cache-control': 'public, immutable, no-transform, max-age=31536000',
        },
      },
    )
  } catch (err) {
    return new Response(String(err?.stack || err), { status: 500 })
  }
}
