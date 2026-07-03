# AGENTS — ThemeSelect (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless theme select that
**loads theme CSS files dynamically at runtime** from a developer-supplied
directory URL. Ships no CSS; consumer styles the `theme-select` class
hook.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns the lifecycle (storage, link swap, attribute application).

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `theme-select.njk`         | Nunjucks macro (`themeSelect(opts)`).            |
| `theme-select.client.js`   | ES module — `initThemeSelect`, `autoInit`, helpers. |
| `theme-select.test.ts`     | Vitest spec, one assertion per §7 acceptance.    |
| `index.md`                 | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./theme-select.njk" import themeSelect %}`
- Call:   `{{ themeSelect({label, themesUrl, themes, …}) }}`
- Required `opts` keys: `label`, `themesUrl`, `themes`.
- Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).

### Client.js

- `import { initThemeSelect, autoInit, normaliseThemesUrl, themeHref } from "./theme-select.client.js"`
- Required call: `initThemeSelect(rootElement, opts?)` or
  `autoInit(opts?)` to wire every `[data-lily-theme-select-root]` on
  the page.

## Behaviour contract (one paragraph)

The macro emits a `<select class="theme-select">` carrying the `name`
attribute and `data-lily-theme-select-*` hooks describing the select's
name, themes URL, extension, storage key, and default value. On
`initThemeSelect(root)`, the client (1) resolves the initial slug
from storage > selected option > default-value > `"light"` >
first-option, (2) injects/updates a managed `<link
rel="stylesheet" data-lily-theme-select="{name}">` whose href is
`${themesUrl}${slug}${extension}`, (3) sets `data-theme="{slug}"` on
the resolved target (defaults to `document.documentElement`), (4)
optionally writes to `localStorage`, (5) calls `onChange(slug)`.

## HTML

`<select class="theme-select {classes}" aria-label="{label}"
name="{name}" data-lily-theme-select-root …>` containing one
`<option class="theme-select-option" value="{slug}">…</option>` per
slug.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead / Tab
  semantics.
- `<select>` has the implicit `combobox` role; each `<option>` has the
  implicit `option` role.
- `aria-label` carries the consumer-supplied control name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency on the client side beyond standard DOM APIs.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `opts`.
- No inline `<script>` in the macro output; the client.js is loaded
  separately by the consumer.
