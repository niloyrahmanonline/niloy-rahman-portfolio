# Niloy Rahman Portfolio

Phase 1 is a local Next.js App Router frontend. Use Node.js 20.9 or later.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. In Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm`.

## Verify and run production

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

## Edit content

- Update the biography, services, concept projects, and catalog categories in `src/lib/content.ts`.
- The original portrait is at `public/images/niloy-portrait.png`. Next.js serves optimized derivatives.
- To enable the wedding showreel, place a licensed video and caption file under `public`, then set `showreel.src` and `showreel.captions` in the content file. An optional poster can be supplied the same way.
- The contact form prepares a draft in the visitor's email app. The subscription catalog is a preview and directs availability inquiries to WhatsApp.

## Optional development FPS meter

In PowerShell, set `$env:NEXT_PUBLIC_SHOW_FPS = "1"` before starting `npm.cmd run dev`. Clear it with `Remove-Item Env:NEXT_PUBLIC_SHOW_FPS` and restart the dev server to disable the meter. It estimates FPS from animation frames in the visible tab and is excluded from production.
