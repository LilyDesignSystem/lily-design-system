# lilydesignsystem.github.io SvelteKit Static Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `lilydesignsystem.github.io/` from hand-written static HTML into a SvelteKit + `adapter-static` project that is built and deployed by GitHub Actions to the custom domain `lilydesignsystem.com`.

**Architecture:** Source-only files committed to the directory; `build/` is gitignored. The directory is `git subtree push`-ed to the `LilyDesignSystem/lilydesignsystem.github.io` GitHub repo, which runs a GitHub Actions workflow to build and deploy the artifact via `actions/deploy-pages`. Custom domain is set via a checked-in `static/CNAME`. Every route is fully prerendered.

**Tech Stack:** Svelte ^5.25, SvelteKit ^2.55, `@sveltejs/adapter-static` ^3, Vite ^6, TypeScript ^5.8, pnpm 9, Node 20.

**Spec:** `docs/superpowers/specs/2026-05-02-github-io-svelte-static-design.md`

**Working directory for ALL tasks:** `lilydesignsystem.github.io/` (i.e. `/Users/jph/git/lilydesignsystem/lily-design-system/lilydesignsystem.github.io`). All paths in this plan are relative to that directory unless prefixed with the monorepo root `lily-design-system/`.

**Note on "TDD" framing:** This plan migrates static content with no business logic, so per-step Vitest tests would test nothing meaningful. Each task instead has explicit *verification gates* (build, check, preview, route smoke) that must pass before the commit step. Treat those gates with the same rigor as a failing-test-first cycle.

---

## File Structure (after plan completes)

```
lilydesignsystem.github.io/
├── .git-subtree-push                   (existing — unchanged)
├── .github/
│   └── workflows/
│       └── deploy.yml                  NEW
├── .gitignore                          MODIFIED
├── README.md → index.md                (existing — unchanged)
├── index.md                            (existing — unchanged, dev docs)
├── package.json                        NEW
├── pnpm-lock.yaml                      NEW (auto-generated)
├── svelte.config.js                    NEW
├── tsconfig.json                       NEW
├── vite.config.ts                      NEW
├── src/
│   ├── app.d.ts                        NEW
│   ├── app.html                        NEW
│   ├── lib/
│   │   └── components.ts               NEW (data from old assets/components-data.js, re-typed)
│   └── routes/
│       ├── +layout.svelte              NEW (site chrome)
│       ├── +layout.ts                  NEW (prerender + trailingSlash)
│       ├── +page.svelte                NEW (home)
│       ├── about/+page.svelte          NEW
│       ├── components/+page.svelte     NEW (search/filter via $state)
│       ├── examples/+page.svelte       NEW
│       ├── help/+page.svelte           NEW
│       ├── comparisons/+page.svelte    NEW (stub)
│       ├── lily-claude-code/+page.svelte    NEW (stub)
│       ├── lily-claude-design/+page.svelte  NEW (stub)
│       ├── lily-figma/+page.svelte          NEW (stub)
│       └── tutorials/
│           ├── +page.svelte            NEW (index)
│           ├── blazor/+page.svelte     NEW (stub)
│           ├── html/+page.svelte       NEW (stub)
│           ├── react/+page.svelte      NEW (stub)
│           ├── svelte/+page.svelte     NEW (stub)
│           └── vue/+page.svelte        NEW (stub)
└── static/
    ├── CNAME                           NEW (contents: lilydesignsystem.com)
    ├── .nojekyll                       MOVED from root
    ├── robots.txt                      MOVED from root
    ├── sitemap.xml                     MOVED from root
    └── assets/
        ├── style.css                   MOVED from old assets/
        ├── favicon.svg                 MOVED from old assets/
        └── images/                     MOVED from old assets/

REMOVED at end of plan (Task 14):
- 404.html
- index.html
- about/index.html
- components/index.html
- examples/index.html
- help/index.html
- comparisons/index.md
- lily-claude-code/index.md
- lily-claude-design/index.md
- lily-figma/index.md
- tutorials/{blazor,html,react,svelte,vue}/  (any existing children)
- assets/components.js
- assets/components-data.js
```

---

## Task 1: Scaffold SvelteKit project files

**Files:**
- Create: `package.json`
- Create: `svelte.config.js`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/app.html`
- Create: `src/app.d.ts`
- Modify: `.gitignore`

- [ ] **Step 1.1: Create `package.json`**

```json
{
  "name": "lilydesignsystem.github.io",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.55.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "svelte": "^5.25.0",
    "svelte-check": "^4.2.0",
    "typescript": "^5.8.0",
    "vite": "^6.2.0"
  },
  "pnpm": {
    "ignoredBuiltDependencies": ["esbuild"],
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

- [ ] **Step 1.2: Create `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      strict: true
    })
  }
};

export default config;
```

- [ ] **Step 1.3: Create `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
});
```

- [ ] **Step 1.4: Create `tsconfig.json`**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 1.5: Create `src/app.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/assets/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="%sveltekit.assets%/assets/style.css" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 1.6: Create `src/app.d.ts`**

```ts
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
```

- [ ] **Step 1.7: Update `.gitignore`**

Read the current `.gitignore`:
```
.DS_Store
.idea/
.vscode/
node_modules/
*.log
.claude
```

Replace with:
```
.DS_Store
.idea/
.vscode/
node_modules/
*.log
.claude
.svelte-kit/
build/
.env
.env.*
!.env.example
```

- [ ] **Step 1.8: Install dependencies**

Run: `pnpm install`
Expected: pnpm creates `node_modules/` and writes `pnpm-lock.yaml`. No build errors.

- [ ] **Step 1.9: Verify SvelteKit setup builds (no routes yet — expected to fail strictly)**

Run: `pnpm exec svelte-kit sync`
Expected: completes without error. Creates `.svelte-kit/` with generated types.

- [ ] **Step 1.10: Commit**

```bash
git add .gitignore package.json pnpm-lock.yaml svelte.config.js vite.config.ts tsconfig.json src/app.html src/app.d.ts
git commit -m "Scaffold SvelteKit project for lilydesignsystem.github.io"
```

---

## Task 2: Migrate static assets to `static/`

**Files:**
- Move: `assets/style.css` → `static/assets/style.css`
- Move: `assets/favicon.svg` → `static/assets/favicon.svg`
- Move: `assets/images/` → `static/assets/images/`
- Move: `robots.txt` → `static/robots.txt`
- Move: `sitemap.xml` → `static/sitemap.xml`
- Move: `.nojekyll` → `static/.nojekyll`
- Create: `static/CNAME`

- [ ] **Step 2.1: Create the `static/assets/` directory and move stylesheet**

```bash
mkdir -p static/assets
git mv assets/style.css static/assets/style.css
git mv assets/favicon.svg static/assets/favicon.svg
git mv assets/images static/assets/images
```

- [ ] **Step 2.2: Move robots, sitemap, nojekyll**

```bash
git mv robots.txt static/robots.txt
git mv sitemap.xml static/sitemap.xml
git mv .nojekyll static/.nojekyll
```

- [ ] **Step 2.3: Create `static/CNAME`**

File contents (no trailing newline beyond a single one):
```
lilydesignsystem.com
```

- [ ] **Step 2.4: Verify the static layout**

Run: `ls static/`
Expected output includes: `.nojekyll  CNAME  assets  robots.txt  sitemap.xml`

Run: `ls static/assets/`
Expected output includes: `favicon.svg  images  style.css`

- [ ] **Step 2.5: Commit**

```bash
git add static/CNAME
git commit -m "Move static assets into SvelteKit static/ directory and add CNAME"
```

(The `git mv` invocations in 2.1–2.2 already staged the renames. This commit also picks up the new `static/CNAME`.)

---

## Task 3: Create the components data module

**Files:**
- Create: `src/lib/components.ts`
- Reference for input data: `assets/components-data.js` (still on disk after Task 2; Task 14 deletes the leftover empty `assets/` parent if applicable, but `assets/components-data.js` and `assets/components.js` are deleted in Task 14 too).

- [ ] **Step 3.1: Create `src/lib/components.ts` skeleton**

Create the file with this exact preamble — leave the array body empty for now, you'll fill it in step 3.2:

```ts
// Lily component catalog — generated from components.tsv
// Components across HTML, Svelte, React, Vue, Blazor, Nunjucks headless

export type LilyComponent = {
  name: string;
  pascal: string;
  description: string;
};

export const LILY_COMPONENTS: LilyComponent[] = [
];
```

- [ ] **Step 3.2: Copy the data lines from the old file**

Open `assets/components-data.js`. Lines 5–410 (content lines, not including the closing `];`) are object literals like:

```js
  { name: "accordion-checkbox", pascal: "AccordionCheckbox", description: "..." },
