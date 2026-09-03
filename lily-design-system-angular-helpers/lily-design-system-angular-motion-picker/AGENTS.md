# AGENTS — MotionPicker (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless motion (reduced-motion) picker. The
control is an icon button that opens a WAI-ARIA APG listbox — not a
native `<select>` — so the component owns the roles, focus moves, and
the whole keyboard contract itself. It applies the chosen motion
preference to the document root via `data-motion`, with optional
`localStorage` persistence. Its initial value defers to the platform's
`(prefers-reduced-motion: reduce)` media query before falling back to
a fixed default — the one behaviour difference from its
`theme-picker`/`text-size-picker` siblings. Ships no CSS; consumer
styles the `motion-picker` class hooks and decides what
`[data-motion="reduce"]` actually suppresses.

## Files

| File                                | Purpose                                           |
| ------------------------------------ | ------------------------------------------------- |
| `spec/index.md`                      | Specification-driven contract (canonical, Svelte-sourced). |
| `motion-picker.component.ts`         | Implementation. Standalone, signal-based, OnPush. |
| `motion-picker.component.spec.ts`    | Vitest spec, one assertion per §7 acceptance.     |
| `index.ts`                           | Barrel re-export.                                 |
| `index.md`                           | User guide.                                       |

## Public surface

- `MotionPicker` (component class, selector `lily-motion-picker`).
- `MotionPickerIcon` (optional marker directive,
  `ng-template[lilyMotionPickerIcon]`, for typed `let-` variables).
- `PAUSE_SIGN` (the default glyph, U+23F8 + U+FE0E).
- `nextMotionPickerId` (per-instance id generator).
- `motionName` (pure label resolver).
- `prefersReducedMotion` (pure OS-preference reader).
- `ChildArgs` (type).

Required inputs: `label`, `motions`.

## Behaviour contract (one paragraph)

On every motion change the control (1) sets `data-motion="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally
writes the slug to `localStorage[storageKey]`, and (3) emits
`motionChange(slug)`. SSR-safe — all DOM writes guard on `typeof
document`. Initial value resolves from `value` > storage >
`defaultValue` > `(prefers-reduced-motion: reduce)` (mapped to
`"reduce"` / `"no-preference"` when offered) > `motions[0]`. `value` is
the single source of truth; the hidden input mirrors it for form
participation.

## HTML

```html
<div class="motion-picker {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button
    type="button"
    class="motion-picker-button"
    aria-label="{label}"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="{listId}"
  >
    <span class="motion-picker-icon" aria-hidden="true">&#9208;&#65038;</span>
  </button>
  <ul
    class="motion-picker-list"
    id="{listId}"
    role="listbox"
    aria-label="{label}"
    tabindex="-1"
    hidden
    aria-activedescendant="{optionId, only while open}"
  >
    <li
      class="motion-picker-option"
      id="{optionId}"
      role="option"
      aria-selected="true|false"
      data-active
    >
      No Preference
    </li>
  </ul>
</div>
```

`@for` is used (not `*ngFor`). Ids come from `nextMotionPickerId()`,
an incrementing module counter — stable, unique per instance,
SSR-safe. A projected `<ng-template>` (queried via
`contentChild(TemplateRef)`) replaces the glyph inside the button and
receives `ChildArgs` (`{ $implicit, value, open, labelFor }`); it does
**not** render options.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions) — that is this helper's specific purpose.
- Custom APG listbox: the component owns roles, `aria-expanded`,
  `aria-activedescendant`, focus moves, and every key. Nothing is
  inherited from a native control.
- Button keys: `ArrowDown` / `Enter` / `Space` open on the selected
  option; `ArrowUp` opens on the last. Listbox keys: `ArrowDown` /
  `ArrowUp` (clamped, no wrap), `Home` / `End`, `PageUp` / `PageDown`
  (by ten, clamped), `Enter` / `Space` to select and refocus the
  button, `Escape` to dismiss unchanged, `Tab` to close via the button
  so the default Tab proceeds from the picker's position, printable
  chars for a 500 ms typeahead over labels with APG same-character
  cycling.
- The button is icon-only, so `aria-label` is its **entire**
  accessible name.
- Option labels default to title-cased slugs via the exported
  `motionName`.

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.
- Glyph escaped in source (`PAUSE_SIGN`, U+23F8 + U+FE0E) per
  `AGENTS/helpers.md`'s glyph-escaping rule.
