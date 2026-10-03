# Ghina Emelia Yantes — Portfolio (Next.js)

**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + next-themes.**
Static-generated pages for `/en` and `/id`, per-page metadata, hreflang, sitemap, JSON-LD.

## Run
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000  (redirects to /en or /id)
npm run build && npm start
```
Node.js 20.9+ required.

## Page width and hero name size
Both live in `src/app/globals.css`:
```css
@theme {
  --container-page: 80rem;                       /* max page width -> class max-w-page */
  --text-name: clamp(2.75rem, 5.2vw, 5.5rem);    /* hero name size -> class text-name  */
}
```
`max-w-page` is used in `app/[lang]/layout.tsx`, `components/Header.tsx`, `components/Footer.tsx`.
`text-name` is used on the `<h1>` in `views/Home.tsx`. Side padding: `px-5 sm:px-8 lg:px-20`.

## Structure
```
├─ next.config.ts · postcss.config.mjs · tsconfig.json · .env.example
├─ public/                         # favicon, photo.jpg, cv.pdf
└─ src/
   ├─ proxy.ts                     # / -> /en or /id (cookie > Accept-Language > default)
   ├─ app/
   │  ├─ globals.css               # Tailwind, tokens (light/dark), custom components
   │  ├─ sitemap.ts · robots.ts
   │  └─ [lang]/
   │     ├─ layout.tsx             # <html lang>, providers, header/footer, base metadata
   │     ├─ page.tsx               # Home (+ JSON-LD Person)
   │     ├─ [slug]/page.tsx        # all content pages, generateStaticParams + metadata
   │     └─ not-found.tsx
   ├─ views/                       # page bodies (client): Home, Hire, index (PAGES + PageBody)
   ├─ components/                  # Header, Footer, Background, Explore, cards, ui, LocLink, Spotlight
   ├─ context/Settings.tsx         # lang (from URL) + theme (next-themes)
   ├─ hooks/useTypewriter.ts
   ├─ lib/i18n.ts · lib/seo.ts     # locales, default locale, site URL
   └─ data/nav.ts · site.ts · content.ts   # menu, identity, content
```
> `src/pages` was renamed to `src/views` on purpose: Next treats `src/pages` as the legacy Pages Router.

## Common tasks
| Task | Where |
|---|---|
| Name, typing roles, hero copy, socials, photo | `src/data/site.ts` |
| Projects, awards, certificates, news, skills | `src/data/content.ts` |
| Add a page | entry in `src/data/nav.ts` + component in `src/views/index.tsx` (PAGES) |
| Default language / add a locale | `src/lib/i18n.ts` (+ labels in `data/nav.ts`) |
| Colors and fonts | tokens at the top of `src/app/globals.css` |

## Deploy
Vercel: import the repo and set `NEXT_PUBLIC_SITE_URL`. No other config needed.

## TODO
- Connect the contact form (`src/views/Hire.tsx`) to Formspree or a Route Handler
- Replace placeholder content; add `public/photo.jpg` and a CV PDF
- Project detail pages (`/[lang]/project/[slug]`)
- Open Graph image (`app/opengraph-image.tsx`)