```

Copy those lines verbatim into the empty `LILY_COMPONENTS` array body in `src/lib/components.ts`. Object-literal syntax is identical between JS and TS — no edits to the lines themselves are needed.

After this step, `src/lib/components.ts` should contain ~410 component entries.

- [ ] **Step 3.3: Type-check**

Run: `pnpm check`
Expected: 0 errors, 0 warnings on `src/lib/components.ts`. (Other files may be missing — that's fine; we'll add them in later tasks. Check this file specifically.)

- [ ] **Step 3.4: Commit**

```bash
git add src/lib/components.ts
git commit -m "Add typed component catalog module"
```

---

## Task 4: Create the root layout and prerender opt-in

**Files:**
- Create: `src/routes/+layout.svelte`
- Create: `src/routes/+layout.ts`

The site chrome (skip-link, header, nav, footer) currently appears verbatim on every HTML page. Pull it into the layout once.

- [ ] **Step 4.1: Create `src/routes/+layout.ts`**

```ts
export const prerender = true;
export const trailingSlash = 'always';
```

- [ ] **Step 4.2: Create `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import { page } from '$app/stores';

  let { children } = $props();

  type NavLink = { href: string; label: string };
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/components/', label: 'Components' },
    { href: '/examples/', label: 'Examples' },
    { href: '/help/', label: 'Help' }
  ];

  function isCurrent(href: string): boolean {
    return $page.url.pathname === href;
  }
</script>

