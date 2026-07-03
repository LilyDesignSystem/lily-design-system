# AGENTS — TextSizeSelect (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless text-size select. Renders a native
`<select>` of size slugs and applies the chosen slug to the document
root via `data-text-size`, with optional `localStorage` persistence.
Ships no CSS; consumer styles the `text-size-select` class hook and
maps each `[data-text-size="…"]` slug to real typography.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `TextSizeSelect.tsx`       | Implementation. TypeScript + React 19 hooks.     |
| `TextSizeSelect.test.tsx`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |

## Public surface

- Default export: `TextSizeSelect` component.
- Named exports: `TextSizeSelect`, `titleCaseSize`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `sizes`.

## Behaviour contract (one paragraph)

On every size change the select (1) sets `data-text-size="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally
writes the slug to `localStorage[storageKey]`, and (3) calls
`onChange(slug)`. SSR-safe — all DOM writes happen inside `useEffect`.
Initial value resolves from `value` > storage > `defaultValue` >
`"medium"` (if present) > `sizes[0]`. Controlled when `value` is
supplied; otherwise uncontrolled with internal `useState`.

## HTML

`<select className="text-size-select {className}" aria-label="{label}"
name="{name}">` with one native `<option className="text-size-select-option">`
per slug. Custom rendering via the `children` render prop receiving
`{ sizes, value, setSize, name, labelFor }`; the output is rendered
inside the `<select>`.

## Accessibility

- WCAG 2.2 AAA target; supports 1.4.4 (Resize Text).
- The native `<select>` provides Arrow / Home / End / typeahead.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
