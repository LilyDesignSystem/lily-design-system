# AGENTS — PickerBar (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed Svelte 5 header control: one `<div class="picker-bar">` that
renders `ThemePicker`, `LocalePicker`, `TextSizePicker`, and
`SharePicker` — four of the six `*-picker` helpers — in that fixed
order, each imported as a normal npm dependency from its own published
package (`lily-design-system-svelte-theme-picker`,
`-locale-picker`, `-text-size-picker`, `-share-picker`). It adds no
lifecycle of its own beyond two catalog-specific defaults: the full
45-theme reference list (§5.1 of the spec) and the seven-step text-size
scale (§5.2). `motion-picker` and `date-time-picker` are deliberately
not included — see spec §1.

## Files

| File               | Purpose                                       |
| ------------------ | ---------------------------------------------- |
| `spec/index.md`    | Specification-driven contract (canonical).     |
| `PickerBar.svelte` | Implementation. TypeScript + Svelte 5 runes.   |
| `PickerBar.test.ts`| Vitest spec, one assertion per §7 acceptance.  |
| `index.ts`         | Barrel re-export.                              |
| `index.md`         | Comprehensive user guide.                      |

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
<div class="picker-bar {class}" ...restProps>
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

- Svelte 5 runes (`$props`).
- Strict TypeScript on the public surface.
- Depends on the four wrapped pickers as real npm `dependencies` —
  the same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props (`labels`, and whatever each
  wrapped picker's own props require).

## Local development note

This catalog has no pnpm workspace linking (`pnpm-workspace.yaml`
carries no `packages:` glob). `../vite.config.js` aliases the four bare
package specifiers to each sibling's already-built `dist/` so tests
resolve locally; `../tsconfig.json` mirrors that with a `paths` map for
type-checking. Neither alias is read when this package's own `dist/`
is built (`../build.js` copies only this package's own source, and
`svelte-package` does not bundle) — the published `dist/PickerBar.svelte`
keeps the bare imports, which a real install resolves from
`node_modules` via the `dependencies` in `package.json`.
