# AGENTS — MotionPicker (React helper)

Single source of truth: [spec/index.md](./spec/index.md) (ported from the Svelte
canonical). Read it first; everything below is a fast index.

## What this package is

A reusable React 19 headless motion (reduced-motion) picker. Renders an
icon button that opens a dropdown listbox of motion slugs and applies
the chosen slug to the document root via `data-motion`, with optional
`localStorage` persistence. Its initial value defers to the platform's
`(prefers-reduced-motion: reduce)` media query before falling back to a
fixed default — the one behaviour difference from its
`theme-picker`/`text-size-picker` siblings. Ships no CSS; consumer
styles the `motion-picker` class hook and decides what
`[data-motion="reduce"]` actually suppresses.

## Files

| File                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `spec/index.md`         | Specification-driven contract (canonical, Svelte-sourced). |
| `MotionPicker.tsx`      | Implementation. TypeScript + React 19 hooks.     |
| `MotionPicker.test.tsx` | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`              | Barrel re-export.                                |
| `index.md`              | User guide.                                      |

## Public surface

- Default export: `MotionPicker` component.
- Named exports: `MotionPicker`, `motionName`, `prefersReducedMotion`, `PAUSE_SIGN`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `motions`. Optional `children` is a render prop
that replaces the glyph inside the button and receives
`{ value, open, labelFor }` — it does **not** render the options.

There is deliberately no analogous OS-detection prop for text size or
theme: unlike `prefers-color-scheme` or `navigator.languages`, no
platform signal exposes a preferred text size, but motion *does* have
one (`prefers-reduced-motion`), which is why this picker's default
resolution differs from its siblings'.

## Behaviour contract (one paragraph)

On every motion change the control (1) sets `data-motion="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally
writes the slug to `localStorage[storageKey]`, and (3) calls
`onChange(slug)`. SSR-safe — all DOM writes happen inside `useEffect`.
Initial value resolves from `value` > storage > `defaultValue` >
`(prefers-reduced-motion: reduce)` (mapped to `"reduce"` /
`"no-preference"` when offered) > `motions[0]`. Controlled when `value`
is supplied; otherwise uncontrolled with internal `useState`.

## HTML

```html
<div class="motion-picker {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="motion-picker-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="motion-picker-icon" aria-hidden="true">⏸︎</span>
  </button>
  <ul class="motion-picker-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="motion-picker-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>No Preference</li>
  </ul>
</div>
```

Ids come from `useId`, so they are stable and hydration-safe.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- WAI-ARIA APG listbox pattern: open with `ArrowDown` / `Enter` /
  `Space` (`ArrowUp` opens on the last option), then `ArrowUp` /
  `ArrowDown` (clamping), `Home` / `End`, `PageUp` / `PageDown` (by
  ten, clamped), `Enter` / `Space` to commit, `Escape` to dismiss, and
  printable-character typeahead with a 500 ms buffer. `Tab` closes via
  the button so the default Tab proceeds from the picker's position.
- `aria-label` carries the consumer-supplied accessible name on both
  the button and the listbox.
- Active option is tracked with `aria-activedescendant`, not roving
  focus.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
- Glyph escaped in source (`PAUSE_SIGN`, U+23F8 + U+FE0E) per
  `AGENTS/helpers.md`'s glyph-escaping rule.
