# Examples

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** The example subprojects are complete, styled reference applications that show what the headless components look like with real CSS, real interactivity, and a working app shell — every visual decision made and every user-facing string supplied.

## Scope

Covers the seven example apps (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Angular + Analog.js, Blazor Web, Nunjucks Eleventy): their styling contract, required routes, composed-page demos, accessibility rules, and the per-framework mechanism for rendering component demos. Examples are the inverse of the [headless](../headless/index.md) layer: headless ships markup, ARIA, and keyboard semantics only; examples ship every pixel.

## Principles and rules

- **Complete stylesheet, no framework dependency.** Each app ships a full stylesheet. The current default visual reference is the NHS UK design system applied to Lily™ class names. No Tailwind, DaisyUI, Bootstrap, or other CSS-framework dependency.
- **Target Lily kebab-case classes directly.** CSS selectors hit the kebab-case Lily base classes (e.g. `.breadcrumb-nav`) — no `nhsuk-` or other framework prefixes appear in the markup.
- **CSS custom properties carry tokens.** Colour, spacing, typography, breakpoints, and focus are expressed as CSS custom properties so a team can swap the reference theme without touching component code. Alternative reference designs (GOV.UK, USWDS, Mozilla Protocol, Adobe Spectrum) can be added in parallel as `theme-*` layers.
- **Example-only additions stay confined.** Apps may add extra class hooks or `data-*` attributes to drive variant styling, but those additions live only in the example subproject, never in the headless layer.
- **Internationalisation still flows through props.** Demo strings are concrete English but pass through the same prop names the headless components require, so porting to another locale is a values swap. Locale-aware formatting (currency, dates, numbers) uses `Intl.*` configured by the app's locale.

## Styling and tokens

| Concern             | Rule                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| Stylesheet          | Complete; ships with the app                                             |
| Visual reference    | NHS UK design system (default), applied to Lily class names              |
| Selectors           | Kebab-case Lily base classes; no framework prefixes in markup            |
| Design tokens       | CSS custom properties (colour, spacing, typography, breakpoints, focus)  |
| Alternative themes  | Parallel `theme-*` layers (GOV.UK, USWDS, Protocol, Spectrum)            |
| CSS framework       | None — no Tailwind / DaisyUI / Bootstrap                                  |

## Required routes

Every example subproject ships these three routes.

| Route                | Purpose                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `/`                  | Home page welcoming the visitor, explaining the project, linking to the index and demos. |
| `/components`        | Components index listing all 571 catalog entries; searchable / filterable; links to each detail page. |
| `/components/{slug}` | One detail page per component: renders a single component (not a grid), shows a usable demo, and surfaces canonical metadata (description, props, ARIA, keyboard, references). |

## Composed-page demos

Composed pages exercise multiple components together to validate the system as a whole. They are encouraged on top of the required routes, not required.

| Composed route             | Composed route             | Composed route             |
| -------------------------- | -------------------------- | -------------------------- |
| `/dashboard`               | `/contact-form`            | `/page-layout`             |
| `/timeline-and-cards`      | `/dialog-flow`             | `/file-upload-form`        |
| `/navigation-and-menus`    | `/rating-and-feedback`     | `/search-and-filter`       |
| `/settings-page`           | `/tabbed-interface`        | `/task-management`         |

### Composed-page parity matrix

All 7 example apps ship all 12 composed routes as of 2026-08-29 (plan
P6-T1). `nunjucks-eleventy-examples` had none until then; the other six
already had full coverage.