<a class="skip-link" href="#main">Skip to main content</a>

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href="/" aria-label="Lily Design System home">
      <img
        class="site-brand-mark"
        src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg"
        alt=""
        aria-hidden="true"
      />
      <span>Lily Design System</span>
    </a>
    <nav class="site-nav" aria-label="Main">
      {#each navLinks as link}
        <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
          {link.label}
        </a>
      {/each}
      <a href="https://github.com/LilyDesignSystem">GitHub</a>
    </nav>
  </div>
</header>

<main id="main" class="site-main">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <p>© Lily Design System. Free open source — BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0.</p>
    <div class="site-footer-links">
      <a href="https://github.com/LilyDesignSystem">GitHub</a>
      <a href="/about/">About</a>
      <a href="/help/">Help</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 4.3: Verify layout type-checks**

Run: `pnpm check`
Expected: no errors specifically about `src/routes/+layout.svelte` or `+layout.ts`. (Build will still fail because there's no `+page.svelte` yet — that's fine.)

- [ ] **Step 4.4: Commit**

```bash
git add src/routes/+layout.svelte src/routes/+layout.ts
git commit -m "Add root layout with site chrome and full prerender opt-in"
```

---

## Task 5: Home route

**Files:**
- Create: `src/routes/+page.svelte`

Port the existing `index.html` body — hero, quick-start, and the "all components, alphabetical" list. The list now reads from the typed catalog instead of a global.

- [ ] **Step 5.1: Create `src/routes/+page.svelte`**

```svelte
<script lang="ts">
  import { LILY_COMPONENTS } from '$lib/components';
</script>

<svelte:head>
  <title>Lily Design System&trade;</title>
  <meta
    name="description"
    content="Lily is a free, open-source, accessible, headless design system with components across HTML, Svelte, React, Vue, Blazor, and Nunjucks."
  />
</svelte:head>

<section class="hero">
  <img
    class="hero-logo"
    src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg"
    alt=""
    aria-hidden="true"
  />
  <p class="hero-eyebrow">Free, open source, accessible</p>
  <h1>Build products faster.</h1>
  <p class="hero-tagline">
    Lily is a free design system with headless components for HTML, Svelte,
    React, Vue, Blazor, and Nunjucks. Bring your own styles — keep accessibility
    and i18n built in.
  </p>
  <div class="button-row">
    <a class="button button-primary" href="/components/">Browse components</a>
    <a class="button button-secondary" href="/help/">Get started</a>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Quick start</p>
    <h2>Try Lily in 30 seconds</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>Pick the framework you use. Browse the source. Copy a component. Style it.</p>
    <p>
      Each component is a single file — no runtime, no compiler magic, no design
      tokens you didn't ask for. Headless components export semantic HTML with the
      kebab-case class name; you write the CSS.
    </p>

    <pre><code>{`<!-- HTML headless: Button -->
<button class="button" type="button" aria-label="Save">
  Save
</button>`}</code></pre>

    <pre><code>{`// React headless: Button
import Button from "lily-design-system-react-headless/components/Button";

<Button onClick={save}>Save</Button>`}</code></pre>

    <p style="text-align: center; margin-top: 2rem;">
      <a class="button button-primary" href="/help/">Read the full setup guide →</a>
    </p>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Catalog</p>
    <h2>All components, alphabetical</h2>
  </header>

  <ul class="component-list component-list-stacked" aria-label="All components">
    {#each LILY_COMPONENTS as component (component.name)}
      <li class="component-list-item">
        <span class="component-list-item-name">{component.name}</span>
        <span class="component-list-item-description">{component.description}</span>
      </li>
    {/each}
  </ul>
</section>
```

- [ ] **Step 5.2: Run dev server and visit `/`**

Run: `pnpm dev`
In browser: `http://localhost:5173/`
Expected:
- Hero with logo, eyebrow, h1 "Build products faster.", tagline, two buttons.
- Quick-start section with two code blocks.
- Component catalog section listing the full alphabetical list (~407 entries).
- No console errors.

Stop the dev server with Ctrl-C.

- [ ] **Step 5.3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "Add home route with hero, quick-start, and component catalog list"
```

---

## Task 6: About route

**Files:**
- Create: `src/routes/about/+page.svelte`

- [ ] **Step 6.1: Create `src/routes/about/+page.svelte`**

```svelte
<svelte:head>
  <title>About — Lily Design System</title>
  <meta
    name="description"
    content="What Lily is, the principles behind it, and the design systems it draws inspiration from."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">About</p>
  <h1>What is Lily?</h1>
  <p class="hero-tagline">
    A free, open-source, accessible-first design system that meets you where you
    code — and gets out of your way when you don't need it.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>The short version</h2>
  <p>
    Lily is a catalog of <strong>web components</strong>, each implemented in
    six headless flavors (HTML, Svelte, React, Vue, Blazor, Nunjucks) plus a set
    of batteries-included example apps that show how to style them.
  </p>
  <p>
    The headless versions ship <em>zero CSS</em>. They give you semantic HTML, ARIA
    roles and states, keyboard support, and i18n-friendly props. You bring the
    visual design.
  </p>

  <h2>Design principles</h2>

  <h3>Accessible</h3>
  <p>
    Every component starts from semantic HTML. ARIA is layered on only where the
    HTML alone can't express the pattern. Components target
    <strong>WCAG 2.2 AAA</strong> — colors, spacing, focus, and keyboard
    navigation are all considered.
  </p>

  <h3>Composable</h3>
  <p>
    Lily favors small, single-purpose components that snap together. Compound
    patterns appear over and over:
  </p>
  <ul>
    <li><code>Nav → List → ListItem</code> — for breadcrumbs, contents lists, accordion menus, tree menus, and pagination</li>
    <li><code>Form → Field → Input</code> — for any form layout with labels, hints, and errors</li>
    <li><code>Table → Head/Body/Foot → Row → Data</code> — for tables, calendars, gantt charts, and kanban boards</li>
    <li><code>Bar → BarButton</code> — for tool bars, tab bars, task bars, action bars, and menu bars</li>
    <li><code>Picker → PickerButton</code> — for color pickers, rating pickers, theme pickers</li>
  </ul>

  <h3>Internationalizable</h3>
  <p>
    Not a single user-facing string is hardcoded. Labels, placeholders, error
    messages, button text — all parameters. Drop in your own translation system
    and Lily speaks any language you do.
  </p>

  <h3>Headless</h3>
  <p>
    Headless components have <strong>no CSS</strong>, no
    <code>&lt;style&gt;</code> blocks, no design tokens you didn't opt into. They
    expose a single kebab-case class name on each root element so you can target
    them however you like — semantic CSS, Tailwind, CSS-in-JS, your call.
  </p>

  <h3>Batteries-included examples</h3>
  <p>
    The example apps show how to style the components for real use — what design
    tokens to set, what variations to add, how to compose pages. They are full
    SvelteKit, Next.js, Nuxt, Blazor, and Eleventy apps, not just sandboxes.
  </p>

  <h2 id="inspirations">Inspirations</h2>
  <p>
    Lily draws patterns and language from a deliberately broad set of design
    systems:
  </p>
  <ul>
    <li><a href="https://design-system.service.gov.uk/">GOV.UK Design System</a></li>
    <li><a href="https://designsystem.digital.gov/">U.S. Web Design System (USWDS)</a></li>
    <li><a href="https://github.com/ONSdigital/design-system">ONSdigital design system</a></li>
    <li><a href="https://designsystemau.org/">Design System AU (Australian Government)</a></li>
    <li><a href="https://protocol.mozilla.org/">Mozilla Protocol</a></li>
    <li><a href="https://spectrum.adobe.com/">Adobe Spectrum</a></li>
    <li><a href="https://ant.design/">Ant Design</a></li>
    <li><a href="https://design.wonderflow.ai/">Wonderflow Wanda</a></li>
    <li><a href="https://daisyui.com/">DaisyUI</a></li>
    <li><a href="https://ui.shadcn.com/">shadcn/ui</a></li>
    <li><a href="https://github.com/reuters-graphics/graphics-components">Reuters graphics components</a></li>
  </ul>

  <h2>License</h2>
  <p>
    Lily is multi-licensed under <strong>BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0</strong>.
    Pick whichever license fits your project. If none of those work, get in touch.
  </p>

  <h2>Contact</h2>
  <p>
    Project lead: Joel Parker Henderson —
    <a href="mailto:joel@joelparkerhenderson.com">joel@joelparkerhenderson.com</a>.
  </p>
  <p>
    Found a bug, have an idea, want to contribute a component? Open an issue or
    a pull request on
    <a href="https://github.com/LilyDesignSystem">GitHub</a>.
  </p>

  <div class="callout">
    <p style="margin: 0;">
      <strong>Status:</strong> Lily is brand-new work and we welcome
      collaboration, guidance, and feedback. Things will move and evolve.
    </p>
  </div>
</section>
```

> Note: the existing `help/index.html` links to `../about/#inspirations`. The `id="inspirations"` on the H2 above preserves that anchor.

- [ ] **Step 6.2: Smoke-test in dev**

Run: `pnpm dev`
Visit: `http://localhost:5173/about/`
Expected: full About page renders; the "About" nav link in the header has `aria-current="page"`; no console errors.
Stop the dev server.

- [ ] **Step 6.3: Commit**

```bash
git add src/routes/about/+page.svelte
git commit -m "Add about route"
```

---

## Task 7: Components route with search and tag filtering

**Files:**
- Create: `src/routes/components/+page.svelte`

This is the only route with non-trivial behavior. Reimplement `assets/components.js` (~67 lines of vanilla JS) using Svelte 5 runes — no DOM lookups, just `$state` and `$derived`.

- [ ] **Step 7.1: Create `src/routes/components/+page.svelte`**

```svelte
<script lang="ts">
  import { LILY_COMPONENTS, type LilyComponent } from '$lib/components';

  let query = $state('');

  const tags: { label: string; filter: string }[] = [
    { label: 'buttons', filter: 'button' },
    { label: 'inputs', filter: 'input' },
    { label: 'lists', filter: 'list' },
    { label: 'tables', filter: 'table' },
    { label: 'navigation', filter: 'nav' },
    { label: 'dialogs', filter: 'dialog' },
    { label: 'pickers', filter: 'picker' },
    { label: 'layouts', filter: 'layout' },
    { label: 'cards', filter: 'card' },
    { label: 'all', filter: '' }
  ];

  const total = LILY_COMPONENTS.length;

  const matches: LilyComponent[] = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LILY_COMPONENTS;
    return LILY_COMPONENTS.filter(
      (c) =>
        c.name.includes(q) ||
        c.pascal.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  });

  const countLine: string = $derived(
    matches.length === total
      ? 'Showing all components.'
      : `Showing ${matches.length} components.`
  );

  function applyTag(filter: string) {
    query = filter;
  }
</script>

<svelte:head>
  <title>Components — Lily Design System</title>
  <meta
    name="description"
    content="Browse all components in the Lily Design System. Search by name or description to find what you need."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Catalog</p>
  <h1>All Lily components</h1>
  <p class="hero-tagline">
    Each component is implemented in HTML, Svelte, React, Vue, Blazor, and
    Nunjucks. Search by name or description.
  </p>
</section>

<section class="section">
  <ul class="tag-list" aria-label="Common categories">
    {#each tags as tag}
      <li>
        <button
          type="button"
          class="tag"
          onclick={() => applyTag(tag.filter)}
        >
          {tag.label}
        </button>
      </li>
    {/each}
  </ul>

  <label
    for="component-search"
    style="display: block; font-weight: 600; margin-bottom: 0.5rem;"
  >
    Search components
  </label>
  <input
    id="component-search"
    class="component-search"
    type="search"
    placeholder="Try: button, input, list, table, accordion…"
    autocomplete="off"
    bind:value={query}
  />

  <p class="component-count-line" aria-live="polite">{countLine}</p>

  <ul class="component-list component-list-stacked" aria-label="Component list">
    {#each matches as component (component.name)}
      <li class="component-list-item">
        <span class="component-list-item-name">{component.name}</span>
        <span class="component-list-item-description">{component.description}</span>
      </li>
    {/each}
  </ul>
</section>
```

> Behavior change vs. legacy: tag chips were `<a href="#" data-filter="...">` rendered as anchors but used purely as buttons (every click called `e.preventDefault()`). Replace them with `<button>` elements — semantically correct, no fake-link behavior. The `.tag` CSS class keeps the visual styling identical. The `<noscript>` block from the legacy page is dropped: with prerendering, the catalog list is in the static HTML even when JS is disabled (only the search input becomes inert).

- [ ] **Step 7.2: Smoke-test in dev**

Run: `pnpm dev`
Visit: `http://localhost:5173/components/`
Expected:
- Full alphabetical list renders before any typing.
- Typing "button" filters the list and the count line updates to e.g. "Showing 21 components."
- Clicking the "tables" tag chip populates the search input and filters the list.
- Clicking "all" clears the input.
- No console errors.

Stop the dev server.

- [ ] **Step 7.3: Commit**

```bash
git add src/routes/components/+page.svelte
git commit -m "Add components route with search and tag filtering"
```

---

## Task 8: Examples route

**Files:**
- Create: `src/routes/examples/+page.svelte`

- [ ] **Step 8.1: Create `src/routes/examples/+page.svelte`**

```svelte
<svelte:head>
  <title>Examples — Lily Design System</title>
  <meta
    name="description"
    content="Worked example apps that show how to style Lily components in HTML, Svelte, React, Vue, Blazor, and Eleventy."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Examples</p>
  <h1>See Lily in real apps</h1>
  <p class="hero-tagline">
    Six worked example projects show how to take the headless components, layer
    on styling, and ship a real website. Pick the framework you use.
  </p>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Batteries-included</p>
    <h2>Demo apps with full CSS and routing</h2>
  </header>

  <div class="card-grid">
    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-html-css-js-examples">
      <h3 class="card-heading">HTML JavaScript</h3>
      <p class="card-description">
        Plain HTML pages, vanilla JavaScript, no build tools. Drops into any
        static host — perfect for tiny sites and progressive enhancement.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-svelte-sveltekit-examples">
      <h3 class="card-heading">Svelte + SvelteKit</h3>
      <p class="card-description">
        SvelteKit app using Svelte 5 runes. Component routes, file-based
        routing, and a styled storybook of every component.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-react-next-examples">
      <h3 class="card-heading">React + Next.js</h3>
      <p class="card-description">
        Next.js 15 app showing each component in context, with TypeScript
        throughout and demo pages for compound patterns.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-vue-nuxt-examples">
      <h3 class="card-heading">Vue + Nuxt.js</h3>
      <p class="card-description">
        Nuxt 3 app. <code>&lt;script setup&gt;</code> and the Composition API
        across every demo route.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-blazor-web-examples">
      <h3 class="card-heading">Blazor Web</h3>
      <p class="card-description">
        Blazor Web app with Razor components. Server- and WebAssembly-friendly,
        with .NET 10 baseline.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-nunjucks-eleventy-examples">
      <h3 class="card-heading">Nunjucks + Eleventy</h3>
      <p class="card-description">
        Eleventy site using Nunjucks macros. Ideal for content-heavy static
        sites that still want a real component system.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">What's inside</p>
    <h2>Every example app has the same shape</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>To make framework-hopping feel familiar, every example app provides:</p>
    <ul>
      <li>A welcome route at <code>/</code> that introduces the project.</li>
      <li>A components index at <code>/components</code> that lists every component.</li>
      <li>A demo page per component at <code>/components/&lt;component&gt;</code>.</li>
      <li>Real CSS — not abstract design tokens — so you can crib styles directly.</li>
      <li>Working keyboard navigation and focus management out of the box.</li>
    </ul>

    <h3>Need to see how a single component is styled?</h3>
    <p>
      Open the relevant example app, navigate to
      <code>/components/&lt;name&gt;</code>, and copy the markup and CSS into your
      own project. The example apps deliberately use plain CSS (or near-plain) so
      you can adapt them to any system you prefer.
    </p>

    <h3>Want headless instead?</h3>
    <p>
      Pair any of the example apps with their corresponding <em>headless</em>
      package — those publish the same components without any CSS, ready for
      your own design tokens.
    </p>
    <p>
      <a class="button button-primary" href="/components/">Browse the catalog →</a>
      <a class="button button-secondary" href="/help/">Read the setup guide</a>
    </p>
  </div>
</section>
```

- [ ] **Step 8.2: Smoke-test**

Run: `pnpm dev`
Visit: `http://localhost:5173/examples/`
Expected: hero, six cards in a grid linking to the example repos, "What's inside" section. Nav header "Examples" link is current.
Stop the dev server.

- [ ] **Step 8.3: Commit**

```bash
git add src/routes/examples/+page.svelte
git commit -m "Add examples route"
```

---

## Task 9: Help route

**Files:**
- Create: `src/routes/help/+page.svelte`

This is the longest page; it's mostly content. Port verbatim.

- [ ] **Step 9.1: Create `src/routes/help/+page.svelte`**

```svelte
<svelte:head>
  <title>Help — Lily Design System</title>
  <meta
    name="description"
    content="Get started with Lily: install the headless package for your framework, copy a component, style it, ship it."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Help</p>
  <h1>Getting started with Lily</h1>
  <p class="hero-tagline">
    Pick a framework, clone the headless repo or the example app, and start
    composing your own pages.
  </p>
</section>

<nav aria-label="On this page" class="prose" style="margin: 0 auto;">
  <p><strong>On this page:</strong></p>
  <ul>
    <li><a href="#install">Install</a></li>
    <li><a href="#use-headless">Use a headless component</a></li>
    <li><a href="#use-styled">Use a styled example</a></li>
    <li><a href="#styling">Styling and design tokens</a></li>
    <li><a href="#a11y">Accessibility</a></li>
    <li><a href="#i18n">Internationalization</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
</nav>

<section class="section prose" id="install" style="margin: 0 auto;">
  <h2>Install</h2>
  <p>
    Lily is published as separate Git repos per framework. The fastest way to try
    it is to clone the headless repo for your stack:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-react-headless
cd lily-design-system-react-headless
pnpm install`}</code></pre>
  <p>The same pattern works for the other frameworks:</p>
  <ul>
    <li><code>lily-design-system-html-headless</code> — no install needed; copy <code>.html</code> files</li>
    <li><code>lily-design-system-svelte-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-react-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-vue-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-nunjucks-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-blazor-headless</code> — <code>dotnet build</code> (in progress)</li>
  </ul>
  <p>
    Lily is being released bit-by-bit; npm/PyPI/NuGet packaging is on the
    roadmap. For now, treat the source as the source of truth and copy what you
    need.
  </p>
