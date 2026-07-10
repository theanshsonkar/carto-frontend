# Carto — Frontend

Marketing site for [Carto](https://github.com/theanshsonkar/carto), the portable AI container for your codebase.

Built with **Next.js 16** (App Router) + **Tailwind CSS 4**, statically exported.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # static export → ./out
```

## Deploy (Cloudflare Pages)

Connected to Cloudflare Pages — every push to `main` auto-builds and deploys.

- **Build command:** `npm run build`
- **Output directory:** `out`
- **Live:** https://trycarto.pages.dev
