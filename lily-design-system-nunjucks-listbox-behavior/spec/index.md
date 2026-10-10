# ListboxBehavior — Specification (Nunjucks helper)

Canonical contract for `@lilydesignsystem/nunjucks-listbox-behavior`.
Shared behaviour for the Nunjucks `*-picker` helpers; see
[spec/helpers/index.md](../../spec/helpers/index.md) for the picker
contracts it serves.

## 1. Purpose

One implementation of the WAI-ARIA APG listbox keyboard contract in its
active-descendant form, shared by the Nunjucks preference pickers
(theme, locale, text-size, motion) and the kanban-board move menu, so the
contract cannot drift between copies.

## 2. API

`createListboxKeyboard(list, config)` attaches a `keydown` listener to
`list` (the rendered `<ul role="listbox">`, or any container holding
`[role="option"]` children) and returns a controller with `setActive`
and `destroy`. `config`: `clamp` (boolean), `typeahead` (boolean),
`pageSize` (number), `onActivate(index)`, `onEscape()`, `onTabOut()`.
Options are read live on every call.

## 3. Acceptance criteria

- §3.1 ArrowDown/ArrowUp move the cursor, clamping at the ends when
  `clamp` is set and wrapping when it is not.
- §3.2 Home/End jump to the first/last option.
- §3.3 `setActive` sets `data-active` on the active option and clears it
  on every other option, and points `aria-activedescendant` at it.
- §3.4 Enter/Space call `onActivate` with the active index.
- §3.5 Escape calls `onEscape`.
- §3.6 Tab calls `onTabOut` and is not prevented, so focus moves on.
- §3.7 With `typeahead`, a printable character moves to the next option
  whose text starts with it; without it, printable characters do nothing.
- §3.8 PageDown/PageUp move by `pageSize`, clamped.
- §3.9 `destroy` removes the keydown listener.
- §3.10 It never sets `aria-selected`; only `data-active` and
  `aria-activedescendant` change.

## 4. Non-goals

Markup, CSS, selection state, persistence, and user-facing strings: the
picker that uses this behaviour owns all of them.
