# Ghina — Portfolio

Multi-page portfolio built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router**.
Dark/light theme, EN/ID toggle, animated hero (shining name + typing roles), canvas background.

## Getting started
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build -> dist/
npm run preview    # serve dist/ locally
```
Requires Node.js 20+ (Vite 8 needs a current LTS).

## Structure
```
├─ index.html                 # entry + theme-flash guard
├─ vite.config.ts             # react + @tailwindcss/vite
├─ vercel.json, public/_redirects   # SPA rewrites (Vercel / Netlify)
├─ public/favicon.svg         # put photo.jpg, cv.pdf here too
└─ src/
   ├─ main.tsx · App.tsx      # providers + routes (generated from data/nav.ts)
   ├─ index.css               # Tailwind import, design tokens (light/dark), custom components
   ├─ context/Settings.tsx    # theme + language state (persisted in localStorage)
   ├─ hooks/useTypewriter.ts  # typing / deleting role animation
   ├─ data/
   │  ├─ nav.ts               # menu groups, page titles/descriptions (EN/ID)
   │  ├─ site.ts              # name, roles for typing, hero copy, socials, photo
   │  └─ content.ts           # projects, organizations, awards, certificates, news, skills...
   ├─ components/
   │  ├─ Layout.tsx · Header.tsx · Footer.tsx · Background.tsx
   │  ├─ Explore.tsx          # home bento
   │  ├─ cards.tsx            # ProjectCard, Medal, Ticket, FeedItem, Timeline
   │  └─ ui.tsx               # Section, PageShell (breadcrumb + title)
   └─ pages/
      ├─ Home.tsx · Hire.tsx
      └─ index.tsx            # PAGES map: route key -> page component
```

## Edit your content
| What | Where |
|---|---|
| Name, typing roles, hero text, socials, photo | `src/data/site.ts` |
| Projects, awards, certificates, news, timeline, skills | `src/data/content.ts` |
| Add / rename menu pages | `src/data/nav.ts` + register component in `src/pages/index.tsx` |
| Colors, fonts | tokens at top of `src/index.css` |
| Hero shine speed | `.shine` / `.shine-brand` in `src/index.css` |

## Design tokens
| Token | Dark | Light |
|---|---|---|
| bg | `#05060F` | `#FAFAF8` |
| surface | `#0B0D22` | `#FFFFFF` |
| muted | `#12152E` | `#F1F0EC` |
| border | `#262B4A` | `#E4E2DB` |
| brand | `#818CF8` | `#4F46E5` |

## Deploy
Vercel / Netlify: import the repo, build command `npm run build`, output `dist`. SPA rewrites are already configured.

## TODO
- Connect the contact form (`src/pages/Hire.tsx`) to Formspree or your API
- Replace placeholder content and add `public/photo.jpg`
- Link "Download CV" to a PDF in `public/`
- Project detail page (`/project/:slug`)
