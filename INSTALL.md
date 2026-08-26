# Install

Lily Design System™ has three ways in, and they are deliberately ordered by how
little you have to commit to.

1. **Copy the markup.** No install, no dependency, no build step.
2. **Install a headless package.** Components as framework modules; you still
   write every line of CSS.
3. **Install a helper package.** A complete interaction — theme picker, locale
   picker, date-time picker — wired end to end.

Full documentation, a searchable catalog of all 491 components, and per-framework
tutorials are at **<https://lilydesignsystem.github.io/>**.

## Requirements

| Path | Needs |
| --- | --- |
| Copy the markup | a browser |
| npm packages | Node.js 18+ and npm, pnpm, or yarn |
| Svelte | Svelte 5 |
| React | React 18 or 19 (`react` and `react-dom` are peer dependencies) |
| Vue | Vue 3.4+ |
| Blazor | .NET 8+ |
| Nunjucks | Nunjucks 3+ |

## What is actually published today

Be aware of this before you plan around it — the website documents all seven
frameworks, but not all seven are on a registry yet.

| Package family | Registry | Status |
| --- | --- | --- |
| `lily-design-system-svelte-headless` | npm | **0.3.1** |
| `lily-design-system-react-headless` | npm | **0.3.1** |
| `lily-design-system-vue-headless` | npm | **0.3.1** |
| `lily-design-system-html-headless` | npm | **0.1.0** |
| `lily-design-system-angular-headless` | npm | **0.1.0** |
| `lily-design-system-nunjucks-headless` | npm | **0.1.0** |
| `LilyDesignSystem.Blazor.Headless` | NuGet | packed in `dist-nuget/`, push pending credentials |
| All 30 JavaScript helper packages (6 frameworks × 5 helpers) | npm | **0.1.0** |
| The 5 Blazor helper packages | NuGet | packed in `dist-nuget/`, push pending credentials |

Six of the seven headless libraries are installable from npm; Blazor's NuGet
push is the one remaining step. Path 1 always works regardless — nothing about
Lily requires the registry.

## Path 1 — Copy the markup (zero install)

Lily is headless: a component *is* its semantic HTML, its ARIA, and its class
hook. You can take that markup straight out of the catalog and paste it into any
project, in any language, on any stack.

```html
<nav class="breadcrumb-nav" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-list-item"><a href="/">Home</a></li>
    <li class="breadcrumb-list-item" aria-current="page">Settings</li>
  </ol>
</nav>
```

Then style the class hooks. The kebab-case base class is the whole contract:

```css
.breadcrumb-list { display: flex; gap: 0.5rem; list-style: none; }
```

[`css-style-sheet-template.css`](css-style-sheet-template.css) declares a hook for
every component in the catalog, so you can start from it rather than from nothing.

## Path 2 — Install a headless package

Each package exports all 491 components from one barrel, ships `dist/` with types,
and is marked `sideEffects: false` so your bundler can tree-shake what you do not
import.

### Svelte 5

```sh
npm install lily-design-system-svelte-headless
```

```svelte
<script>
  import { BreadcrumbNav, BreadcrumbList, BreadcrumbListItem } from "lily-design-system-svelte-headless";
</script>

<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Settings</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### React 18 or 19

```sh
npm install lily-design-system-react-headless
```

```jsx
import { BreadcrumbNav, BreadcrumbList, BreadcrumbListItem } from "lily-design-system-react-headless";

export function Crumbs() {
  return (
    <BreadcrumbNav label="Breadcrumb">
      <BreadcrumbList>
        <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
        <BreadcrumbListItem current>Settings</BreadcrumbListItem>
      </BreadcrumbList>
    </BreadcrumbNav>
  );
}
```

### Vue 3

```sh
npm install lily-design-system-vue-headless
```

```vue
<script setup>
import { BreadcrumbNav, BreadcrumbList, BreadcrumbListItem } from "lily-design-system-vue-headless";
</script>

<template>
  <BreadcrumbNav label="Breadcrumb">
    <BreadcrumbList>
      <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
      <BreadcrumbListItem current>Settings</BreadcrumbListItem>
    </BreadcrumbList>
  </BreadcrumbNav>
