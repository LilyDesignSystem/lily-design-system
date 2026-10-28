---
name: lily-design-system-skill
description: Explains Lily Design System™ concepts, terminology, and usage patterns for people building with it — the headless-vs-example layers, the 582-component catalog, naming conventions, composition patterns, theming, and the seven supported frameworks. Use when someone asks what Lily Design System is, what a Lily term means (headless, class hook, slug, helper, theme), how to compose a Lily pattern (a form, a nav, a table, a page shell), or wants a working example in a given framework.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — concepts & usage

Lily is a free, open-source, **headless** design system: a canonical catalog
of 582 accessible components, implemented across seven frameworks, that ship
semantic HTML, ARIA, focus management, and keyboard behaviour — and **no
CSS**. A paired set of **example** apps shows the same catalog fully styled
(the current visual reference is NHS UK) so adopters can see it working
end-to-end before wiring it into their own app.

Canonical monorepo: <https://github.com/LilyDesignSystem/lily-design-system>.
Docs and searchable catalog: <https://lilydesignsystem.com/>.

## The two layers

- **Headless** — the library you actually depend on. One package per
  framework (HTML/Web Components, Svelte, React, Vue, Angular, Blazor,
  Nunjucks). Every component picks the most specific HTML element for the
  job, wires up ARIA and keyboard behaviour, and puts a stable kebab-case
  class on its root element — that class is the _only_ styling contract.
  Nothing else about visual appearance is decided for you.
- **Example** — a full reference app per framework, styled end to end, that
  demonstrates every component and several composed pages (a contact form, a
  dashboard, a settings page, and more). Read the example's CSS as a working
  answer to "how would I style this component," not as something you import.

If a request is about _how a component looks_, point at the example app and
its CSS. If it's about _what markup and behaviour a component ships_, that's
the headless layer.

## Core terms

| Term           | Meaning                                                                                                                                                                                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component**  | One entry in the catalog — a slug, a PascalCase name, an HTML tag, an ARIA/keyboard contract. E.g. `breadcrumb-nav` / `BreadcrumbNav` / `<nav>`.                                                                                                                                                                                  |
| **Slug**       | The kebab-case identifier for a component, also its CSS class hook (`.breadcrumb-nav`).                                                                                                                                                                                                                                           |
| **Class hook** | The one stable CSS class every component's root element carries. Consumer CSS targets it; nothing else is a contract to rely on unless the component's docs name a sub-class.                                                                                                                                                     |
| **Helper**     | A small opinionated package (`theme-picker`, `locale-picker`, `text-size-picker`, `share-picker`, `date-time-picker`) that owns one whole interaction — not just markup, but the popup, the keyboard behaviour, and (for the first three) applying + persisting a preference. Helpers are a layer above plain catalog components. |
| **Theme**      | A ready-to-use stylesheet (57 of them, under `themes/`) targeting the class hooks — NHS England/Scotland/Wales, GOV.UK, USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose light/dark. The `theme-picker` helper swaps between them at runtime.                                                                         |
| **Subproject** | One implementation of the whole catalog for one framework and one layer, e.g. `@lilydesignsystem/react-headless`. Published as its own git subtree/repo.                                                                                                                                                                          |

## Naming conventions

Every slug's suffix fixes its HTML element — `-button` → `<button>`,
`-input` → `<input>`, `-nav` → `<nav>`, `-list`/`-list-item` → `<ol>`/`<li>`,
`-table` (+ `-table-head`/`-body`/`-foot`/`-row`/`-th`/`-td`) → the table
family, `-dialog` → `<dialog>`, `-picker` → `<div>`, `-select` → `<select>`.
See [reference/naming-and-catalog.md](reference/naming-and-catalog.md) for
the full mapping and the compound family patterns (`*List`/`*ListItem`,
`*Nav`/`*List`/`*ListItem`, `*Menu`/`*MenuItem`, `*Picker`/`*PickerButton`,
`*Input`/`*View`, table sub-elements, and more).

## Composing components

Components snap together into a handful of recurring shapes — a form, a
navigation trail, a table, a five-region page shell. Worked examples in
several frameworks: [reference/composition-patterns.md](reference/composition-patterns.md).

## The catalog at a glance

582 components across content (161), national personal identifiers (140,
70 identifier types × input/view across 50+ countries), forms (57),
navigation (55), tables (40), lists (40), data visualisation (18), links (16),
pickers (14), overlays (14), media (8), and buttons (8). Full
listing: `components.tsv` in the canonical repo, or browse it at
<https://lilydesignsystem.com/components/>.

## Picking a framework

Each of the seven frameworks ships a matched headless + example pair:
HTML/Web Components, Svelte 5, React, Vue 3, Angular 20, Blazor, Nunjucks.
All seven implement the full 582-component catalog with the same slugs,
props, and ARIA/keyboard contracts — pick whichever matches your stack, the
concepts and naming transfer directly.

## Helpers and label packs

Above the headless catalog sit the **helper packages**, one top-level package each: ten icon-button pickers (theme, locale, text size,
motion, share, search, link, menu, settings, and the date-time field), `picker-bar`, and the grid-like `data-grid`, `kanban-board`,
`gantt-chart`, `calendar` and `filter`, in all eight catalogs. The grid-like helpers take a large `labels` object and ship no English; the
repository's `shared/label-packs/` holds that object ready-made for 64 locales (English reviewed, 63 machine drafts awaiting native-speaker
review). Ask for `spec/label-packs/index.md` before writing labels by hand.

## Making a Lily layout responsive

Responsive behaviour is your CSS (or a Lily theme's), never a component's: headless components carry no media
queries, sizes or breakpoints. The rules the themes follow, which are worth following in your own CSS:

- Mobile first: base rules are the narrow layout; queries add width with `min-width`.
- Prefer intrinsic sizing (`minmax()`, `min()`, `clamp()`, `flex-wrap`, `auto-fit`) to breakpoints. `grid` takes a
  `minColumnWidth` for "as many columns as fit".
- Breakpoints in `rem` from one table: `40rem`, `48rem`, `64rem`, `80rem`, `96rem`.
- Components answer to the space they are given (container queries; the `grail-layout` regions are the containers in
  the themes), page shells answer to the window.
- Logical properties (`inline-size`, `margin-inline`) so right-to-left needs no second stylesheet.
- No horizontal page scroll at 320 CSS pixels (WCAG 1.4.10) and usable at 400% zoom (1.4.4); wide content scrolls
  inside its own labelled region; text never goes below `1rem`; long unbroken strings wrap (`overflow-wrap: anywhere`).
- `grail-layout` collapses right aside first, then left; source order is reading order.

Ask for `spec/responsive/index.md` for the full rules and how each is checked.

## What Lily deliberately doesn't do

No bundled CSS, fonts, icons, or images in the headless layer. No data
fetching, routing, persistence, or locale-specific formatting inside a
component — those stay with the consumer. No hardcoded user-facing
strings — every label, placeholder, and error message is a prop the
consumer supplies.
