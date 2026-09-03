# AGENTS — MotionPicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless motion (reduced-motion) picker. Renders an
icon button (pause sign) opening a WAI-ARIA APG listbox of motion
slugs and applies the chosen slug to the document root via
`data-motion`, with optional `localStorage` persistence. Its initial
value defers to the platform's `(prefers-reduced-motion: reduce)`
media query before falling back to a fixed default — the one behaviour
difference from its `theme-picker`/`text-size-picker` siblings.
Ships no CSS; consumer styles the `motion-picker` class hook and
decides what `[data-motion="reduce"]` actually suppresses.

## Files

| File                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `spec/index.md`         | Specification-driven contract (canonical).       |
| `MotionPicker.svelte`   | Implementation. TypeScript + Svelte 5 runes.     |
| `MotionPicker.test.ts`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`              | Barrel re-export.                                |
| `index.md`              | User guide.                                      |

## Public surface

- Default export: `MotionPicker` component.
- Named export: `MotionPicker`.
- Type exports: `Props`, `ChildArgs`.
- Helper exports: `motionName`, `prefersReducedMotion`, `PAUSE_SIGN`.

Required props: `label`, `motions`.

## Behaviour contract (one paragraph)

On every motion change the control (1) sets `data-motion="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally
writes the slug to `localStorage[storageKey]`, and (3) calls
`onChange(slug)`. SSR-safe — all DOM writes happen inside `$effect`.
Initial value resolves from `value` > storage > `defaultValue` >
`(prefers-reduced-motion: reduce)` (mapped to `"reduce"` /
`"no-preference"` when offered) > `motions[0]`.

## HTML

`<div class="motion-picker {class}">` containing a hidden input, a
`<button class="motion-picker-button" aria-label="{label}"
aria-haspopup="listbox" aria-expanded aria-controls>` whose only
content is the `aria-hidden` pause-sign glyph (replaceable via
`children`), and a `<ul class="motion-picker-list" role="listbox">` of
`<li class="motion-picker-option" role="option">` entries.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- APG listbox keyboard contract: arrows (clamped), Home / End,
  PageUp / PageDown (by ten), typeahead with same-character cycling,
  Escape discards. Tab closes via the button so the default Tab
  proceeds from the picker's position.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$effect`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
- Glyph escaped in source (`PAUSE_SIGN`, U+23F8 + U+FE0E) per
  `AGENTS/helpers.md`'s glyph-escaping rule.