| Route                    | html-css-js | svelte-sveltekit | react-next | vue-nuxt | angular | blazor-web | nunjucks-eleventy |
| ------------------------ | :---------: | :---------------: | :--------: | :------: | :-----: | :--------: | :---------------: |
| `/contact-form`          | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/dashboard`             | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/dialog-flow`           | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/file-upload-form`      | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/navigation-and-menus`  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/page-layout`           | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/rating-and-feedback`   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/search-and-filter`     | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/settings-page`         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/tabbed-interface`      | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/task-management`       | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/timeline-and-cards`    | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

nunjucks-eleventy's 12 pages were ported from html-css-js's markup
(the closest architectural match — static markup + inline vanilla
`<script>`) into `layouts/page.njk` templates. Porting surfaced four
real, pre-existing defects unrelated to the new pages themselves —
most notably a cascade-layer bug (the app's unlayered `reset.css` was
silently beating the reference theme's `@layer lily` component rules
regardless of specificity, since unlayered rules always win over
layered ones) that made the header's locale-picker button render
white text on its own white surface on every page, intermittently
caught by axe depending on pixel-sampling. Full record: root
[CHANGELOG.md](../../CHANGELOG.md) and this app's own `spec/index.md`.

### Flagship pattern demos

Beyond the 12 composed routes above, `/book-an-appointment` (SvelteKit
only so far; porting to the other six apps is plan P6-T3) is a longer,
stateful, multi-step flow written up as Lily's first pattern doc:
[docs/patterns/book-an-appointment.md](../../docs/patterns/book-an-appointment.md).

## Demonstration pages

Every example app's `/components/{slug}` page, and every page of the docs site, renders the
same set of sections (updated 2026-10-06; before that the pages carried one static snippet and a
stub `<Name />` usage):

1. **Demo** — the live component, from the canonical demo map.
2. **Show demo markup** — the demo's exact HTML.
3. **More examples** — extra live-rendered states (for example a tool call that is pending, running
   or failed; a chat composer with text or busy), each with its markup. Absent when a component has
   no variants.
4. **Details** — name, slug, description.
5. **Usage** — a **real** usage example, not `<Name />`.
6. **Import**.

### Data sources

| Source | Role |
| ------ | ---- |
| `components.tsv` | slug, name, description. |
| `lily-design-system-svelte-sveltekit-examples/src/lib/data/component-demos.ts` | Canonical demo HTML per slug; `bin/generate-registries` copies it to the other apps. |
| `component-variants.json` (repo root) | Hand-curated extra states: `{ slug: [{ title, html }] }`. Avoid element ids (they would collide with the main demo's). |
| `component-examples.ts` / `ComponentExamples.cs` / the HTML app's `componentExamples` region / the Eleventy pages' generated region | **Generated** by `bin/generate-examples`: `usage` plus `variants` per slug. Never edit by hand. |

### Where usage comes from

`bin/generate-examples` picks, per app: (1) that framework's own library doc
(`lily-design-system-{framework}-headless/components/{Pascal}.md`, or `…/{slug}/index.md` for
Nunjucks), (2) otherwise the catalog doc `components/{slug}/index.md`, but only where its code
language fits the app (Svelte syntax is not shown in the React app), (3) otherwise the demo's own
HTML markup. A usage block that is only a placeholder (`<Kbd>…</Kbd>`, `<X />`) counts as missing.
Variants are the curated ones plus, for every chart whose demo has a data table, a derived
"graphic only (no data table)" variant.

### Render mechanism per framework

| Framework | Mechanism                  |
| --------- | -------------------------- |
| HTML/JS   | `element.innerHTML = demo` |
| Svelte    | `{@html demo}`             |
| React     | `dangerouslySetInnerHTML`  |
| Vue       | `v-html` directive         |
| Angular   | `[innerHTML]` with `bypassSecurityTrustHtml` |
| Blazor    | `MarkupString`             |
| Nunjucks  | `{{ demo \| safe }}` (the Eleventy pages append a generated `{% raw %}` region) |

### Docs-site pages

`lilydesignsystem.github.io/src/routes/components/{slug}/+page.svelte` is generated by
`bin/generate-site-pages`: the article is `components/{slug}/index.md` rendered with the site's own
`marked`, with **raw HTML in prose escaped** (component descriptions quote tags such as
`<input type="text">`; unescaped, they rendered as real, unlabelled controls) and `<pre>` blocks made
keyboard-focusable; then the Example section (demo, markup, variants, a usage example, the Svelte
source) and the canonical-contract section (`bin/generate-api-docs`). A page that was a
`bin/new-component` placeholder is rebuilt in full; every other page keeps its article and has only
its Example region refreshed. `bin/new-component` runs both generators, so a new component never
ships a placeholder page.

## Accessibility

- Skip-link is the first interactive element on every page.
- Standard landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) wrap every page.
- Focus indicators are visible and high-contrast on every focusable element.
- Keyboard-only users complete every demo flow without a mouse.
- WCAG 2.2 AAA is the target. See [accessibility](../accessibility/index.md) and [testing](../testing/index.md) for the axe-core baseline.

## Acceptance criteria
- [x] All 7 example subprojects ship a complete stylesheet with no CSS-framework dependency. Verified 2026-09-06: no `tailwind`/`bootstrap`/`daisyui`/`bulma`/`foundation-sites` dependency in any of the 6 JS/npm example apps' `package.json`, and no such reference in the Blazor app's `.csproj`.
- [x] CSS targets kebab-case Lily class names directly; no `nhsuk-` or other prefixes appear in markup. Verified 2026-09-06: no `class="nhsuk-..."` (or framework equivalent) found anywhere across the 6 markup-bearing example apps. Note: `nunjucks-eleventy-examples` does use `--nhsuk-*` CSS **custom-property** names (not classes) as inline-style values in a couple of demo pages (`grid.njk`, `skip-link.njk`, others) that borrow NHS UK frontend's own token names for illustration — this doesn't violate the class-name contract as worded, but is worth a maintainer glance since it's a different kind of "nhsuk-" leakage than the rule was written against.
- [x] Design tokens are expressed as CSS custom properties. Confirmed by the `--theme-*` / `--nhsuk-*` custom-property usage found above and the established `themes/` architecture (`AGENTS/theme.md`, spec/theme).
- [x] Every app serves `/`, `/components`, and `/components/{slug}`. Verified 2026-09-06 by route-file inspection in all 7 apps (e.g. Angular `app.routes.ts`: `""`, `"components"`, `"components/:slug"`; Svelte `routes/+page.svelte` + `routes/components/+page.svelte`; Vue `pages/index.vue` + `pages/components/index.vue` + `pages/components/[slug].vue`; HTML `pages/index.html`; Nunjucks `src/index.njk`), consistent with the 9,007-spec Playwright e2e count already recorded in root `spec/index.md` §11.4.
- [x] `/components` lists all 571 catalog entries and is searchable / filterable. Verified 2026-09-06 (491 entries then; 571 as of 2026-10-06): `svelte-sveltekit-examples`' `/components` route implements category + suffix-pattern `.filter(...)` logic (plan P6-T5); catalog count of 491 confirmed separately.
- [x] Each `/components/{slug}` renders a live demo plus canonical metadata. The "canonical metadata" half was already well-supported (root `spec/index.md` §11.2: every component has an `html` demo field in every app). The "live demo" half had a confirmed defect — 44 of 46 national-identifier `-view` demo entries plus `date-time-view` rendered the wrong element shape in the canonical `component-demos.ts` map (see `spec/components/index.md`'s acceptance criteria for the fix, applied 2026-09-06 and propagated to all 7 example apps via `bin/generate-registries`).
- [x] Each app renders demos via its framework's documented mechanism (innerHTML / `{@html}` / `dangerouslySetInnerHTML` / `v-html` / `MarkupString` / `safe`). This is an architectural constant of the demo-rendering approach documented and cross-referenced throughout `spec/examples/index.md` itself, `spec/components/index.md`, and `spec/frameworks/index.md`; not independently re-verified line-by-line in this pass, but no evidence found to the contrary and it is orthogonal to the `*-view` shape defect above (the wrong shape is inside the injected HTML string, not the injection mechanism).
- [x] Every page has a skip-link first, standard landmarks, visible focus, and keyboard-only completion. Confirmed by root `spec/index.md` §11.5 (all 7 example apps axe-clean as of 2026-09-02) and §11.6 (responsive sweep re-verified clean 2026-09-02, explicitly asserting skip-link presence and no horizontal overflow across viewports).

## Verification notes

- Run the SvelteKit axe sweep (`e2e/axe-catalog.spec.ts`) against a **fresh** build: Playwright reuses an
  existing preview server on port 4173, and a stale one serves the old routes (every new page fails
  `document-title`). Kill it first.
- Dark themes: a code block with a fixed light background must also fix its text colour, or the
  theme's light text lands on it (found 2026-10-06 when a usage block was first shown open).

## Related topics
- [headless](../headless/index.md) — the unstyled layer examples consume and style.
- [theme](../theme/index.md) — token shape and `data-theme` light/dark variants.
- [testing](../testing/index.md) — Playwright e2e, axe-core, and responsive sweep across example apps.
- [components](../components/index.md) — catalog and the suffix-to-demo mapping.
- [accessibility](../accessibility/index.md) — the WCAG 2.2 AAA contract examples must meet.

## Sources
- [AGENTS/examples.md](../../AGENTS/examples.md)
- [spec/index.md](../index.md) — §4.5 (Examples), §8.2 (demo strategy), §11.5 (axe), §11.6 (responsive sweep)

---

Lily™ and Lily Design System™ are trademarks.
