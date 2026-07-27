# AGENTS — ThemeChooser (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless theme chooser that
**loads theme CSS files dynamically at runtime** from a developer-supplied
directory URL. Ships no CSS; consumer styles the `theme-chooser` class
hook.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns the lifecycle (storage, link swap, attribute application).

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `theme-chooser.njk`         | Nunjucks macro (`themeChooser(opts)`).            |
| `theme-chooser.client.js`   | ES module — `initThemeChooser`, `autoInit`, helpers. |
| `theme-chooser.test.ts`     | Vitest spec, one assertion per §7 acceptance.    |
| `index.md`                 | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./theme-chooser.njk" import themeChooser %}`
- Call:   `{{ themeChooser({label, themesUrl, themes, …}) }}`
- Required `opts` keys: `label`, `themesUrl`, `themes`.
- Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).

### Client.js

- `import { initThemeChooser, autoInit, normaliseThemesUrl, themeHref, themeName, matchSystemTheme, CIRCLE_WITH_RIGHT_HALF_BLACK } from "./theme-chooser.client.js"`
- `themeName(slug)` mirrors locale-chooser's `localeName(code)`:
  `"high-contrast"` → `"High Contrast"`. It is the single JS statement
  of the label rule; the macro applies the same rule in template syntax
  (a Nunjucks macro cannot call into the module), and a test holds the
  two in agreement.
- `matchSystemTheme(themes)` mirrors locale-chooser's
  `matchNavigatorLanguage(navLangs, locales)`. Client-only: returns `""`
  when `matchMedia` is unavailable.
- Required call: `initThemeChooser(rootElement, opts?)` or
  `autoInit(opts?)` to wire every `[data-lily-theme-chooser-root]` on
  the page.

## Behaviour contract (one paragraph)

The macro emits a `<div class="theme-chooser">` carrying
`data-lily-theme-chooser-*` hooks describing the control's name, themes
URL, extension, storage key, default value, and — when `opts.value` is
set — the consumer's initial value (`data-lily-theme-chooser-value`).
Inside it are a hidden input, an icon `<button>`, and a
`<ul role="listbox" hidden>`. On `initThemeChooser(root)`, the client
(1) resolves the initial slug from value attribute > storage > system
colour-scheme detection (when `detectFromSystem` is on) > default-value
> `"light"` > first-option, (2) injects/updates a managed
`<link rel="stylesheet" data-lily-theme-chooser="{name}">` whose href is
`${themesUrl}${slug}${extension}`, (3) sets `data-theme="{slug}"` on
the resolved target (defaults to `document.documentElement`), (4)
optionally writes to `localStorage`, (5) mirrors the slug into the
hidden input and re-derives every option's `aria-selected`, (6) calls
`onChange(slug)`. The client ALSO owns the entire listbox interaction:
open/close, focus movement, the APG keyboard contract, and typeahead.

## HTML

```html
<div class="theme-chooser {classes}" data-lily-theme-chooser-root …>
  <input type="hidden" name="{name}" value="{selected}"
         data-lily-theme-chooser-input>
  <button type="button" class="theme-chooser-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="{id}-list" data-lily-theme-chooser-button>
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="{id}-list" role="listbox"
      aria-label="{label}" tabindex="-1" hidden data-lily-theme-chooser-list>
    <li class="theme-chooser-option" id="{id}-option-{i}" role="option"
        aria-selected="true|false" data-value="{slug}">{labelFor(slug)}</li>
  </ul>
</div>
```

The glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK, `aria-hidden`. A
`{% call %}` block body replaces the glyph inside the button (the
Nunjucks equivalent of `children`); it does not render options.

Server markup marks exactly ONE option `aria-selected="true"`,
resolved as `value or defaultValue or ("light" if present else
themes[0])`, and pre-fills the hidden input with it. The listbox is
rendered `hidden` with no `aria-activedescendant` and no `data-active`
— those are client-owned open-state concerns. `opts.value` still
travels ONLY on `data-lily-theme-chooser-value`.

Ids are `{id}-list` / `{id}-option-{i}` where `id` defaults to
`theme-chooser-{name}`. Deterministic and SSR-safe; two instances
sharing a `name` need an explicit distinct `id`.

There is **no** `placeholder` param and **no**
`.theme-chooser-placeholder` hook — both were removed with the
`<select>`.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- The client provides Arrow / Home / End / Enter / Space / Escape /
  Tab / typeahead semantics; none of it works before the client runs.
- `aria-label` is the ONLY accessible name the button has, since the
  glyph is `aria-hidden`.
- `aria-selected` tracks the applied theme; `data-active` tracks the
  keyboard cursor. They are different things.
- Known tradeoffs, documented honestly in `docs/accessibility.md`: an
  icon-only control depends entirely on `aria-label`; a custom listbox
  has weaker AT support than a native `<select>`; the glyph may render
  differently or be missing depending on platform fonts.
- **No-JS regression**: the button will not open without the client
  module. Stated plainly in `docs/ssr.md`.
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
