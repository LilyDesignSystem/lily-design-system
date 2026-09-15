# AGENTS — PickerBar (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed Nunjucks 3 header control: one macro,
`pickerBar(opts)`, that renders `theme-picker`, `locale-picker`,
`text-size-picker`, and `share-picker` — four of the six `*-picker`
helpers in this catalog — in that fixed order inside
`<div class="picker-bar" data-lily-picker-bar-root>`, each imported
from its own sibling npm package (a real `dependencies` entry in
`package.json`, not vendored source). It adds no lifecycle of its own
beyond two catalog-specific defaults: the full 45-theme reference list
(§5.1 of the spec) and the seven-step text-size scale (§5.2).
`motion-picker` and `date-time-picker` are deliberately not included —
see spec §1.

Like every helper in this catalog, it is a **macro + client.js pair** —
except the client.js here owns no lifecycle of its own; it is a
convenience wrapper. See spec §3.3.

## Files

| File                  | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `spec/index.md`        | Specification-driven contract (canonical).        |
| `picker-bar.njk`      | Nunjucks macro (`pickerBar(opts)`).              |
| `picker-bar.client.js`| Convenience `initPickerBar`/`autoInit` wrapper.  |
| `picker-bar.test.ts`  | Vitest spec, one assertion per §7 acceptance.     |
| `index.md`             | Comprehensive user guide.                         |

## Public surface

### Macro

- Import: `{% from "lily-design-system-nunjucks-picker-bar/dist/picker-bar.njk" import pickerBar %}`
- Call: `{{ pickerBar({labels, themesUrl, locales, …}) }}`
- Required `opts` keys: `labels`, `themesUrl`, `locales`.
- Full table in [spec/index.md §4](./spec/index.md#4-macro-parameters).

### Client.js

`initPickerBar(root, opts)`, `autoInit(opts)`, `DEFAULT_THEMES`,
`DEFAULT_SIZES`, and re-exports of the four siblings' own `autoInit`
under `autoInit{X}Picker` names.

## Behaviour contract (one paragraph)

The macro renders the four wrapped picker macros unmodified, forwarding
each its own required params plus any extras from that picker's
`*Props` object (`themeProps`, `localeProps`, `textSizeProps`,
`shareProps`) — anything in one of those objects (persistence, initial
value, detection, an override-labels map, `id`, `classes`,
`attributes`) reaches that picker exactly as if called directly.
`themes` defaults to `DEFAULT_THEMES` (all 45 reference theme slugs,
alphabetical with the UK/US themes moved to one alphabetical group at
the bottom); `sizes` defaults to `DEFAULT_SIZES` (`largest` … `smallest`,
seven slugs) with the nested `text-size-picker`'s `defaultValue` set to
`"normal"` (its own `"medium"` fallback does not exist in this
seven-slug scale). None of the four wrapped pickers is operable until
their own client.js modules run — same no-JS story as every other
helper in this catalog; `picker-bar.client.js` is one convenient way to
wire all four at once (§4.3), not a requirement.

## HTML

```html
<div class="picker-bar {classes}" data-lily-picker-bar-root ...attributes>
  <div class="theme-picker" data-lily-theme-picker-root>…</div>
  <div class="locale-picker" data-lily-locale-picker-root>…</div>
  <div class="text-size-picker" data-lily-text-size-picker-root>…</div>
  <div class="share-picker" data-lily-share-picker-root>…</div>
</div>
```

No new class hooks beyond the `picker-bar` root — each child keeps its
own package's class contract.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`pickerBar` adds no new interaction. `labels` supplies all four
accessible names; there is no English default (see `date-time-picker`'s
precedent in AGENTS/helpers.md for why a bar of structural labels this
catalog invented gets none).

## Conventions this package follows

- Nunjucks 3 macro, camelCase name (`pickerBar`), kebab-case file path
  and CSS class.
- Single `opts` parameter on the macro.
- Depends on the four wrapped pickers as real npm `dependencies` — the
  same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `opts` (`labels`, and whatever
  each wrapped picker's own params require).
- No inline `<script>` in the macro output.

## Local development note

This catalog has no pnpm/npm workspace linking. `../vitest.config.ts`
aliases the four bare package specifiers (for the client.js JS import)
to each sibling's already-built `dist/index.js` so tests resolve
locally, and the test file's own `nunjucks.configure([...])` includes
the catalog root as a second search path so the macro's
`{% from "lily-design-system-nunjucks-theme-picker/dist/theme-picker.njk" %}`
imports resolve the same way a real `node_modules` install would.
Neither shim is read when this package's own `dist/` is built: the
shared catalog `build` script (`package.json`) now reads each
package's own `dependencies` and passes them to `tsup --external`, so
`picker-bar.client.js`'s bare imports are kept out of the bundle
rather than failing to resolve — a real install resolves them from
`node_modules` via the `dependencies` in this package's own
`package.json`.