</section>

<section class="section prose" id="use-headless" style="margin: 0 auto;">
  <h2>Use a headless component</h2>
  <p>
    Headless components ship semantic HTML, ARIA, and props — but no CSS. Here's
    a Button in each framework:
  </p>

  <h3>HTML</h3>
  <pre><code>{`<button class="button" type="button" aria-label="Save">
  Save
</button>`}</code></pre>

  <h3>Svelte</h3>
  <pre><code>{`<script>
  import Button from "lily-design-system-svelte-headless/components/Button/Button.svelte";
</script>

<Button onclick={save}>Save</Button>`}</code></pre>

  <h3>React</h3>
  <pre><code>{`import Button from "lily-design-system-react-headless/components/Button";

<Button onClick={save}>Save</Button>`}</code></pre>

  <h3>Vue</h3>
  <pre><code>{`<script setup>
  import Button from "lily-design-system-vue-headless/components/Button.vue";
</script>

<Button @click="save">Save</Button>`}</code></pre>

  <h3>Nunjucks</h3>
  <pre><code>{`{% from "components/button/macro.njk" import button %}

{{ button({ text: "Save", type: "button" }) }}`}</code></pre>
</section>

<section class="section prose" id="use-styled" style="margin: 0 auto;">
  <h2>Use a styled example</h2>
  <p>
    The example apps include CSS, routes, and full demo pages. The fastest way
    to experiment is to start the SvelteKit, Next, Nuxt, or Eleventy example
    app and view the demo at <code>/components</code>.
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-sveltekit-examples
cd lily-design-system-svelte-sveltekit-examples
pnpm install
pnpm run dev`}</code></pre>
  <p>
    Then open <code>http://localhost:5173</code> and browse <code>/components</code>.
  </p>
</section>

<section class="section prose" id="styling" style="margin: 0 auto;">
  <h2>Styling and design tokens</h2>
  <p>
    Each component renders with a single kebab-case class on its root element.
    For example, <code>&lt;Button&gt;</code> renders <code>&lt;button class="button"&gt;</code>.
    Style it however you like:
  </p>
  <pre><code>{`.button {
  background: var(--my-primary);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
.button:hover { background: var(--my-primary-hover); }`}</code></pre>
  <p>The default Lily color palette (used in the example apps) is:</p>
  <ul>
    <li>Primary: <code>#2563eb</code></li>
    <li>Danger: <code>#dc2626</code></li>
    <li>Warning: <code>#f59e0b</code></li>
    <li>Success: <code>#16a34a</code></li>
    <li>Page background: <code>#f9fafb</code></li>
    <li>Card background: <code>#ffffff</code></li>
  </ul>
  <p>
    These are suggestions, not requirements. Replace them with your own brand
    palette and Lily comes along happily.
  </p>
</section>

<section class="section prose" id="a11y" style="margin: 0 auto;">
  <h2>Accessibility</h2>
  <p>Components target <strong>WCAG 2.2 AAA</strong>. They follow these patterns:</p>
  <ul>
    <li>Semantic HTML elements over generic <code>&lt;div&gt;</code>s.</li>
    <li><code>&lt;label for="id"&gt;</code> linking labels to inputs.</li>
    <li><code>aria-labelledby</code> / <code>aria-describedby</code> for cross-references.</li>
    <li><code>aria-invalid</code> + <code>aria-errormessage</code> for error states.</li>
    <li><code>role="alert"</code> and <code>aria-live</code> for dynamic content.</li>
    <li><code>aria-pressed</code>, <code>aria-expanded</code>, <code>aria-current</code> for state.</li>
    <li>Roving <code>tabindex</code> for grids.</li>
  </ul>
  <p>
    Focus indicators are intentionally consumer-supplied — Lily never paints a
    default focus ring that conflicts with your design.
  </p>
</section>

<section class="section prose" id="i18n" style="margin: 0 auto;">
  <h2>Internationalization</h2>
  <p>
    Every label, placeholder, error message, and button text is a prop. There
    are no hardcoded strings. Drop in your translation framework of choice —
    Paraglide, i18next, vue-i18n, react-intl, .resx files, anything.
  </p>
  <p>
    For dates, numbers, and currencies, the components accept pre-formatted
    strings: you format with <code>Intl.DateTimeFormat</code> /
    <code>Intl.NumberFormat</code> / your preferred library and pass the result.
  </p>
</section>

<section class="section prose" id="testing" style="margin: 0 auto;">
  <h2>Testing</h2>
  <p>Each framework subproject ships its own tests using its idiomatic stack:</p>
  <ul>
    <li><strong>HTML</strong>: WebDriverIO running real browsers.</li>
    <li><strong>Svelte</strong>: Vitest + <code>@testing-library/svelte</code>.</li>
    <li><strong>React</strong>: Vitest + <code>@testing-library/react</code>.</li>
    <li><strong>Vue</strong>: Vitest + <code>@testing-library/vue</code>.</li>
    <li><strong>Nunjucks</strong>: Vitest with a render helper.</li>
    <li><strong>Blazor</strong>: bUnit (planned).</li>
  </ul>
  <p>
    Tests use <strong>Vitest's built-in matchers only</strong> — never
    <code>jest-dom</code> matchers. This keeps the test suites portable.
  </p>
</section>

<section class="section prose" id="contributing" style="margin: 0 auto;">
  <h2>Contributing</h2>
  <p>Lily is brand-new and welcomes collaboration. The most useful contributions right now are:</p>
  <ul>
    <li>New components (especially patterns from established design systems).</li>
    <li>Better example styling — show off what's possible.</li>
    <li>Translations of example app strings.</li>
    <li>Bug reports with a minimal reproduction.</li>
    <li>Accessibility audits with screen readers and assistive tech.</li>
  </ul>
  <p>
    Open issues and PRs against the relevant repo at
    <a href="https://github.com/LilyDesignSystem">github.com/LilyDesignSystem</a>.
  </p>
</section>

<section class="section prose" id="faq" style="margin: 0 auto;">
  <h2>FAQ</h2>

  <details class="faq-item">
    <summary>Why headless instead of styled?</summary>
    <p>
      Pre-styled components are convenient — until they don't match your brand.
      Headless components are slightly more work up front but give you total
      control over the visual design. The example apps show one way to style
      them; you can take that or replace it entirely.
    </p>
  </details>

  <details class="faq-item">
    <summary>Why so many components?</summary>
    <p>
      Lily aims to cover the patterns most apps need without forcing you to build
      them from scratch. The catalog draws from a dozen established design
      systems plus original work — see <a href="/about/#inspirations">About</a>.
    </p>
  </details>

  <details class="faq-item">
    <summary>Can I use Lily with Tailwind?</summary>
    <p>
      Yes. Each component exposes a single kebab-case root class plus a
      consumer-provided <code>className</code> / <code>class</code>. Layer
      Tailwind utilities on top however you like.
    </p>
  </details>

  <details class="faq-item">
    <summary>Can I use Lily with semantic CSS frameworks like DaisyUI?</summary>
    <p>
      Yes. The kebab-case class names on the root element work as semantic CSS
      hooks. Pair Lily with a semantic framework and you get pre-styled
      components that still respect ARIA and i18n.
    </p>
  </details>

  <details class="faq-item">
    <summary>Is there an npm package?</summary>
    <p>
      Not yet. The headless repos are intended to be cloned and used directly,
      or vendored into your project. npm/PyPI/NuGet publishing is on the
      roadmap.
    </p>
  </details>

  <details class="faq-item">
    <summary>Why multi-licensed?</summary>
    <p>
      Different projects have different license needs. BSD and MIT are
      permissive, Apache-2.0 has a patent grant, and the GPL options support
      copyleft. Choose whichever fits your situation.
    </p>
  </details>

  <details class="faq-item">
    <summary>How do I report a bug or request a feature?</summary>
    <p>
      Open an issue on the relevant GitHub repo, or email
      <a href="mailto:joel@joelparkerhenderson.com">joel@joelparkerhenderson.com</a>.
    </p>
  </details>
</section>
```

> Note: the legacy "Why so many components?" answer linked to `../about/#inspirations`. Updated to the absolute path `/about/#inspirations` (matches Task 6's anchor).

- [ ] **Step 9.2: Smoke-test**

Run: `pnpm dev`
Visit: `http://localhost:5173/help/`
Expected: every section renders; "On this page" anchor links jump to their sections; FAQ details expand on click.
Stop the dev server.

- [ ] **Step 9.3: Commit**

```bash
git add src/routes/help/+page.svelte
git commit -m "Add help route"
```

---

## Task 10: Stub routes (comparisons, claude-code, claude-design, figma, tutorials)

**Files:**
- Create: `src/routes/comparisons/+page.svelte`
- Create: `src/routes/lily-claude-code/+page.svelte`
- Create: `src/routes/lily-claude-design/+page.svelte`
- Create: `src/routes/lily-figma/+page.svelte`
- Create: `src/routes/tutorials/+page.svelte`
- Create: `src/routes/tutorials/blazor/+page.svelte`
- Create: `src/routes/tutorials/html/+page.svelte`
- Create: `src/routes/tutorials/react/+page.svelte`
- Create: `src/routes/tutorials/svelte/+page.svelte`
- Create: `src/routes/tutorials/vue/+page.svelte`

These pages currently exist as 1- to 11-line markdown stubs (the markdown is not actually rendered today; visiting these URLs just lists the directory or 404s, depending on GH Pages config). Each stub becomes a thin Svelte page that says the same thing and preserves the URL.

The legacy markdown content for each stub is:

- `comparisons/index.md` — heading "Comparisons" plus a 7-row markdown table comparing Lily™ to other design systems.
- `lily-claude-code/index.md` — heading "Lily + Claude Code", no body.
- `lily-claude-design/index.md` — heading "Lily + Claude Design", no body.
- `lily-figma/index.md` — heading "Lily + Figma", no body.

The plan inlines this content below; you do not need to read the legacy files.

- [ ] **Step 10.1: Create `src/routes/comparisons/+page.svelte`**

```svelte
<svelte:head>
  <title>Comparisons — Lily Design System</title>
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Comparisons</p>
  <h1>Comparisons</h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <table>
    <thead>
      <tr>
        <th>Design system</th>
        <th>Headless</th>
        <th>Frameworks</th>
        <th>Accessibility</th>
        <th>License</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Lily</td><td>Yes</td><td>HTML, Svelte, React, Vue, Blazor, Nunjucks</td><td>WCAG 2.2 AAA</td><td>BSD, MIT, Apache-2.0, GPL-2.0, GPL-3.0</td></tr>
      <tr><td>GOV.UK Design System</td><td>No</td><td>Nunjucks</td><td>WCAG 2.2 AA</td><td>MIT</td></tr>
      <tr><td>U.S. Web Design System</td><td>No</td><td>HTML, Twig</td><td>WCAG 2.1 AA</td><td>Public domain (CC0)</td></tr>
      <tr><td>Adobe Spectrum</td><td>No</td><td>React, Web Components</td><td>WCAG 2.1 AA</td><td>Apache-2.0</td></tr>
      <tr><td>Ant Design</td><td>No</td><td>React, Vue, Angular</td><td>WCAG 2.1 AA</td><td>MIT</td></tr>
      <tr><td>shadcn/ui</td><td>Yes</td><td>React</td><td>WCAG 2.1 AA</td><td>MIT</td></tr>
      <tr><td>DaisyUI</td><td>No</td><td>HTML/CSS</td><td>WCAG 2.1 AA</td><td>MIT</td></tr>
    </tbody>
  </table>
</section>
```

- [ ] **Step 10.2: Create the three "Lily + X" stubs using the same shape**

Each file is identical except for the heading text. Substitute `<HEADING>` from this list:

| File | `<HEADING>` |
|------|-------------|
| `src/routes/lily-claude-code/+page.svelte` | `Lily + Claude Code` |
| `src/routes/lily-claude-design/+page.svelte` | `Lily + Claude Design` |
| `src/routes/lily-figma/+page.svelte` | `Lily + Figma` |

```svelte
<svelte:head>
  <title><HEADING> — Lily Design System</title>
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow"><HEADING></p>
  <h1><HEADING></h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p>This page is a placeholder. Content coming soon.</p>
</section>
```

- [ ] **Step 10.3: Create `src/routes/tutorials/+page.svelte` (index page)**

```svelte
<svelte:head>
  <title>Tutorials — Lily Design System</title>
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Tutorials</h1>
  <p class="hero-tagline">Step-by-step guides for each supported framework.</p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <ul>
    <li><a href="/tutorials/html/">HTML tutorial</a></li>
    <li><a href="/tutorials/svelte/">Svelte tutorial</a></li>
    <li><a href="/tutorials/react/">React tutorial</a></li>
    <li><a href="/tutorials/vue/">Vue tutorial</a></li>
    <li><a href="/tutorials/blazor/">Blazor tutorial</a></li>
  </ul>
</section>
```

- [ ] **Step 10.4: Create the five framework tutorial stubs**

Each file is identical except for the heading text. Substitute `<HEADING>` from this list:

| File | `<HEADING>` |
|------|-------------|
| `src/routes/tutorials/blazor/+page.svelte` | `Blazor tutorial` |
| `src/routes/tutorials/html/+page.svelte` | `HTML tutorial` |
| `src/routes/tutorials/react/+page.svelte` | `React tutorial` |
| `src/routes/tutorials/svelte/+page.svelte` | `Svelte tutorial` |
| `src/routes/tutorials/vue/+page.svelte` | `Vue tutorial` |

```svelte
<svelte:head>
  <title><HEADING> — Lily Design System</title>
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1><HEADING></h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p>This page is a placeholder. Content coming soon.</p>
</section>
```

- [ ] **Step 10.5: Smoke-test all stubs build and render**

Run: `pnpm dev`
Visit each: `/comparisons/`, `/lily-claude-code/`, `/lily-claude-design/`, `/lily-figma/`, `/tutorials/`, `/tutorials/blazor/`, `/tutorials/html/`, `/tutorials/react/`, `/tutorials/svelte/`, `/tutorials/vue/`.
Expected: every URL returns 200, shows the layout chrome plus the page-specific hero and body.
Stop the dev server.

- [ ] **Step 10.6: Commit**

```bash
git add src/routes/comparisons src/routes/lily-claude-code src/routes/lily-claude-design src/routes/lily-figma src/routes/tutorials
git commit -m "Add stub routes for comparisons, claude integrations, figma, tutorials"
```

---

## Task 11: Add the GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

This file is committed in the monorepo, carried along by `git subtree push`, and runs in the public `LilyDesignSystem/lilydesignsystem.github.io` repo when that repo's `main` branch updates.

- [ ] **Step 11.1: Create `.github/workflows/deploy.yml`**

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
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm build

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deploy
        uses: actions/deploy-pages@v4
```

- [ ] **Step 11.2: Validate YAML syntax**

Run: `pnpm exec js-yaml .github/workflows/deploy.yml > /dev/null` if `js-yaml` is available, otherwise: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml'))"`
Expected: exit code 0 (no parse errors).

- [ ] **Step 11.3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow to build and deploy via Pages"
```

---

## Task 12: Full-build verification gate

**Files:** none modified — this task only verifies prior tasks built a complete, deployable site.

- [ ] **Step 12.1: Type-check the whole project**

Run: `pnpm check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 12.2: Run a clean production build**

Run: `rm -rf build .svelte-kit && pnpm build`
Expected: build completes without errors. No "page X was not prerendered" warnings.

- [ ] **Step 12.3: Inspect the build output**

Run: `ls build/`
Expected to include all of:
- `index.html`
- `404.html`
- `CNAME`
- `.nojekyll`
- `robots.txt`
- `sitemap.xml`
- `_app/` (directory)
- `assets/` (directory containing `style.css`, `favicon.svg`, `images/`)
- Per-route folders: `about/`, `components/`, `examples/`, `help/`, `comparisons/`, `lily-claude-code/`, `lily-claude-design/`, `lily-figma/`, `tutorials/`
- Each per-route folder contains `index.html`
- `tutorials/blazor/index.html`, `tutorials/html/index.html`, `tutorials/react/index.html`, `tutorials/svelte/index.html`, `tutorials/vue/index.html`

Run: `cat build/CNAME`
Expected output: `lilydesignsystem.com`

- [ ] **Step 12.4: Spot-check that build pages link to assets correctly**

Run: `grep -o 'href="[^"]*assets/style.css[^"]*"' build/index.html | head -1`
Expected: prints something like `href="/assets/style.css"` or `href="./assets/style.css"`.

Run: `grep -c 'component-list-item' build/index.html`
Expected: a number ≥ 400 (one per catalog entry on the home page).

- [ ] **Step 12.5: Run the production preview and click around**

Run: `pnpm preview &`
Wait ~2 seconds, then visit `http://localhost:4173/` in a browser.
Click through: Home → About → Components (try the search) → Examples → Help → and one tutorial stub.
Expected: every page loads without console errors; styles apply; the "current" nav highlight follows you.

Stop the preview: `kill %1`

- [ ] **Step 12.6: No commit needed for this task** — it's a verification gate. If anything fails, return to the relevant earlier task and fix.

---

## Task 13: Update the regenerate-catalog recipe in `index.md`

**Files:**
- Modify: `index.md`

The dev-docs file currently includes an `awk` snippet that regenerates `assets/components-data.js`. Update it to emit `src/lib/components.ts` instead.

- [ ] **Step 13.1: Open `index.md` and replace the regeneration recipe section**

Find the section that begins with:

```
## Update the component catalog
```

Replace its body with:

````markdown
## Update the component catalog

The catalog data in `src/lib/components.ts` is generated from the canonical [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv) in the main repo. To regenerate:

```sh
cd ~/git/lilydesignsystem/lily-design-system
{
  echo "// Lily component catalog — generated from components.tsv"
  echo "// Components across HTML, Svelte, React, Vue, Blazor, Nunjucks headless"
  echo ""
  echo "export type LilyComponent = {"
  echo "  name: string;"
  echo "  pascal: string;"
  echo "  description: string;"
  echo "};"
  echo ""
  echo "export const LILY_COMPONENTS: LilyComponent[] = ["
  awk -F'\t' '{
    gsub(/"/, "\\\"", $1); gsub(/"/, "\\\"", $2); gsub(/"/, "\\\"", $3);
    printf "  { name: \"%s\", pascal: \"%s\", description: \"%s\" },\n", $1, $2, $3
  }' components.tsv
  echo "];"
} > ../lilydesignsystem.github.io/src/lib/components.ts
```
````

Also update the **What's here** section near the top of the file. The current ASCII tree is wildly out of date once we finish. Replace the whole `What's here` section (the prose plus the code block) with:

````markdown
## What's here

A SvelteKit project using `@sveltejs/adapter-static` that prerenders the entire site, deployed automatically by GitHub Actions to `https://lilydesignsystem.com/`.

```
lilydesignsystem.github.io/
├── src/
│   ├── app.html              SvelteKit document shell
│   ├── lib/components.ts     Component catalog (generated from components.tsv)
│   └── routes/               One folder per URL — +layout.svelte, +page.svelte
├── static/
│   ├── CNAME                 Custom domain (lilydesignsystem.com)
│   ├── .nojekyll             Disables Jekyll on GitHub Pages
│   └── assets/               style.css, favicon.svg, images/
├── .github/workflows/
│   └── deploy.yml            CI: builds and deploys on push to main
├── svelte.config.js          adapter-static config
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
````

Also update the **Develop** section. Replace its body with:

````markdown
## Develop

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # produces build/ for deploy
pnpm preview      # http://localhost:4173 — production-mode preview
pnpm check        # type-check
```

## Deploy

GitHub Actions deploys automatically on push to `main` of the public
`LilyDesignSystem/lilydesignsystem.github.io` repo. The site is served from
`https://lilydesignsystem.com/` (with a fallback on `https://lilydesignsystem.github.io/`).
````

- [ ] **Step 13.2: Verify the file still parses as Markdown**

Run: `head -50 index.md`
Expected: clean Markdown; no orphan code-fence backticks.

- [ ] **Step 13.3: Commit**

```bash
git add index.md
git commit -m "Update dev docs to describe the SvelteKit setup and regenerate recipe"
```

---

## Task 14: Remove superseded legacy files

**Files to delete:** all the original hand-written HTML pages and the now-unused asset scripts.

- [ ] **Step 14.1: Remove the old root HTML, the old per-route `index.html` files, and the old MD stubs**

```bash
git rm 404.html
git rm index.html
git rm about/index.html
git rm components/index.html
git rm examples/index.html
git rm help/index.html
git rm comparisons/index.md
git rm lily-claude-code/index.md
git rm lily-claude-design/index.md
git rm lily-figma/index.md
```

After each `git rm`, the parent directory may now be empty. Empty directories are not tracked by git, so this is fine.

- [ ] **Step 14.2: Remove any leftover content in `tutorials/` subdirectories**

Run: `ls tutorials/blazor tutorials/html tutorials/react tutorials/svelte tutorials/vue 2>/dev/null`

If any of these list children, remove them:
```bash
git rm -r tutorials/
```

If the listings show empty directories or "No such file", skip this step.

- [ ] **Step 14.3: Remove the leftover `assets/` directory contents**

After Task 2 the only files remaining in `assets/` should be the JS files.

```bash
git rm assets/components.js
git rm assets/components-data.js
```

If `assets/` is now empty, remove the empty dir from the working tree (git doesn't track empty dirs):
```bash
rmdir assets 2>/dev/null || true
```

- [ ] **Step 14.4: Verify the tree**

Run: `git status`
Expected: only deletions listed; no unexpected modifications.

Run: `find . -maxdepth 2 -name '*.html' -not -path './build/*' -not -path './node_modules/*' -not -path './.svelte-kit/*'`
Expected: no output (no stray hand-written HTML files left).

- [ ] **Step 14.5: Re-run the full-build gate to make sure nothing references deleted files**

Run: `rm -rf build .svelte-kit && pnpm build`
Expected: clean build, same output set as Task 12.3.

- [ ] **Step 14.6: Commit**

```bash
git commit -m "Remove legacy hand-written HTML and unused asset scripts"
```

---

## Task 15: Final verification & manual GH Pages settings note

**Files:** none.

- [ ] **Step 15.1: Final type-check**

Run: `pnpm check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 15.2: Final clean build**

Run: `rm -rf build .svelte-kit && pnpm build`
Expected: success.

- [ ] **Step 15.3: One-time manual step (DO NOT automate — write it into the post-merge notes)**

After the first `git subtree push` of this directory to `LilyDesignSystem/lilydesignsystem.github.io`:
1. Open `https://github.com/LilyDesignSystem/lilydesignsystem.github.io/settings/pages`.
2. Set **Source** to **GitHub Actions**.
3. Set **Custom domain** to `lilydesignsystem.com`.
4. Wait for DNS propagation; verify with `curl -I https://lilydesignsystem.com/` returning HTTP 200.

Add a one-line note to `index.md` under a new heading `## First deploy (one-time)` documenting the four steps above. Then commit:

```bash
git add index.md
git commit -m "Document one-time GitHub Pages source/custom-domain setup"
```

- [ ] **Step 15.4: Done**

The migration is complete. Subsequent edits to any route follow the normal monorepo workflow: edit, commit, `bin/git-subtree-push`. The GitHub Action handles the build + deploy.

---

## Self-review notes

The following spec requirements were checked against the plan above:

- **`adapter-static` with `fallback: '404.html'`** — Task 1.2 ✓
- **`paths.base` empty (custom domain)** — implicit in Task 1.2 ✓
- **`prerender = true`, `trailingSlash = 'always'`** — Task 4.1 ✓
- **`static/CNAME` containing `lilydesignsystem.com`** — Task 2.3 ✓
- **`static/.nojekyll`** — Task 2.2 ✓
- **`/assets/...` URL prefix preserved** — Task 2.1 (move under `static/assets/`) + Task 1.5 (referenced in `app.html`) ✓
- **TypeScript catalog module** — Task 3 ✓
- **Components page search/filter using runes** — Task 7 ✓
- **All five primary URL paths preserved** — Tasks 5, 6, 7, 8, 9 ✓
- **Stub URL paths preserved** — Task 10 ✓
- **GitHub Actions workflow** — Task 11 ✓
- **One-time manual Pages source switch documented** — Task 15.3 ✓
- **Subtree-push compatibility unchanged** — `bin/git-subtree-push` not modified; plan only adds files inside `lilydesignsystem.github.io/` ✓

---

Lily™ and Lily Design System™ are trademarks.
