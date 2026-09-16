# AGENTS — PickerBar (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed Angular 20 standalone header control: one
`<div class="picker-bar">` that renders `ThemePicker`, `LocalePicker`,
`TextSizePicker`, and `SharePicker` — four of the six `*-picker`
helpers — in that fixed order, each imported as a normal npm dependency
from its own published package (`@lilydesignsystem/angular-theme-picker`,
`-locale-picker`, `-text-size-picker`, `-share-picker`). It adds no
lifecycle of its own beyond two catalog-specific defaults: the full
45-theme reference list (§5.1 of the spec) and the seven-step
text-size scale (§5.2). `motion-picker` and `date-time-picker` are
deliberately not included — see spec §1.

## Files

| File                          | Purpose                                       |
| ------------------------------ | ---------------------------------------------- |
| `spec/index.md`                | Specification-driven contract (canonical).     |
| `picker-bar.component.ts`      | Implementation. Standalone component, signal inputs/outputs. |
| `picker-bar.component.spec.ts` | Vitest spec, one describe block per §7 acceptance area. |
| `index.ts`                     | Barrel re-export.                              |
| `index.md`                     | Comprehensive user guide.                      |

## Public surface

- Named export: `PickerBar` (selector `lily-picker-bar`).
- Named exports: `DEFAULT_THEMES`, `DEFAULT_SIZES`.
- Type export: `PickerBarLabels`.

Required inputs: `labels`, `themesUrl`, `locales`. Full table in
[spec/index.md §4](./spec/index.md#4-inputs).

## Behaviour contract (one paragraph)

`PickerBar` renders the four wrapped pickers unmodified. Because
Angular has no generic spread-onto-inputs mechanism (unlike the
canonical Svelte contract's `*Props` bag), each wrapped picker's most
commonly needed optional inputs are flattened onto `PickerBar`'s own
inputs with a `theme…` / `locale…` / `textSize…` prefix — see spec §4
for the full list and the deviation note. `themes` defaults to
`DEFAULT_THEMES` (all 45 reference theme slugs, alphabetical with the
UK/US themes moved to one alphabetical group at the bottom); `sizes`
defaults to `DEFAULT_SIZES` (`largest` … `smallest`, seven slugs) with
`textSizeDefaultValue` set to `"normal"` (`text-size-picker`'s own
`"medium"` fallback does not exist in this seven-slug scale). The
three preference pickers' current values are exposed as two-way
`model()` signals (`themeValue`, `localeValue`, `textSizeValue`);
`share-picker`'s `share`/`copy`/`nativeShare` outputs are forwarded
unmodified, since it has no bindable value to model.

## HTML

```html
<div class="picker-bar {className}">
  <lily-theme-picker>…</lily-theme-picker>
  <lily-locale-picker>…</lily-locale-picker>
  <lily-text-size-picker>…</lily-text-size-picker>
  <lily-share-picker>…</lily-share-picker>
</div>
```

No new class hooks — each child keeps its own package's class
contract. `PickerBar` contributes only the `picker-bar` root class.
Angular does not strip the custom-element host tag, so each picker's
own root `<div>` sits one level inside its `<lily-*-picker>` host, not
as a direct child of `.picker-bar` — relevant when a test or consumer
CSS selector walks the DOM tree.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`PickerBar` adds no new interaction. `labels` supplies all four
accessible names; there is no English default.

## Conventions this package follows

- Angular 20 standalone component, signal-based inputs
  (`input()`/`input.required()`), signal outputs (`output()`), model
  signals (`model()`) for the three bindable values, `OnPush` change
  detection.
- Depends on the four wrapped pickers as real npm `dependencies`
  (declared in `ng-package.json`'s `allowedNonPeerDependencies`) — the
  same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs (`labels`, and whatever
  each wrapped picker's own inputs require).

## Local development note

This catalog has no pnpm workspace linking (`pnpm-workspace.yaml`
carries no `packages:` glob). `../vitest.config.ts` aliases the four
bare package specifiers to each sibling's already-built ng-packagr
`dist/fesm2022/*.mjs` so tests resolve locally; `../tsconfig.json`
mirrors that with a `paths` map (to each sibling's `dist/types/*.d.ts`)
for type-checking. Neither alias is read when this package's own
`dist/` is built (`ng-packagr` keeps `dependencies` external, per
`ng-package.json`'s `allowedNonPeerDependencies`) — the published
`dist/fesm2022/@lilydesignsystem/angular-picker-bar.mjs` keeps the
bare imports, which a real install resolves from `node_modules` via
the `dependencies` ng-packagr writes into `dist/package.json`.
