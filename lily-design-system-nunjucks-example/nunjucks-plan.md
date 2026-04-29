# Lily Design System — Nunjucks Example — Implementation Plan

## Goal

Build a browsable example website that demonstrates every Lily Design
System component rendered through the `lily-design-system-nunjucks-headless`
macros and dressed in the NHS UK Design System's **look and feel** —
colours, typography, spacing, focus state, page template, and
interaction patterns.

This subproject does three things:

1. **Consumes** the headless Nunjucks macros (zero changes to them).
2. **Styles** the Lily class names with CSS that recreates the NHS UK
   visual language.
3. **Showcases** each component on its own demo page, plus composed
   page templates, as a static site buildable with Eleventy (11ty).

## Inspirations

- [Nunjucks — Mozilla](https://mozilla.github.io/nunjucks/)
- [Nunjucks templating docs](https://mozilla.github.io/nunjucks/templating.html)
- [Nunjucks API docs](https://mozilla.github.io/nunjucks/api.html)
- [NHS.UK Design System — Components](https://service-manual.nhs.uk/design-system/components/)
- [NHS.UK Design System — Styles — Page Template](https://service-manual.nhs.uk/design-system/styles/page-template)
- [NHS.UK Design System — Styles — Typography](https://service-manual.nhs.uk/design-system/styles/typography)
- [NHS.UK Design System — Styles — Spacing](https://service-manual.nhs.uk/design-system/styles/spacing)
- [NHS.UK Design System — Styles — Focus State](https://service-manual.nhs.uk/design-system/styles/focus-state)
- [NHS.UK Design System — Styles — Layout](https://service-manual.nhs.uk/design-system/styles/layout)
- [NHS.UK Design System — Styles — Icons](https://service-manual.nhs.uk/design-system/styles/icons)
- [NHS.UK Identity — Colours](https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/)
- [NHS.UK frontend repository](https://github.com/nhsuk/nhsuk-frontend)
- [Eleventy — 11ty](https://www.11ty.dev/)

Sibling subprojects:

- `lily-design-system-nunjucks-headless` (the component library this
  project styles)
- `lily-design-system-html-javascript-examples` (analogous examples
  site for the plain-HTML headless implementation)

## Technology

- Template engine: Nunjucks 3.x (via Eleventy's built-in Nunjucks
  support — matches the headless project exactly)
- Static site generator: Eleventy (`@11ty/eleventy`) 3.x
- Dev server: Eleventy's built-in dev server
- Package manager: PNPM
- Test framework: Vitest + jsdom (build-output assertions)
- CSS: hand-authored plain CSS (no preprocessor, no Tailwind, no
  DaisyUI), using CSS custom properties as design tokens
- JavaScript: vanilla JS, progressively enhanced, modular — one
  behaviour module per interactive pattern

## Directory structure

```
lily-design-system-nunjucks-example/
├── AGENTS.md
├── CLAUDE.md
├── AGENTS/                              # symlinks to shared docs
├── README.md → index.md
├── index.md
├── nunjucks-plan.md                     # this file
├── tasks.md
├── package.json
├── pnpm-lock.yaml
├── .eleventy.js                         # Eleventy config
├── src/
│   ├── _data/
│   │   ├── site.js                      # site name, nav, metadata
│   │   └── components.js                # component inventory
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk                 # <html> + <head> + skip-link
│   │   │   ├── page.njk                 # content page layout
│   │   │   └── component-demo.njk       # component demo layout
│   │   └── partials/
│   │       ├── header.njk               # NHS UK-style site header
│   │       ├── footer.njk               # NHS UK-style site footer
│   │       ├── sidebar-nav.njk          # component list sidebar
│   │       └── breadcrumb.njk           # page breadcrumb
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css                 # single entry @importing the rest
│   │   │   ├── tokens/
│   │   │   │   ├── colors.css
│   │   │   │   ├── spacing.css
│   │   │   │   ├── typography.css
│   │   │   │   ├── breakpoints.css
│   │   │   │   └── focus.css
│   │   │   ├── base/
│   │   │   │   ├── reset.css
│   │   │   │   ├── page.css
│   │   │   │   ├── typography.css
│   │   │   │   ├── links.css
│   │   │   │   └── focus-state.css
│   │   │   ├── layout/
│   │   │   │   ├── width-container.css
│   │   │   │   ├── grid.css
│   │   │   │   └── grail-layout.css
│   │   │   └── components/
│   │   │       ├── button.css           # NHS UK button on .button class
│   │   │       ├── alert.css
│   │   │       ├── badge.css
│   │   │       └── ...                  # one CSS file per component tier
│   │   └── js/
│   │       ├── main.js
│   │       └── modules/
│   │           ├── header-menu.js       # hamburger toggle
│   │           ├── details.js           # details polyfill where needed
│   │           ├── dialog.js            # modal open/close + focus trap
│   │           ├── tabs.js              # tab-bar panel switching
│   │           ├── accordion.js         # accordion-list expand
│   │           └── character-count.js   # textarea counter
│   ├── index.njk                        # landing page
│   ├── components/
│   │   ├── index.njk                    # component index
│   │   ├── button.njk                   # button demo page
│   │   ├── alert.njk
│   │   └── …                            # one demo page per component
│   └── page-templates/
│       ├── default.njk                  # full NHS UK-style composed page
│       ├── form-example.njk             # form patterns composed
│       └── dashboard-example.njk        # vitals + tables composed
├── test/
│   ├── build.test.js                    # Eleventy produces zero errors
│   └── pages.test.js                    # component demo pages render ok
└── _site/                               # Eleventy output (gitignored)
```

## Nunjucks + Eleventy configuration

`.eleventy.js` configures Eleventy's Nunjucks environment to search
both the local `src` directory and the sibling headless package, so
that macro imports resolve transparently:

```js
import nunjucks from "nunjucks";

export default function (eleventyConfig) {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([
      "src",
      "src/_includes",
      "../lily-design-system-nunjucks-headless",
    ]),
    { autoescape: true, trimBlocks: true, lstripBlocks: true },
  );
  eleventyConfig.setLibrary("njk", env);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
```

Consumers inside page templates then write the same import as the
headless project documents:

```njk
{% from "components/button/macro.njk" import button %}
{{ button({ text: "Save", type: "submit" }) }}
```

## NHS UK design tokens (implementation targets)

These go into `src/assets/css/tokens/*.css` as CSS custom properties
on `:root`.

### Colours

| Token                  | Value     | NHS role                                   |
| ---------------------- | --------- | ------------------------------------------ |
| `--nhsuk-blue`         | `#005eb8` | Primary brand colour                       |
| `--nhsuk-dark-blue`    | `#003087` | Header background, hover                   |
| `--nhsuk-bright-blue`  | `#0072ce` | Links on light backgrounds                 |
| `--nhsuk-light-blue`   | `#41b6e6` | Secondary accent                           |
| `--nhsuk-aqua-blue`    | `#00a9ce` | Accent                                     |
| `--nhsuk-black`        | `#212b32` | Body text                                  |
| `--nhsuk-dark-grey`    | `#425563` | Muted text                                 |
| `--nhsuk-mid-grey`     | `#768692` | Dividers                                   |
| `--nhsuk-light-grey`   | `#d8dde0` | Borders                                    |
| `--nhsuk-pale-grey`    | `#f0f4f5` | Page background, callout background        |
| `--nhsuk-white`        | `#ffffff` | Content surfaces                           |
| `--nhsuk-red`          | `#d5281b` | Errors, warning callouts                   |
| `--nhsuk-warm-yellow`  | `#ffb81c` | Warnings                                   |
| `--nhsuk-yellow`       | `#ffeb3b` | Focus state                                |
| `--nhsuk-green`        | `#007f3b` | Success                                    |
| `--nhsuk-pink`         | `#ae2573` | Emergency                                  |
| `--nhsuk-purple`       | `#330072` | Care card: non-urgent                      |

### Typography

```css
:root {
  --nhsuk-font-family:
    "Frutiger W01", Arial, sans-serif;

  /* modular type scale, matching NHS UK */
  --nhsuk-font-size-14: 0.875rem;  /* 14px */
  --nhsuk-font-size-16: 1rem;      /* 16px */
  --nhsuk-font-size-19: 1.1875rem; /* 19px */
  --nhsuk-font-size-22: 1.375rem;
  --nhsuk-font-size-26: 1.625rem;
  --nhsuk-font-size-32: 2rem;
  --nhsuk-font-size-48: 3rem;
  --nhsuk-font-size-64: 4rem;

  --nhsuk-font-weight-normal: 400;
  --nhsuk-font-weight-bold: 600;
}
```

Font note: Frutiger W01 is proprietary; the example does **not**
bundle it. The CSS stack falls back to Arial, which is what NHS UK
specifies when Frutiger is not available.

### Spacing

NHS UK's spacing scale, exposed as tokens:

```css
:root {
  --nhsuk-spacing-0: 0;
  --nhsuk-spacing-1: 0.25rem;  /* 4px */
  --nhsuk-spacing-2: 0.5rem;   /* 8px */
  --nhsuk-spacing-3: 1rem;     /* 16px */
  --nhsuk-spacing-4: 1.5rem;   /* 24px */
  --nhsuk-spacing-5: 2rem;     /* 32px */
  --nhsuk-spacing-6: 2.5rem;   /* 40px */
  --nhsuk-spacing-7: 4rem;     /* 64px */
}
```

### Breakpoints

```css
:root {
  --nhsuk-bp-mobile: 320px;
  --nhsuk-bp-tablet: 641px;
  --nhsuk-bp-desktop: 769px;
  --nhsuk-bp-large-desktop: 990px;
  --nhsuk-bp-xl-desktop: 1280px;
}
```

### Focus state

Matches NHS UK's signature focus ring: 4px yellow outer + 4px black
inner, **no rounded corners** during focus:

```css
:focus-visible {
  outline: 4px solid var(--nhsuk-yellow);
  outline-offset: 0;
  box-shadow: 0 0 0 4px var(--nhsuk-black);
  border-radius: 0 !important;
}
```

This single declaration gives every Lily component the NHS UK focus
treatment because headless components do not set their own focus
styles.

## Page template (NHS UK mirror)

`src/_includes/layouts/base.njk`:

```njk
<!doctype html>
<html lang="{{ site.lang | default('en') }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }} — {{ site.name }}</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  {% from "components/skip-link/macro.njk" import skipLink %}
  {{ skipLink({ href: "#main-content", text: "Skip to main content" }) }}

  {% include "partials/header.njk" %}

  <div class="width-container">
    {% include "partials/breadcrumb.njk" %}
  </div>

  <main id="main-content" class="main-wrapper">
    {% block content %}{% endblock %}
  </main>

  {% include "partials/footer.njk" %}

  <script type="module" src="/assets/js/main.js"></script>
</body>
</html>
```

Header and footer partials mirror NHS UK's structure but use Lily
class names (and therefore Lily macros where applicable).

## Component demo pages

Every component in the canonical list gets a demo page at
`src/components/{kebab-case}.njk`. Each page includes:

1. **Component heading** — name + description from the shared
   `components.md` index.
2. **Default example** — the macro called with minimal params.
3. **Param variations** — one example per meaningful param
   (`text` vs `html`, `disabled`, `type`, `variant`, etc.).
4. **Edge cases** — empty state, long content, unusual combinations.
5. **Code snippet** — the Nunjucks source as a `<pre>` so visitors
   can copy it.
6. **Accessibility notes** — ARIA and keyboard expectations.
7. **NHS UK references** — link to the matching NHS UK component
   page where one exists.

Reusable demo layout at `src/_includes/layouts/component-demo.njk`
handles the boilerplate; each demo page provides just the examples
and notes.

## Component showcase and page templates

`src/page-templates/*.njk` composes many components into realistic
page mockups in NHS UK style:

- `default.njk` — NHS UK service page with header, breadcrumb, body,
  call-to-action, footer.
- `form-example.njk` — multi-step form using `form`, `field`,
  `fieldset`, `text-input`, `checkbox-group`, `error-summary`, etc.
- `dashboard-example.njk` — patient dashboard using `medical-banner`,
  `data-table`, `care-card`, `summary-list`.

These templates are the proof that the styles compose correctly at
page scale, not just in isolation.

## CSS authoring rules

- **Target Lily class names only.** The headless library sets
  kebab-case classes (e.g. `.button`, `.alert`, `.banner-box`); the
  example project styles those classes. No new class names are
  introduced in the markup.
- **Use tokens, not magic numbers.** Every colour, spacing, and size
  reads from a CSS custom property defined in `tokens/`.
- **Progressive enhancement.** The page must be legible without CSS
  (semantic HTML does the work) and without JS (native HTML does the
  work where possible: `<details>`, `<dialog>`, `<progress>`,
  `<meter>`, form validation, etc.).
- **Mobile-first media queries.** Base styles target the smallest
  viewport; `@media (min-width: var(--nhsuk-bp-tablet))` scales up.
- **One component per CSS file.** Each file corresponds to either a
  single component or a tight family (e.g. table parts share
  `data-table.css`).
- **No inline styles in templates.** All styling lives in
  `assets/css/`.
- **No CSS frameworks.** No Tailwind, DaisyUI, Bootstrap, etc.

## JavaScript authoring rules

- **Progressive enhancement only.** Nothing on the page breaks if JS
  fails to load.
- **Vanilla JS, ES modules, one module per behaviour.**
- **Target Lily classes + data-state attributes.** Following NHS UK's
  `data-module` convention, each interactive component root has
  `data-module="button"` (or similar) to opt into JS enhancement.
- **No bundlers, no build step beyond Eleventy's passthrough copy.**
  Modern browsers only (Chrome, Firefox, Safari, Edge).
- **No analytics, no trackers, no third-party scripts.**

## Accessibility (carries forward from the headless project)

- WCAG 2.2 AAA.
- Skip link is the first interactive element on every page.
- Landmark roles: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Visible focus indicator on every focusable element (tokens/focus).
- Colour contrast: body text meets AAA against all backgrounds used.
- Keyboard-only user can complete every demo flow.
- All text on the page passes through Nunjucks params — no
  hardcoded strings in macros (the example site itself hard-codes
  English copy since it is not a localisation target).

## Test architecture

### Build verification

- `pnpm build` (runs `eleventy`) must exit zero.
- Vitest's `build.test.js` runs the Eleventy build programmatically
  and asserts every component has a generated demo page in `_site/`.

### Page smoke tests

- For a representative sample of components (one from each priority
  tier), load the generated HTML with jsdom and assert:
  - The demo page's root element has the expected Lily class.
  - The Nunjucks macro import did not leak template literals.
  - The page includes the NHS UK-style header, footer, and skip link.

### Accessibility checks (manual + tooling)

- Run `pa11y-ci` (optional, backlog) over the built `_site/` against
  the WCAG 2.2 AA ruleset as a regression gate.
- Manual keyboard walk for each page template on Chrome + Firefox.

### Test command

- `pnpm test` → `vitest run` (build runs first as a test fixture)

## Approach

1. **Infrastructure**
   - `package.json` (eleventy, nunjucks, vitest, jsdom)
   - `.eleventy.js` with shared FileSystemLoader
   - `src/_data/site.js`, `components.js`
   - Base layouts (`base.njk`, `page.njk`, `component-demo.njk`)
   - Header / footer / sidebar partials styled NHS UK-style
   - `AGENTS.md`, `CLAUDE.md`, `index.md`, `README.md` symlink
   - Symlink the shared `AGENTS/` docs
2. **Token layer**
   - `tokens/colors.css`
   - `tokens/spacing.css`
   - `tokens/typography.css`
   - `tokens/breakpoints.css`
   - `tokens/focus.css`
   - `base/reset.css`, `base/page.css`, `base/typography.css`,
     `base/links.css`, `base/focus-state.css`
3. **Layout layer**
   - `layout/width-container.css` (NHS UK page width)
   - `layout/grid.css` (NHS UK two/three/four column grids)
   - `layout/grail-layout.css` (styles Lily's grail-layout component
     family)
4. **First-light verification**
   - Implement `components/button.css`.
   - Implement `src/components/button.njk` demo page.
   - Run `pnpm build` and open the generated page; confirm NHS UK
     blue primary button + yellow/black focus ring.
5. **Component styles and demo pages, in priority order** (mirroring
   the headless project):
   a. Static wrappers
   b. Form inputs
   c. Links and views
   e. Table families
   f. Navigation patterns
   g. List patterns
   h. Bar patterns
   i. Picker patterns
   j. Form composition
   k. Overlays and menus
   l. Layout
   m. Interactive specialty
6. **Page templates** (`page-templates/*.njk`) — compose the styled
   components into realistic NHS UK-style pages.
7. **JS behaviours** — author one module per interactive pattern;
   verify each works keyboard-only.
8. **Final sweep** — cross-check every component has both CSS and a
   demo page; run all tests; spot-check accessibility.

## Acceptance criteria

- [ ] `pnpm build` succeeds with zero Eleventy warnings.
- [ ] `pnpm test` passes.
- [ ] Every component from the canonical Lily list has:
  - [ ] a CSS file (or shared tier file that styles it)
  - [ ] a demo page under `src/components/{kebab-case}.njk`
  - [ ] an entry in the sidebar nav and component index page
- [ ] At least three composed page templates under `page-templates/`.
- [ ] The site header, footer, breadcrumb, and skip-link match the
      NHS UK design system page template.
- [ ] All focusable elements show the NHS UK yellow/black focus ring.
- [ ] Body text contrast meets WCAG AAA against page backgrounds.
- [ ] Keyboard-only navigation works on every demo page.
- [ ] No hardcoded strings live in the headless macros; all English
      copy belongs to the example site's templates.
- [ ] No Tailwind, DaisyUI, Bootstrap, or other CSS framework.
- [ ] No third-party trackers or analytics.
- [ ] Font stack is `"Frutiger W01", Arial, sans-serif`; no
      proprietary fonts bundled.
- [ ] `_site/` is gitignored and reproducible from source.

## Lessons borrowed from NHS UK

- **Page template**: the specific arrangement of skip-link, header,
  breadcrumb, width-container, main, footer.
- **Focus state**: 4px yellow + 4px black — distinctive, high
  contrast, unambiguously "focused".
- **Colour usage**: blue for branding and primary actions, red for
  errors and warnings, yellow reserved almost exclusively for focus.
- **Typography**: Frutiger where available, Arial as first fallback;
  modular scale; bold headings in the "bright black" not pure black.
- **Spacing scale**: small number of tokens (4/8/16/24/32/40/64) used
  consistently; encourages a tidy vertical rhythm.
- **Progressive enhancement**: interactive behaviour is a layer on
  top of semantic HTML; pages work without JS.
- **Care-card pattern**: colour-coded urgency card (non-urgent /
  urgent / emergency) is a healthcare-specific idiom worth borrowing
  for medical components.
- **`data-module` pattern**: a tiny JS bootstrapper walks the DOM and
  initialises behaviours based on `data-module` attributes; keeps
  markup and JS loosely coupled.

## Deviations from NHS UK

- **Class names**: Lily kebab-case (`.button`) rather than BEM with
  `nhsuk-` prefix (`.nhsuk-button`). The CSS targets Lily classes; if
  consumers want to retheme we swap the stylesheet, not the markup.
- **Scope**: 332 Lily components vs NHS UK's 36. The example covers
  the Lily superset, adding styles and demos for pickers, vitals,
  layouts, tables, mockups, etc.
- **No bundled fonts**: NHS UK privately licenses Frutiger W01; our
  example project sets the stack but does not ship the font files.
- **No SCSS**: NHS UK uses SCSS; we use plain CSS with custom
  properties.
- **Eleventy**: NHS UK's own docs site uses a bespoke Node build;
  we use Eleventy because it is the most common idiomatic Nunjucks
  static site generator today.

## Timeline

- No specific deadline.
- No preferred timeline.

## Titles

- PackagePascalCase: `LilyNunjucksExample`
- package-kebab-case: `lily-design-system-nunjucks-example`
- package_snake_case: `lily_nunjucks_example`
