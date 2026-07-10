# lilydesignsystem.github.io — SvelteKit static site design

**Date:** 2026-05-02
**Status:** Draft for review
**Owner:** Joel Parker Henderson

## Goal

Convert `lilydesignsystem.github.io/` (the GitHub Pages site for the Lily Design System™) from hand-written static HTML into a SvelteKit project that builds to a static site and is deployed automatically by GitHub Actions to the custom domain `lilydesignsystem.com`.

## Constraints

- The `lilydesignsystem.github.io/` directory is a `git subtree`-pushed implementation in the Lily™ monorepo, mirrored to `LilyDesignSystem/lilydesignsystem.github.io` on GitHub.
- That repo is a `<org>.github.io` repo, so GitHub Pages serves from the **root** of `main`. Build output must therefore land at the served root — either by being committed at root, or by being published via the GitHub Pages deploy API (this design uses the latter).
- The site is multi-page and content-only (no server logic), so full prerendering with `@sveltejs/adapter-static` is appropriate.
- Existing URL paths must be preserved: `/`, `/about/`, `/components/`, `/examples/`, `/help/`, plus the markdown-stub directories `/comparisons/`, `/lily-claude-code/`, `/lily-claude-design/`, `/lily-figma/`, and `/tutorials/{blazor,html,react,svelte,vue}/`.
- Custom domain: `lilydesignsystem.com` (configured via `static/CNAME`). DNS at the registrar is out of scope for this work.

## Non-goals

- No CMS, no content collections beyond the existing component catalog.
- No design changes — the visual treatment from `assets/style.css` is preserved.
- No removal of the `git subtree push` flow. Authors continue to work in the monorepo; the subtree push to the GH Pages repo is what triggers the deploy Action.
- No SSR, no client-side routing as the primary mode (every route prerenders).

## Architecture overview

```
monorepo (lily-design-system)
└── lilydesignsystem.github.io/      ← SvelteKit project root
    ├── source files (svelte, ts, css, images)
    ├── .github/workflows/deploy.yml ← runs in the GH Pages repo only
    └── static/CNAME                 ← lilydesignsystem.com

    git subtree push
            │
            ▼
github.com/LilyDesignSystem/lilydesignsystem.github.io
    push to main
            │
            ▼
    .github/workflows/deploy.yml
        - npm install
        - npm run build           (adapter-static → ./build/)
        - actions/upload-pages-artifact (path: build/)
        - actions/deploy-pages
            │
            ▼
    GitHub Pages serves from build artifact
            │
            ▼
    https://lilydesignsystem.com/
```

## Tech stack

Aligned with the sibling `lily-design-system-svelte-sveltekit-examples` subproject so the team only learns one toolchain.

| Tool                          | Version                       |
|-------------------------------|-------------------------------|
| Svelte                        | ^5.25                         |
| SvelteKit                     | ^2.55                         |
| `@sveltejs/adapter-static`    | ^3 (latest stable)            |
| `@sveltejs/vite-plugin-svelte`| ^5                            |
| Vite                          | ^6                            |
| TypeScript                    | ^5.8                          |
| Package manager               | pnpm                          |
| Node                          | 20 (in CI)                    |

## File layout after migration

```
lilydesignsystem.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore                  ADD: /node_modules, /.svelte-kit, /build
├── .git-subtree-push           keep
├── package.json                NEW
├── pnpm-lock.yaml              NEW (generated)
├── svelte.config.js            NEW
├── vite.config.ts              NEW
├── tsconfig.json               NEW
├── src/
│   ├── app.html                NEW (minimal SvelteKit shell)
│   ├── app.d.ts                NEW (kit types)
│   ├── lib/
│   │   └── components.ts       data migrated from assets/components-data.js
│   └── routes/
│       ├── +layout.svelte      site header + footer
│       ├── +layout.ts          export const prerender = true;
│       ├── +page.svelte        home (was index.html)
│       ├── about/+page.svelte
│       ├── components/+page.svelte
│       ├── examples/+page.svelte
│       ├── help/+page.svelte
│       ├── comparisons/+page.svelte
│       ├── lily-claude-code/+page.svelte
│       ├── lily-claude-design/+page.svelte
│       ├── lily-figma/+page.svelte
│       └── tutorials/
│           ├── +page.svelte    index of tutorials
│           ├── blazor/+page.svelte
│           ├── html/+page.svelte
│           ├── react/+page.svelte
│           ├── svelte/+page.svelte
│           └── vue/+page.svelte
├── static/
│   ├── CNAME                   contents: "lilydesignsystem.com"
│   ├── .nojekyll
│   ├── robots.txt              moved from root
│   ├── sitemap.xml             moved from root
│   └── assets/                 keeps `/assets/...` URL prefix to avoid link rewrites
│       ├── style.css
│       ├── favicon.svg
│       └── images/...
├── index.md                    keep (docs only, not served)
├── README.md → index.md        keep
└── (REMOVED from root: .nojekyll, index.html, 404.html, about/index.html, components/index.html, examples/index.html, help/index.html, comparisons/index.md, lily-claude-code/index.md, lily-claude-design/index.md, lily-figma/index.md, tutorials/**, assets/components.js, assets/components-data.js, assets/style.css, assets/favicon.svg, assets/images/, robots.txt, sitemap.xml — these are either superseded by Svelte routes, relocated to static/, or removed because adapter-static regenerates the equivalent.)
```

