# AGENTS — PickerBar (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed React 19 header control: one `<div className="picker-bar">`
that renders `ThemePicker`, `LocalePicker`, `TextSizePicker`, and
`SharePicker` — four of the six `*-picker` helpers — in that fixed
order, each imported as a normal npm dependency from its own published
package (`@lilydesignsystem/react-theme-picker`, `-locale-picker`,
`-text-size-picker`, `-share-picker`). It adds no lifecycle of its own
beyond two catalog-specific defaults: the full 45-theme reference list
(§5.1 of the spec) and the seven-step text-size scale (§5.2).
`motion-picker` and `date-time-picker` are deliberately not included —
see spec §1.

## Files

| File                 | Purpose                                       |
| -------------------- | ---------------------------------------------- |
| `spec/index.md`      | Specification-driven contract (canonical).     |
| `PickerBar.tsx`      | Implementation. TypeScript + React 19.         |
| `PickerBar.test.tsx` | Vitest spec, one assertion per §7 acceptance.  |
| `index.ts`           | Barrel re-export.                              |
| `index.md`           | Comprehensive user guide.                      |

## Public surface

- Default export: `PickerBar` component.
- Named exports: `PickerBar`, `DEFAULT_THEMES`, `DEFAULT_SIZES`.
- Type exports: `Props`, `PickerBarLabels`.

Required props: `labels`, `themesUrl`, `locales`. Full table in
[spec/index.md §4](./spec/index.md#4-props).

## Behaviour contract (one paragraph)

`PickerBar` renders the four wrapped pickers unmodified, passing each
its own required props plus any extras from that picker's `*Props` bag
(`themeProps`, `localeProps`, `textSizeProps`, `shareProps`), spread
**after** the bar's own values so a consumer can override anything.
`themes` defaults to `DEFAULT_THEMES` (all 45 reference theme slugs,
alphabetical with the UK/US themes moved to one alphabetical group at
the bottom); `sizes` defaults to `DEFAULT_SIZES` (`largest` … `smallest`,
seven slugs) with the nested `TextSizePicker`'s `defaultValue` set to
`"normal"` (`text-size-picker`'s own `"medium"` fallback does not exist
in this seven-slug scale). Every other prop — persistence, initial
value, detection, glyph override — is exactly the wrapped picker's own
contract; see that picker's own `AGENTS.md`.

## HTML

```html
<div class="picker-bar {className}" ...restProps>
  <div class="theme-picker">…</div>
  <div class="locale-picker">…</div>
  <div class="text-size-picker">…</div>
  <div class="share-picker">…</div>
</div>
```

No new class hooks — each child keeps its own package's class
contract. `PickerBar` contributes only the `picker-bar` root class.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`PickerBar` adds no new interaction. `labels` supplies all four
accessible names; there is no English default (see
`date-time-picker`'s precedent in AGENTS/helpers.md for why a bar of
structural labels this catalog invented gets none).

## Conventions this package follows

- React 19 function component, TypeScript, no class components.
- Depends on the four wrapped pickers as real npm `dependencies` —
  the same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props (`labels`, and whatever each
  wrapped picker's own props require).

## Build note: this catalog's `build.js`

This package is the reason `../build.js` exists (previously an inline
shell one-liner in `package.json`). `tsup` is a real bundler and, run
from the catalog root, could not see picker-bar's own `dependencies` to
auto-externalize them — it inlined all four siblings' compiled source
into `dist/index.js` (51 KB, versus 2.5 KB once fixed) until `build.js`
started passing every sibling package name as `--external` to every
build. See [spec/index.md §9](./spec/index.md#9-framework-specific-note-the-build-must-externalize-its-siblings).

## Local development note

This catalog has no pnpm workspace linking (`pnpm-workspace.yaml`
carries no `packages:` glob). `../vite.config.ts` aliases the four bare
package specifiers to each sibling's already-built `dist/` so tests
resolve locally; `../tsconfig.json` mirrors that with a `paths` map for
type-checking. Neither alias/path is read by `../build.js` — the
published `dist/index.js` keeps the bare imports (see above), which a
real install resolves from `node_modules` via the `dependencies` in
`package.json`.
