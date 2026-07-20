# AGENTS — TextSizeSelect (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless text-size select. Renders an icon button
that opens a dropdown listbox of size slugs and applies the chosen slug
to the document root via `data-text-size`, with optional `localStorage`
persistence. Ships no CSS; consumer styles the `text-size-select` class
hook and maps each `[data-text-size="…"]` slug to real typography.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`            | Specification-driven contract (canonical).       |
| `TextSizeSelect.tsx`       | Implementation. TypeScript + React 19 hooks.     |
| `TextSizeSelect.test.tsx`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |
| `docs/accessibility.md`    | Roles, keyboard contract, and the tradeoffs.     |

## Public surface

- Default export: `TextSizeSelect` component.
- Named exports: `TextSizeSelect`, `sizeName`, `LATIN_CAPITAL_LETTER_A`.
- Type exports: `Props`, `ChildArgs`.
- `sizeName(slug)` is the single implementation of the title-casing
  label rule (`"x-large"` → `"X Large"`); the internal `labelFor`
  delegates to it, and it mirrors `themeName` in theme-select and
  `localeName` in locale-select. Consumers should use it instead of
  re-deriving labels. It replaced the old `titleCaseSize` export.
- `LATIN_CAPITAL_LETTER_A` is the default glyph (U+0041).

Required props: `label`, `sizes`. Optional `children` is a render prop
that replaces the glyph inside the button and receives
`{ value, open, labelFor }` — it does **not** render the options. Full
table in [spec/index.md §4.1](./spec/index.md#41-props).

There is deliberately no detection prop: unlike `prefers-color-scheme`
or `navigator.languages`, no platform signal exposes a preferred text
size.

## Behaviour contract (one paragraph)

On every size change the control (1) sets `data-text-size="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally writes
the slug to `localStorage[storageKey]`, and (3) calls `onChange(slug)`.
SSR-safe — all DOM writes happen inside `useEffect`. Initial value
resolves from `value` > storage > `defaultValue` > `"medium"` (if
present) > `sizes[0]`. Controlled when `value` is supplied; otherwise
uncontrolled with internal `useState`. The control is an icon button
that opens a listbox; the component owns the open/close state, the
active-option state, and the whole keyboard contract, and it returns
focus to the button when a selection or `Escape` closes the list.

## HTML

```html
<div class="text-size-select {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="text-size-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-select-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="text-size-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Medium</li>
  </ul>
</div>
```

Ids come from `useId`, so they are stable and hydration-safe. Custom
rendering via the `children` render prop receiving
`{ value, open, labelFor }` replaces the glyph inside the button only —
the component owns the options.

## Accessibility

- WCAG 2.2 AAA target; this helper is the one that most directly serves
  1.4.4 (Resize Text) and 1.4.12 (Text Spacing).
- WAI-ARIA APG listbox pattern. The component implements the keyboard
  contract itself: open with `ArrowDown` / `Enter` / `Space` (`ArrowUp`
  opens on the last option), then `ArrowUp` / `ArrowDown` (clamping),
  `Home` / `End`, `Enter` / `Space` to commit, `Escape` to dismiss,
  `Tab` to move on, and printable-character typeahead with a 500 ms
  buffer.
- `aria-label` carries the consumer-supplied accessible name on both the
  button and the listbox. The glyph is `aria-hidden`, so `label` is the
  only source of the accessible name.
- Active option is tracked with `aria-activedescendant`, not roving focus.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- The glyph is `"A"` rather than a pictograph: U+1F5DB has no real glyph
  in common font stacks and means *decrease* rather than *size*.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
