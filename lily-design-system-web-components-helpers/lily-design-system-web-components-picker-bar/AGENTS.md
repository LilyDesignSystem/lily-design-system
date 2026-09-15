# AGENTS — `<lily-picker-bar>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed vanilla HTML/JS header control: the `<lily-picker-bar>`
custom element renders `<lily-theme-picker>`, `<lily-locale-picker>`,
`<lily-text-size-picker>`, and `<lily-share-picker>` — four of the six
`*-picker` helpers in this catalog — in that fixed order, each
imported as a normal npm dependency from its own published package. It
adds no lifecycle of its own beyond two catalog-specific defaults: the
full 45-theme reference list (§5.1 of the spec) and the seven-step
text-size scale (§5.2). `<lily-motion-picker>` and
`<lily-date-time-picker>` are deliberately not included — see spec §1.

## Files

| File                  | Purpose                                        |
| --------------------- | ------------------------------------------------ |
| `spec/index.md`       | Specification-driven contract (canonical).       |
| `picker-bar.ts`      | Implementation (TypeScript custom-element class). |
| `picker-bar.test.ts` | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`             | Barrel re-export + side-effectful registration.  |
| `index.md`             | Comprehensive user guide.                        |

## Public surface

- Class `PickerBar extends HTMLElement` (registered as
  `<lily-picker-bar>` on import of `index.ts`; that import also
  registers the four wrapped pickers, transitively).
- Named exports: `PickerBar`, `DEFAULT_THEMES`, `DEFAULT_SIZES`.
- Type exports: `PickerBarProps`, `PickerBarLabels`.

Required attributes/properties: `labels` (property-only), `themes-url`,
`locales`. Full table in
[spec/index.md §4](./spec/index.md#4-public-api).

## Behaviour contract (one paragraph)

`<lily-picker-bar>` renders the four wrapped pickers unmodified,
setting each its own required attributes/properties plus any extras
from that picker's `*Props` bag (`themeProps`, `localeProps`,
`textSizeProps`, `shareProps`), applied via `Object.assign` **after**
the bar's own base values, so a consumer can override anything.
`themes` defaults to `DEFAULT_THEMES` (all 45 reference theme slugs,
alphabetical with the UK/US themes moved to one alphabetical group at
the bottom); `sizes` defaults to `DEFAULT_SIZES` (`largest` …
`smallest`, seven slugs) with the nested `<lily-text-size-picker>`'s
`default-value` set to `"normal"` (its own `"medium"` fallback does
not exist in this seven-slug scale). Every other attribute/property —
persistence, initial value, detection, glyph override — is exactly
the wrapped picker's own contract; see that picker's own `AGENTS.md`.

## HTML

```html
<lily-picker-bar>
  <div class="picker-bar {class}">
    <lily-theme-picker>…</lily-theme-picker>
    <lily-locale-picker>…</lily-locale-picker>
    <lily-text-size-picker>…</lily-text-size-picker>
    <lily-share-picker>…</lily-share-picker>
  </div>
</lily-picker-bar>
```

No new class hooks — each child keeps its own package's class
contract. `<lily-picker-bar>` contributes only the `picker-bar` root
class.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`<lily-picker-bar>` adds no new interaction. `labels` supplies all
four accessible names; there is no English default (matching
`<lily-date-time-picker>`'s `labels` precedent in this catalog).

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- Depends on the four wrapped pickers as real npm `dependencies` —
  the same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from properties (`labels`, and
  whatever each wrapped picker's own attributes/properties require).

## Two implementation gotchas that cost real debugging time — do not reintroduce either

1. **Side-effect imports of the four wrapped packages must stay bare
   `import "…";` statements**, never `import { ThemePicker } from "…"`
   used only in a type position (`as ThemePicker`). esbuild's TS
   transform elides an import whose binding is never used as a runtime
   value — including its module-level registration side effect — so a
   type-only usage of the class silently drops the
   `customElements.define(...)` call. Import the classes only via
   `import type { ThemePicker, ThemePickerProps } from "…"` for casts;
   trigger registration with a separate bare `import "…";`.
2. **Connect `root` to `this` before appending the four picker
   children into it**, not after. `document.createElement` for each
   nested picker only runs its own render once its `connectedCallback`
   fires, which requires the element to actually be part of the
   connected document tree; jsdom does not reliably fire
   `connectedCallback` recursively for descendants of a subtree that
   is inserted as a whole (build-then-attach). Attach-then-build (this
   package's actual order — see spec §4.4) fires every child's
   `connectedCallback` immediately and works in every environment.

## Local development note

This catalog has no pnpm workspace linking (no `packages:` glob).
`../vitest.config.ts` aliases the four bare package specifiers to each
sibling's already-built `dist/index.js` so tests resolve locally; the
catalog root `tsconfig.json` (new, added for this package) mirrors
that with a `paths` map so `tsup --dts` can type-check the same
imports. Neither is read when this package's own `dist/` is built —
`../package.json`'s `build` script now also derives `--external` flags
from each package's own `package.json` `dependencies` (so tsup does
not try to bundle them), meaning the published `dist/index.js` keeps
the bare imports, which a real install resolves from `node_modules`
via the `dependencies` in `package.json`.