</template>
```

### HTML (framework-free)

```sh
npm install lily-design-system-html-headless
```

The payload is 491 annotated semantic-HTML snippet files under
`components/*.html` — copy them or template them; a small node helper
(`componentsDir`, `readComponent(slug)`, `listComponents()`) locates them from
build tooling.

### Angular 22

```sh
npm install lily-design-system-angular-headless
```

An ng-packagr APF bundle: standalone, signal-based, OnPush components,
compiled by your Angular CLI build via the Angular Linker.

### Nunjucks

```sh
npm install lily-design-system-nunjucks-headless
```

Add the exported `templatesDir` to your nunjucks `FileSystemLoader` search
path, then `{% import "breadcrumb-nav/macro.njk" as c %}` inside templates.

### Blazor

`LilyDesignSystem.Blazor.Headless` is packed but not yet on NuGet. Until it
is, clone the repository and reference
`lily-design-system-blazor-headless/src/LilyBlazorHeadless/LilyBlazorHeadless.csproj`.

## Path 3 — Install a helper package

Helpers are opinionated: each one owns a complete interaction end to end, and
unlike the headless layer it will write to the DOM (a `data-theme` attribute, a
`lang`, a managed `<link>`) and optionally to `localStorage`. All are SSR-safe and
still ship no CSS.

The five helpers are `theme-picker`, `locale-picker`, `text-size-picker`,
`share-picker`, and `date-time-picker`. The package name is
`lily-design-system-{framework}-{helper}`.

```sh
npm install lily-design-system-react-theme-picker
```

```jsx
import { ThemePicker } from "lily-design-system-react-theme-picker";

<ThemePicker
  label="Choose a theme"
  themesUrl="/themes/"
  themes={["light", "dark", "nhs-england-patient"]}
  storageKey="theme"
/>
```

Every user-facing string is a prop — there are no English defaults to override.
See [AGENTS/helpers.md](AGENTS/helpers.md) and
[spec/helpers/index.md](spec/helpers/index.md) for the full contracts.

## Themes

The [`themes/`](themes/) directory holds 45 ready-made stylesheets — NHS England,
Scotland and Wales in patient and practitioner variants, GOV.UK GDS, USWDS, Adobe
Spectrum, Mozilla Protocol, and general-purpose light and dark themes. They target
Lily's class hooks and use `:where(...)` selectors so your own rules always win.

Link one directly:

```html
<link rel="stylesheet" href="/themes/nhs-england-patient.css">
```

Or let `theme-picker` swap them at runtime — that is exactly what it is for.

Lily is not affiliated with or endorsed by NHS, GOV.UK, USWDS, Adobe, or Mozilla.
These are independent implementations that take visual reference from published
public-sector and open design systems.

## Run the example applications

Seven fully styled reference applications, one per framework. Each has a home
page, a searchable catalog of all 491 components, and a live demo page per
component.

```sh
git clone https://github.com/LilyDesignSystem/lily-design-system.git
cd lily-design-system/lily-design-system-svelte-sveltekit-examples
npm install
npm run dev
```

Swap the directory for `-react-next-examples`, `-vue-nuxt-examples`,
`-html-css-js-examples`, `-nunjucks-eleventy-examples`, `-angular-examples`, or
`-blazor-web-examples` (which uses `dotnet run`).

Known issue: the Angular + Analog example app works as a client-rendered
application, but its static SSG output is shell-only, blocked on an upstream
Analog issue. See [spec/index.md](spec/index.md) §11.8.

## Verify a checkout

```sh
bin/test          # required files across the repo, components, and subprojects
bin/check-links   # every relative markdown link resolves
```

## Upgrading

Lily follows [Semantic Versioning](https://semver.org/) and is pre-1.0, so minor
versions may break. Two contracts are stable and will be treated as breaking
changes when they move: the **kebab-case class hooks** (including inner
sub-classes such as `breadcrumb-list-item`), and each component's **keyboard and
ARIA contract** as documented in `components/{slug}/AGENTS.md`.

A note on package history: versions 0.2.0 of the three published headless
packages are unusable — they declared a `main` that was never built. Use 0.3.0 or
later. The helper packages restarted at 0.1.0 after the July 2026 rename to
`*-picker`; the earlier history is preserved in each package's `CHANGELOG.md`.

## Getting help

- Documentation: <https://lilydesignsystem.github.io/>
- Issues: <https://github.com/LilyDesignSystem/lily-design-system/>
- Email: <joel@joelparkerhenderson.com>

## License

Free open source, under your choice of MIT, Apache-2.0, GPL-2.0-only,
GPL-3.0-only, or BSD-3-Clause. See [LICENSE.md](LICENSE.md).

---

Lily™ and Lily Design System™ are trademarks.