`assets/components-data.js` becomes `src/lib/components.ts` (typed export of `LILY_COMPONENTS`). `assets/components.js` (search/filter behavior on the components page) is reimplemented inside `src/routes/components/+page.svelte` as a Svelte 5 component using runes.

## Component data flow

```ts
// src/lib/components.ts
export type LilyComponent = {
  name: string;        // kebab-case
  pascal: string;      // PascalCase
  description: string;
};

export const LILY_COMPONENTS: LilyComponent[] = [
  // generated from components.tsv via existing awk script in index.md
];
```

The home page and components page both import `LILY_COMPONENTS` directly. No fetch, no server load — pure prerender.

The existing regeneration recipe in `index.md` (the `awk` block that builds `components-data.js`) is updated to emit a TypeScript module instead. The script lives unchanged in monorepo conventions; only the output target changes.

## Routing & layout

`src/routes/+layout.svelte` holds the site chrome currently duplicated across every HTML page:
- skip-link
- `<header class="site-header">` with brand and nav
- `<main id="main" class="site-main"><slot /></main>`
- `<footer class="site-footer">`

`+layout.ts` opts every route into prerendering:

```ts
// src/routes/+layout.ts
export const prerender = true;
export const trailingSlash = 'always';   // keeps /about/ style URLs that GH Pages prefers
```

Each route is a 1:1 port of the corresponding HTML file's `<main>` content into a `+page.svelte`.

## SvelteKit config

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      strict: true
    })
    // No paths.base — custom domain serves from root.
  }
};
```

`fallback: '404.html'` produces a `build/404.html` that GitHub Pages will serve for 404s, replacing the current hand-written one.

## Stylesheet handling

The existing `assets/style.css` is moved verbatim to `static/assets/style.css`. The root layout links it:

```html
<link rel="stylesheet" href="/assets/style.css">
```

This keeps absolute `/assets/...` URLs working unchanged in any inline references and avoids touching the design.

A future iteration may migrate the stylesheet into Svelte component-scoped styles or a single global `app.css` imported by `+layout.svelte`. Out of scope for this design.

## CI / deploy

`.github/workflows/deploy.yml` lives inside this directory so it gets carried along by `git subtree push` and runs in the public repo (not in the monorepo).

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with: { path: build/ }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

GitHub Pages settings (one-time, manual): in `LilyDesignSystem/lilydesignsystem.github.io` repo settings, set Pages → Source = "GitHub Actions", and set the custom domain to `lilydesignsystem.com` (this is what `static/CNAME` automates after the first push).

## Author workflow (unchanged for daily edits)

1. Edit Svelte / TS / CSS in the monorepo at `lilydesignsystem.github.io/...`
2. (Optional) `pnpm dev` inside that directory for local preview at `http://localhost:5173`.
3. (Optional) `pnpm build && pnpm preview` for a production-mode local preview.
4. Commit in the monorepo.
5. `bin/git-subtree-push` pushes this directory to the public GH Pages repo.
6. The push triggers the deploy workflow; site is live in ~1 minute.

## Testing

Minimal — no behavior under test in v1. Verification gates:

1. `pnpm check` (svelte-check + tsc) passes locally.
2. `pnpm build` produces `build/index.html`, `build/about/index.html`, `build/components/index.html`, etc., a `build/404.html`, a `build/CNAME`, and a `build/_app/...` bundle.
3. `pnpm preview` renders all routes without console errors.
4. After first deploy: `https://lilydesignsystem.com/` returns 200; navigation between pages works; the components catalog renders all entries; 404 returns the styled fallback.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Subtree-pushed `node_modules`/`build` polluting the public repo | `.gitignore` lists both; the subtree only copies tracked files. |
| `CNAME` reset by Pages settings UI | `static/CNAME` is the source of truth and is recreated on every deploy. |
| First deploy fails because GitHub Pages source is still set to "Branch" | One-time manual switch to "GitHub Actions" in the public repo's settings. Documented in the migration plan. |
| `paths.base` confusion if the custom domain is ever dropped | The repo is `<org>.github.io`, so even without the custom domain it serves at `https://lilydesignsystem.github.io/` (root). `paths.base` stays empty in either case. |
| Existing inbound links to `/assets/style.css`, `/assets/favicon.svg`, `/assets/images/...` | Preserved by mirroring those paths under `static/assets/`. |
| Tutorial / comparison / claude / figma directories currently hold empty or 1-line markdown stubs | Each becomes a thin `+page.svelte` reproducing the existing one-line content under the same URL, preserving inbound links; content can be filled in later. |

## Out of scope

- Search across the components catalog (current site has none beyond simple list filtering).
- Authentication, comments, analytics.
- Migrating MDX or Markdown rendering — current pages are HTML-shaped, not content-heavy MD.
- Theming or design tokens — visual design is unchanged.
- DNS configuration at the registrar.

---

Lily™ and Lily Design System™ are trademarks.
