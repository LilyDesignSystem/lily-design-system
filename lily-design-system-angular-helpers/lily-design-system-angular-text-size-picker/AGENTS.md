# AGENTS — TextSizeChooser (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless text-size chooser. The control is an
icon button that opens a WAI-ARIA APG listbox — not a native
`<select>` — so the component owns the roles, focus moves, and the
whole keyboard contract itself. It applies the chosen size to the
document root via `data-text-size`, with optional `localStorage`
persistence. Ships no CSS; consumer styles the `text-size-chooser`
class hooks, supplies the listbox positioning, and maps each
`[data-text-size="…"]` slug to real typography.

## Files

| File                                   | Purpose                                          |
| -------------------------------------- | ------------------------------------------------ |
| `spec/index.md`                        | Specification-driven contract (canonical).       |
| `text-size-chooser.component.ts`        | Implementation. Standalone, signal-based, OnPush.|
| `text-size-chooser.component.spec.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `docs/accessibility.md`                | Roles, keyboard contract, and the tradeoffs.     |
| `index.ts`                             | Barrel re-export.                                |
| `index.md`                             | User guide.                                      |

## Public surface

- `TextSizeChooser` (component class, selector `lily-text-size-chooser`).
- `TextSizeChooserIcon` (optional marker directive,
  `ng-template[lilyTextSizeChooserIcon]`, for typed `let-` variables).
- `LATIN_CAPITAL_LETTER_A` (the default glyph, `"A"` U+0041).
- `nextTextSizeChooserId` (per-instance id generator).
- `sizeName` (pure label resolver).
- `ChildArgs` (type).

Required inputs: `label`, `sizes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every size change the control (1) sets
`data-text-size="{slug}"` on `target` (defaults to
`document.documentElement`), (2) optionally writes the slug to
`localStorage[storageKey]`, and (3) emits `sizeChange(slug)`. SSR-safe
— all DOM writes guard on `typeof document`. Initial value resolves
from `value` > storage > `defaultValue` > `"medium"` (if present) >
`sizes[0]`. `value` is the single source of truth; the hidden input
mirrors it for form participation. There is deliberately **no**
`detectFromSystem` counterpart to theme-chooser's — no OS "preferred
text size" media query exists.

## HTML

```html
<div class="text-size-chooser {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="text-size-chooser-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-chooser-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-chooser-list" id="{listId}" role="listbox" aria-label="{label}"
      tabindex="-1" hidden aria-activedescendant="{optionId, only while open}">
    <li class="text-size-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Medium</li>
  </ul>
</div>
```

`@for` is used (not `*ngFor`). Ids come from `nextTextSizeChooserId()`,
an incrementing module counter — stable, unique per instance,
SSR-safe. A projected `<ng-template>` (queried via
`contentChild(TemplateRef)`) replaces the glyph inside the button and
receives `ChildArgs` (`{ $implicit, value, open, labelFor }`); it does
**not** render options.

The glyph is `"A"` (U+0041), not a pictograph: U+1F5DB DECREASE FONT
SIZE SYMBOL has no real glyph in common font stacks and means
*decrease* rather than *size*.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) and
  1.4.12 (Text Spacing) — that is this helper's specific purpose.
- Custom APG listbox: the component owns roles, `aria-expanded`,
  `aria-activedescendant`, focus moves, and every key. Nothing is
  inherited from a native control. See
  [spec/index.md §6.2](./spec/index.md#62-keyboard-contract) and
  [docs/accessibility.md](./docs/accessibility.md).
- Button keys: `ArrowDown` / `Enter` / `Space` open on the selected
  option; `ArrowUp` opens on the last. Listbox keys: `ArrowDown` /
  `ArrowUp` (clamped, no wrap), `Home` / `End`, `Enter` / `Space` to
  select and refocus the button, `Escape` to dismiss unchanged, `Tab`
  to close without stealing focus, printable chars for a 500 ms
  typeahead over labels.
- The button is icon-only, so `aria-label` is its **entire**
  accessible name — a poor label makes the control unusable.
- Option labels default to title-cased slugs via the exported
  `sizeName`.

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow.
- No template casts are needed here — the component handles
  `(click)` / `(keydown)` with typed handler methods rather than
  reading `$event.target` inline. (The catalog's
  `$any($event.target).value` rule still applies to helpers that do
  bind a native input's value.)
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.
