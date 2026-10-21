# Lily Design System™ — Alpine.js Examples

A static example site for the [Alpine.js headless catalog](../lily-design-system-alpine-headless/): every one of the 571
components with a live demo and its markup, plus demo pages for the four Alpine helpers — the
[data grid](../lily-design-system-alpine-data-grid/), [kanban board](../lily-design-system-alpine-kanban-board/),
[calendar](../lily-design-system-alpine-calendar/) and [Gantt chart](../lily-design-system-alpine-gantt-chart/). No framework
runtime: `node build.mjs` writes plain HTML into `dist/`, bundles Alpine once into `assets/app.js`, and copies the repo's
reference themes, so the look is whichever theme the header's selector picks (NHS England for patients by default).

## Routes

- `/` — home.
- `/components/` — the full catalog, searchable (every term must appear in a component's name or description).
- `/components/{slug}/` — one page per component: a live demo, the shipped snippet's markup, and links to its specification.
- `/helpers/` and `/helpers/{data-grid,kanban-board,calendar,gantt-chart}/` — a demo of each helper with the options that drive it.

Every page has the skip link first, the header / nav / main / footer landmarks, and a theme selector that is remembered.

## How a demo is made

A component page's demo is the snippet with each empty `aria-label` given the component's name (where the element can be named),
each "Consumer provides …" comment turned into visible sample text (where the parent may hold text), and — only where a component is
invalid alone — a parent around it (a `<ul>` for a list item, a `<select>` for an option, a menu for a menu item). It is a demo, not
a design: a real app supplies its own text. The *markup* shown under the demo is the shipped snippet, unchanged.

## Develop

```sh
pnpm install
pnpm build         # dist/ (578 pages)
pnpm test          # vitest: the build, and every demo mounted under real Alpine in jsdom
pnpm test:e2e      # Playwright + axe: every page in Chromium, plus the helpers' mouse and keyboard flows
pnpm serve         # http://localhost:8082/
```

## Known gaps

- The theme selector is a plain `<select>`; there is no Alpine `theme-picker`, `locale-picker` or `text-size-picker` yet.
- One accessibility finding is the reference theme's, not the snippets': the filled-star colour of `five-star-rating-view`
  (1.49:1 on the NHS England page background). The axe sweep names it.
- No composed-page demos (dashboard, contact form …) yet.
