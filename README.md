# Ghina Emelia Yantes — Portfolio

Personal portfolio at [ghina-portofolio.vercel.app](https://ghina-portofolio.vercel.app), in English (`/en`) and Indonesian (`/id`).

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lenis smooth scrolling, Vercel Analytics and Speed Insights.

## Run

```bash
npm install
npm run dev          # http://localhost:3000 (redirects to /en or /id)
npm run build        # production build, includes the TypeScript check
npm start            # serve the production build
npm run typecheck    # tsc --noEmit
node --test src/lib/*.test.ts   # unit tests (Node 24 runs the .ts files directly)
```

Node.js 20.9 or newer is required; the Vercel project runs Node 24.

## Pages

| Route | What it is |
|---|---|
| `/[lang]` | Home: hero, Explore, then scroll-driven sections (approach, history, highlights, experience, now, featured project, stack, gallery) |
| `/[lang]/[slug]` | Every content page from `src/data/nav.ts`: about, portfolio, skills, certificate, news, work, project, organization, award, hire, design, writing, education, timeline, sitemap |
| `/[lang]/project/[slug]` | One page per project |
| `/api/hire` | Contact form backend (POST only) |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image` | Generated metadata files |

All pages are statically generated. `src/proxy.ts` redirects un-prefixed paths to `/en` or `/id` (cookie, then `Accept-Language`, then the default).

## Editing content

Almost everything shown on the site is data, not markup.

| To change | Edit |
|---|---|
| Name, typing roles, hero text, contacts, photos, CV path | `src/data/site.ts` |
| Home "Approach" sentence | `statement` in `src/data/site.ts` |
| Home history timelines (tabs, chapters, photos) | `histories` in `src/data/site.ts` |
| Home gallery photos | `gallery` in `src/data/site.ts` |
| Projects, work, organizations, awards, certificates, education, skills, motto | `src/data/content.ts` |
| Menu groups, page titles and descriptions | `src/data/nav.ts` |
| Add a page | an entry in `src/data/nav.ts` plus a component in `PAGES` (`src/views/index.tsx`) |
| Languages | `src/lib/i18n.ts` |
| Colors, card style, page width, hero name size | tokens at the top of `src/app/globals.css` |

Notes:

- Text that differs per language uses `pair('English', 'Indonesia')`.
- Images go in `public/` and are referenced by path (`/photo.jpg`).
- A history chapter without a `photo` shows a labelled placeholder until one is added.
- A project marked `wip: true` appears in the home "Now" section and leaves it when the flag is removed.
- With more than one entry in `histories`, tabs appear above the history strip.

## Contact form

The form in `src/views/Hire.tsx` posts to `src/app/api/hire/route.ts`, which checks the request and forwards accepted messages to Formspree.

Checks, in order:

1. Same-origin only (403), JSON only (415).
2. Per-address throttle: 8 requests per 10 minutes (429). Counts are kept in server memory, so this slows bursts rather than enforcing a hard cap.
3. Body size cap of 16 KB (413).
4. Honeypot field: bot submissions are answered as successful and dropped.
5. Field validation and length limits (400, with a message per field).
6. Sender address: strict syntax, common typos (`gmial.com`), throwaway inboxes, and a DNS lookup that the domain accepts mail.

If the backend cannot deliver, the browser falls back to posting to Formspree directly so a message is not lost. The address check confirms the domain can receive mail, not that the mailbox exists; confirming a mailbox needs a confirmation email, which requires a verified sending domain.

## SEO

- Name-led titles and descriptions per language, canonical URLs, and `hreflang` (with `x-default`) on every page.
- Open Graph and Twitter cards per page; project pages use their own image.
- JSON-LD: `Person`, `WebSite`, and `ProfilePage` on home; `BreadcrumbList` on subpages; `ContactPage`, `AboutPage`, and `CreativeWork` where they apply.
- Sitemap with language alternates and images; web manifest.
- Shared helpers and keywords live in `src/lib/seo.ts`.

## Security

`next.config.ts` sends these headers on every route: Content-Security-Policy, Strict-Transport-Security, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer-Policy, Permissions-Policy, and Cross-Origin-Opener-Policy. The `X-Powered-By` header is off.

The CSP allows scripts, styles, images, and fonts from this site only, plus Vercel Analytics and Formspree. Inline scripts stay allowed because Next.js hydration, the theme bootstrap, and JSON-LD are inline. A new external script, font, or API host must be added to the policy in `next.config.ts` or the browser will block it.

## Environment variables

All optional. Set them in the Vercel project settings; for local use put them in `.env.local` (ignored by git).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site origin for canonical URLs and the sitemap. Defaults to the Vercel production domain, then `http://localhost:3000`. |
| `FORMSPREE_ENDPOINT` | Where the contact backend delivers messages. Defaults to the form already in use. |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console ownership code. |
| `BING_SITE_VERIFICATION` | Bing Webmaster Tools code. |
| `YANDEX_SITE_VERIFICATION` | Yandex Webmaster code. |

## Structure

```
├─ next.config.ts                  # security headers and CSP
├─ public/                         # photos, project screenshots, cv.pdf, favicon, og image
└─ src/
   ├─ proxy.ts                     # language redirect
   ├─ app/
   │  ├─ globals.css               # Tailwind, theme tokens (light/dark), component styles
   │  ├─ sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx
   │  ├─ api/hire/route.ts         # contact form backend
   │  └─ [lang]/
   │     ├─ layout.tsx             # <html lang>, providers, header/footer, base metadata
   │     ├─ page.tsx               # Home + JSON-LD
   │     ├─ [slug]/page.tsx        # content pages
   │     └─ project/[slug]/page.tsx
   ├─ views/                       # page bodies: Home, Hire, index (PAGES + PageBody)
   ├─ components/                  # Header, Footer, Explore, HomeSections, HeroPhoto, cards,
   │                               # AboutCard, FeaturedShowcase, backgrounds, projects/
   ├─ context/Settings.tsx         # language (from the URL) and theme (data-theme attribute)
   ├─ hooks/                       # useTypewriter, useProjectFilters
   ├─ lib/                         # i18n, seo, email-check, hire-validation, project helpers (+ tests)
   └─ data/                        # nav.ts, site.ts, content.ts
```

`src/views` is used instead of `src/pages` on purpose: Next.js treats `src/pages` as the legacy Pages Router.

## Theme and motion

- Dark is a galaxy theme and light is a daytime sky; the choice is stored in `localStorage` and applied before paint.
- Cards share one flat style (`.card`), driven by the `--card-*` and `--panel` tokens.
- Home sections animate with the scroll position (`src/components/HomeSections.tsx`). Pinned sections only run on wide screens.
- All motion is disabled for visitors who set "reduce motion" in their system.

## Deploy

The site runs on the Vercel project `portofolio`. Deploy through that project's Git integration or with `vercel --prod`. No configuration beyond the optional environment variables is needed.

## Open items

- Replace the placeholder photos in the home history and add more photos to the gallery.
- Fill in `image` and `tech` for projects that lack them (for example Food Waste Stop).
- Register the site in Google Search Console and submit `sitemap.xml`.
- Sender confirmation emails, a durable rate limit, and bot protection are not set up; the first needs a custom domain.
