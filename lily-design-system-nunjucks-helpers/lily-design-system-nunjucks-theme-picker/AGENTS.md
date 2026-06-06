# AGENTS — ThemePicker (Nunjucks helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless theme picker that
**loads theme CSS files dynamically at runtime** from a developer-supplied
directory URL. Ships no CSS; consumer styles the `theme-picker` class
hook.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns the lifecycle (storage, link swap, attribute application).

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `theme-picker.njk`         | Nunjucks macro (`themePicker(opts)`).            |
| `theme-picker.client.js`   | ES module — `initThemePicker`, `autoInit`, helpers. |
| `theme-picker.test.ts`     | Vitest spec, one assertion per §7 acceptance.    |
| `index.md`                 | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./theme-picker.njk" import themePicker %}`
- Call:   `{{ themePicker({label, themesUrl, themes, …}) }}`
- Required `opts` keys: `label`, `themesUrl`, `themes`.
- Full table in [spec.md §4.1](./spec.md#41-macro-parameters).

### Client.js

- `import { initThemePicker, autoInit, normaliseThemesUrl, themeHref } from "./theme-picker.client.js"`
- Required call: `initThemePicker(rootElement, opts?)` or
  `autoInit(opts?)` to wire every `[data-lily-theme-picker-root]` on
  the page.

## Behaviour contract (one paragraph)

The macro emits a `<fieldset class="theme-picker" role="radiogroup">`
with `data-lily-theme-picker-*` hooks describing the picker's name,
themes URL, extension, storage key, and default value. On
`initThemePicker(root)`, the client (1) resolves the initial slug
from storage > checked radio > default-value > `"light"` >
first-radio, (2) injects/updates a managed `<link
rel="stylesheet" data-lily-theme-picker="{name}">` whose href is
`${themesUrl}${slug}${extension}`, (3) sets `data-theme="{slug}"` on
the resolved target (defaults to `document.documentElement`), (4)
optionally writes to `localStorage`, (5) calls `onChange(slug)`.

## HTML

`<fieldset class="theme-picker {classes}" role="radiogroup"
aria-label="{label}" data-lily-theme-picker-root …>` containing one
`<label class="theme-picker-option"><input type="radio" …><span
class="theme-picker-option-label">…</span></label>` per slug.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
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
