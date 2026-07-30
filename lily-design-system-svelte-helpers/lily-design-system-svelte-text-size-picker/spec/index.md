# TextSizePicker — Specification (Svelte helper)

Canonical contract for `lily-design-system-svelte-text-size-picker`.
The other framework catalogs (react, vue, angular, blazor, html,
nunjucks) port this spec one-to-one.

## 1. Purpose

A headless control that lets a user pick a text size and have the app
remember it. The component owns DOM application + persistence; the
consumer owns the actual typography via CSS keyed on
`[data-text-size="{slug}"]`.

## 2. Scope

In scope: rendering an icon button that opens a WAI-ARIA APG listbox,
resolving the initial value, writing `data-text-size` to a target,
persistence, change events.
Out of scope: the CSS that maps a slug to a `font-size`/scale, picking
default sizes, or any visual styling.

## 3. HTML

`<div class="text-size-picker {class}">` containing a hidden input
(carries `name`), a `<button class="text-size-picker-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls>` whose only content is the `aria-hidden` "A" glyph
(replaceable via `children`), and a `<ul class="text-size-picker-list"
role="listbox" aria-label="{label}" tabindex="-1" hidden>` of
`<li class="text-size-picker-option" role="option" aria-selected>`
entries, one per slug, with `data-active` mirroring the
`aria-activedescendant` cursor.

## 4. Props

| Prop           | Type                     | Required | Default       |
| -------------- | ------------------------ | -------- | ------------- |
| `label`        | `string`                 | yes      | —             |
| `sizes`        | `string[]`               | yes      | —             |
| `value`        | `string`                 | no       | `""`          |
| `defaultValue` | `string`                 | no       | —             |
| `storageKey`   | `string`                 | no       | —             |
| `name`         | `string`                 | no       | `"text-size"` |
| `target`       | `HTMLElement \| null`    | no       | `<html>`      |
| `sizeLabels`   | `Record<string,string>`  | no       | `{}`          |
| `onChange`     | `(size: string) => void` | no       | —             |
| `class`        | `string`                 | no       | `""`          |

## 5. Behaviour

On apply: set `data-text-size="{slug}"` on `target`; if `storageKey`,
write to `localStorage`; call `onChange(slug)`. Initial value resolves
`value` > storage > `defaultValue` > `"medium"` (if present) >
`sizes[0]`. SSR-safe (DOM writes guarded / inside effects).

`labelFor(slug)` returns `sizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`). The word
"default" is never emitted.

Opening an empty list activates no option, so `aria-activedescendant`
is absent rather than pointing at an id that does not exist.

## 6. Accessibility

WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text). WAI-ARIA
APG listbox pattern: focus moves to the list, the cursor is
`aria-activedescendant`, arrows clamp, `Home` / `End` jump, `PageUp` /
`PageDown` move by ten (clamped), printable characters typeahead over
the labels (a single character advances to the next match and repeats
cycle; a multi-character buffer refines from the active option),
`Enter` / `Space` select and return focus to the button, `Escape`
closes without changing the value. `Tab` closes — after moving focus
to the button, without cancelling the key, so the browser's default
Tab proceeds from the picker's position instead of restarting from
`<body>` when the focused list is hidden.

## 7. Acceptance criteria

- §7.1 Renders an icon button (`aria-haspopup="listbox"`,
  `aria-expanded`, `aria-controls`) and a `role="listbox"` list.
- §7.2 `aria-label` names both the button and the listbox.
- §7.3 One `role="option"` per size; the hidden input carries `name`.
- §7.4 The selected option is `aria-selected`; the cursor is
  `aria-activedescendant`, mirrored to `data-active`.
- §7.5 Default labels title-case the slug; `sizeLabels` overrides.
- §7.6 Initial value defaults to `"medium"` if present, else `sizes[0]`.
- §7.7 Applies `data-text-size` to `document.documentElement`.
- §7.8 Selecting an option updates `data-text-size` and fires `onChange`.
- §7.9 Persists to `localStorage` and re-reads on a fresh mount.
- §7.10 An explicit `value` wins over storage and defaults.
- §7.12 Extra attributes spread onto the root.
- §7.13 Custom `children` rendering receives the size context.
- §7.14 `Tab` from the open list puts focus on the button before
  closing, so the default Tab proceeds from the picker's position.
- §7.15 A repeated typeahead character cycles through its matches;
  a multi-character buffer refines from the active option.
- §7.16 `PageUp` / `PageDown` move the cursor by ten, clamped.
- §7.17 An empty list opens without `aria-activedescendant`.
