# Lily Design System — Alpine.js Headless — Specification

Living specification for the [Alpine.js](https://alpinejs.dev/) headless implementation. For project-wide rules read the root [spec/index.md](../../spec/index.md) first.

## 1. Role in the ecosystem

A ninth framework family alongside HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks and Web Components, added 2026-10-21. Alpine suits server-rendered pages (Rails, Laravel, Django, Phoenix, Eleventy) that want behaviour without a build step. It is closest to the HTML catalog: the payload is markup, with Alpine directives in place of an embedded `<script>` per file.

## 2. Scope

### In scope (this pass)

- `lily-design-system-alpine-headless`, **537 of 571 components** (488 static, 49 with Alpine behaviour), each with a snippet, a vitest test and a Storybook story.
- The Alpine plugin `lily-alpine.js`.

### Explicitly out of scope (later passes)

- The other 34 components, those whose html-headless snippet carries behaviour; each needs a hand-written `Alpine.data` behaviour (not excluded, simply not yet done).
- `lily-design-system-alpine-examples` (an example app), and the 16 `lily-design-system-alpine-*` helper packages (the ten pickers, `picker-bar`, `data-grid`, `filter`, `kanban-board`, `calendar`, `gantt-chart`).
- Wiring into `bin/check-coverage`, `bin/check-class-names`, `bin/publish-headless`, `bin/smoke-packages`, and the root catalog-count prose: this catalog is deliberately not yet a full-catalog peer, so the 7-library coverage checks do not include it.
- Agent skills (`lily-design-system-alpine-skill`, `-headless-skill`, `-helpers-skill`).

## 3. Architecture

| Concern | Choice |
| ------- | ------ |
| Output | `components/{slug}.html` snippets + `lily-alpine.js` plugin |
| Language | JavaScript (ES modules); Storybook stories are TypeScript like the other catalogs |
| Build | None |
| Peer dependency | `alpinejs` ^3.14 |
| Tests | vitest + jsdom, snippet mounted under real Alpine |
| Storybook | `@storybook/html-vite`, one story per component |
| i18n | none: the consumer supplies all text |

Conventions:

- The base class is the first token of the root's class list.
- Behaviours are `Alpine.data("lily{PascalName}")`, and expose `x-bind` objects so the ARIA and keyboard contract is reusable.
- A parent/child family that shares state (`tab-bar`, `tab-bar-button`, `tab-panel`) shares one `lilyTabs` scope; the three snippets show each piece in a minimal scope and `tab-bar.html` the composed whole.
- Overlays use the native elements: `<dialog>` with `showModal()`.

## 4. Behaviour contracts

Each follows the WAI-ARIA APG pattern and the matching `components/{slug}/AGENTS.md`.

| Component | Plugin | Contract |
| --------- | ------ | -------- |
| toggle-button | `lilyToggleButton` | `aria-pressed` follows state |
| switch-button | `lilySwitchButton` | `role="switch"`, `aria-checked` |
| collapsible | `lilyCollapsible` | trigger `aria-expanded` + `aria-controls`; content `hidden` while collapsed |
| show-more | `lilyShowMore` | button `aria-expanded`; content `data-expanded` |
| popover | `lilyPopover` | `aria-haspopup="dialog"`, Escape closes and returns focus, outside click closes |
| tooltip | `lilyTooltip` | `role="tooltip"`; hover, focus; hoverable; Escape dismisses without moving focus (WCAG 1.4.13) |
| clipboard-copy-button | `lilyClipboardCopy` | copies the supplied text; `data-copied` |
| toggle-group | `lilyToggleGroup` | `role="group"`; independent `aria-pressed` items |
| tab-bar family | `lilyTabs` | tablist, roving `tabindex`, Arrow/Home/End with automatic activation, `aria-controls`/`aria-labelledby` both ways |
| dialog | `lilyDialog` | native `<dialog>`, `showModal()`, Escape closes, `aria-modal` |

## 5. Acceptance criteria

- [x] Package scaffolded with the required files (`index.md`, `README.md` symlink, `AGENTS.md`, `spec/index.md`) and synced special files.
- [x] 537 components, each with snippet, test and story. Static components are tested for element, base class and role only.
- [x] `pnpm test` passes (1,157 tests).
- [x] Registered in `bin/sync-special-files`, CI and Dependabot.
- [ ] Remaining 34 behavioural components.
- [ ] Example app, helpers, skills, publish pipeline.

## Related topics

[html headless](../../lily-design-system-html-headless/spec/index.md), [web-components headless](../../lily-design-system-web-components-headless/spec/index.md), [frameworks](../../spec/frameworks/index.md), [headless](../../spec/headless/index.md).
