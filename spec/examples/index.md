# Examples

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** The example subprojects are complete, styled reference applications that show what the headless components look like with real CSS, real interactivity, and a working app shell — every visual decision made and every user-facing string supplied.

## Scope

Covers the seven example apps (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Angular + Analog.js, Blazor Web, Nunjucks Eleventy): their styling contract, required routes, composed-page demos, accessibility rules, and the per-framework mechanism for rendering component demos. Examples are the inverse of the [headless](../headless/index.md) layer: headless ships markup, ARIA, and keyboard semantics only; examples ship every pixel.

## Principles and rules

- **Complete stylesheet, no framework dependency.** Each app ships a full stylesheet. The current default visual reference is the NHS UK design system applied to Lily class names. No Tailwind, DaisyUI, Bootstrap, or other CSS-framework dependency.
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
| `/components`        | Components index listing all 492 catalog entries; searchable / filterable; links to each detail page. |
| `/components/{slug}` | One detail page per component: renders a single component (not a grid), shows a usable demo, and surfaces canonical metadata (description, props, ARIA, keyboard, references). |

## Composed-page demos

Composed pages exercise multiple components together to validate the system as a whole. They are encouraged on top of the required routes, not required.

| Composed route             | Composed route             | Composed route             |
| -------------------------- | -------------------------- | -------------------------- |
| `/dashboard`               | `/contact-form`            | `/page-layout`             |
| `/timeline-and-cards`      | `/dialog-flow`             | `/file-upload-form`        |
| `/navigation-and-menus`    | `/rating-and-feedback`     | `/search-and-filter`       |
| `/settings-page`           | `/tabbed-interface`        | `/task-management`         |

## Per-framework demo render mechanism

Each `/components/{slug}` page renders generated demo HTML for the component. The render mechanism differs by framework (spec.md §8.2).

| Framework | Mechanism                  |
| --------- | -------------------------- |
| HTML/JS   | `element.innerHTML = demo` |
| Svelte    | `{@html demo}`             |
| React     | `dangerouslySetInnerHTML`  |
| Vue       | `v-html` directive         |
| Blazor    | `MarkupString`             |
| Nunjucks  | `{{ demo \| safe }}`       |

Demo HTML is generated from the component's suffix pattern (`*-input` → labeled input, `*-button` → button, `*-nav` → labelled nav, `*-list` → ordered list, `*-table` → table structure, `*-view` → span with `role="img"`, `*-picker` → div with `role="radiogroup"`, etc.). See [components](../components/index.md) for the full suffix mapping.

## Accessibility

- Skip-link is the first interactive element on every page.
- Standard landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) wrap every page.
- Focus indicators are visible and high-contrast on every focusable element.
- Keyboard-only users complete every demo flow without a mouse.
- WCAG 2.2 AAA is the target. See [accessibility](../accessibility/index.md) and [testing](../testing/index.md) for the axe-core baseline.

## Acceptance criteria
- [ ] All 7 example subprojects ship a complete stylesheet with no CSS-framework dependency.
- [ ] CSS targets kebab-case Lily class names directly; no `nhsuk-` or other prefixes appear in markup.
- [ ] Design tokens are expressed as CSS custom properties.
- [ ] Every app serves `/`, `/components`, and `/components/{slug}`.
- [ ] `/components` lists all 492 catalog entries and is searchable / filterable.
- [ ] Each `/components/{slug}` renders a live demo plus canonical metadata.
- [ ] Each app renders demos via its framework's documented mechanism (innerHTML / `{@html}` / `dangerouslySetInnerHTML` / `v-html` / `MarkupString` / `safe`).
- [ ] Every page has a skip-link first, standard landmarks, visible focus, and keyboard-only completion.

## Related topics
- [headless](../headless/index.md) — the unstyled layer examples consume and style.
- [theme](../theme/index.md) — token shape and `data-theme` light/dark variants.
- [testing](../testing/index.md) — Playwright e2e, axe-core, and responsive sweep across example apps.
- [components](../components/index.md) — catalog and the suffix-to-demo mapping.
- [accessibility](../accessibility/index.md) — the WCAG 2.2 AAA contract examples must meet.

## Sources
- [AGENTS/examples.md](../../AGENTS/examples.md)
- [spec.md](../../spec.md) — §4.5 (Examples), §8.2 (demo strategy), §11.5 (axe), §11.6 (responsive sweep)
