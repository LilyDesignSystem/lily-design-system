# AGENTS — `<picker-bar>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed vanilla HTML/JS header control, packaged as the
`<picker-bar>` custom element: renders `<theme-picker>`,
`<locale-picker>`, `<text-size-picker>`, and `<share-picker>` — four of
the six `*-picker` helpers — in that fixed order, each imported from
its own published package (`@lilydesignsystem/html-theme-picker`,
`-locale-picker`, `-text-size-picker`, `-share-picker`) as a real npm
dependency, not vendored. Adds no lifecycle of its own beyond two
catalog-specific defaults: the full 45-theme reference list (spec §5.1)
and the seven-step text-size scale (spec §5.2). `motion-picker` and
`date-time-picker` are deliberately not included — see spec §1.

## Files

| File                  | Purpose                                        |
| ---------------------- | ------------------------------------------------ |
| `spec/index.md`        | Specification-driven contract (canonical).       |
| `picker-bar.ts`       | Implementation (TypeScript class).               |
| `picker-bar.test.ts`  | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`             | Barrel re-export + side-effectful registration.  |
| `index.md`             | Human-readable guide.                            |
| `tsconfig.json`        | Scoped to this package's own build only — see below. |

## Public surface

- Class `PickerBar extends HTMLElement` (registered as `<picker-bar>`
  on import of `index.ts`, alongside the four wrapped elements — this
  package's `index.ts` imports each sibling's own barrel, which
  self-registers).
- Named exports: `PickerBar`, `DEFAULT_THEMES`, `DEFAULT_SIZES`.
- Type exports: `PickerBarProps`, `PickerBarLabels`, `ThemePickerExtra`,
  `LocalePickerExtra`, `TextSizePickerExtra`, `SharePickerExtra`,
  `ShareTarget`.
- Instance members: `labels`, `themesUrl`, `themes`, `themeProps`,
  `locales`, `localeProps`, `sizes`, `textSizeProps`, `shareTargets`,
  `shareProps` (property accessors — see spec §4), plus four read-only
  getters onto the rendered children: `themePicker`, `localePicker`,
  `textSizePicker`, `sharePicker`.

Required: `labels` (property), `themes-url` (attribute or `themesUrl`
property), `locales` (attribute or property).

## Behaviour contract (one paragraph)

`<picker-bar>` renders a `<div class="picker-bar {class}">` holding the
four wrapped elements unmodified. Each `*Props` bag
(`themeProps`/`localeProps`/`textSizeProps`/`shareProps`) is applied via
`Object.assign(childElement, bag)` **before** that child is connected —
so a bag entry that reflects to an attribute (`storageKey`,
`detectFromSystem`, `defaultValue`, …) still governs the child's own
first-connect initial-value resolution, not just its post-mount state.
`themes` defaults to `DEFAULT_THEMES`; `sizes` defaults to
`DEFAULT_SIZES` with the nested `<text-size-picker>`'s `defaultValue`
set to `"normal"` (its own `"medium"` fallback doesn't exist in this
seven-slug scale) unless `textSizeProps.defaultValue` overrides it.

## HTML

```html
<picker-bar>
  <div class="picker-bar {class}">
    <theme-picker>…</theme-picker>
    <locale-picker>…</locale-picker>
    <text-size-picker>…</text-size-picker>
    <share-picker>…</share-picker>
  </div>
</picker-bar>
```

No new class hooks beyond the `picker-bar` wrapper — each child keeps
its own package's class contract.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`<picker-bar>` adds no new interaction. `labels` supplies all four
accessible names; there is no English default (mirrors
`date-time-picker`'s `labels` precedent — a set of names this catalog
invented is exactly the case Lily's i18n rule exists for).

## Conventions this package follows

- Vanilla `HTMLElement` subclass, light DOM, no Shadow DOM.
- Depends on the four wrapped pickers as real npm `dependencies` — the
  same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `labels` and whatever each wrapped
  picker's own props require.

## Build note: the only package in this catalog with real dependencies

Every other package in this catalog has no `dependencies` field, so
the shared `build.js` never had to mark anything `--external` before
this package existed. `build.js` now reads each package's own
`package.json#dependencies` and passes every entry to `tsup` as
`--external`, so the bare `@lilydesignsystem/html-theme-picker` (etc.)
imports in the built `dist/index.js` are left as real npm imports for
a consumer's install to resolve, rather than tsup either erroring
(can't resolve them locally — nothing installs siblings into
`node_modules` in this catalog) or wrongly bundling them.

This package also carries its own `tsconfig.json` — the only one in
the catalog — with a `paths` map so the DTS rollup step can resolve the
four siblings' published types. `build.js` passes it to `tsup` via
`--tsconfig` **scoped to this package's own build invocation only**;
it is never picked up as a catalog-wide default, so the other six
packages' builds are unaffected. Local test resolution for the bare
imports uses a separate mechanism — see `../vitest.config.ts`'s
`resolve.alias`, which points them at each sibling's already-built
`dist/` for dev/test only (never read by the real build).
