# Accessibility

The select targets WCAG 2.2 AAA and uses the platform's native
`<select>` combobox, so the keyboard, focus, and selection semantics
come from the browser.

## Roles and properties

| Element        | Role / Property         | Source        |
| -------------- | ----------------------- | ------------- |
| `<select>`     | implicit `role="combobox"` | Browser    |
| `<select>`     | `aria-label={label}`    | Consumer prop |
| `<option>`     | implicit `role="option"` | Browser      |
| `<option>`     | implicit selected state | Browser       |

The select does not add ARIA where native semantics already cover the
need. There is no `aria-pressed`, no manual focus management — the
native `<select>` behaviour is the accessible baseline. The accessible
name of the control comes from `aria-label` on the `<select>`.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                  | Action                                        |
| -------------------- | --------------------------------------------- |
| `Tab` / `Shift+Tab`  | Move focus to / from the select (one tab stop). |
| `Arrow Down`         | Select the next option.                       |
| `Arrow Up`           | Select the previous option.                   |
| `Home` / `End`       | Select the first / last option.               |
| Typeahead            | Type characters to jump to a matching option. |
| `Enter` / `Space`    | Open the option list (platform-dependent).    |
| `Escape`             | Close the option list.                        |

## State signals

The active state is exposed in two independent channels — no
colour-only meaning is required:

1. The selected `<option>` (the select's `value`).
2. `data-theme="<slug>"` on the target element (default `<html>`).

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring. NHS-UK and
Lily themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up button"
  and each entry as "{labelFor(slug)}, selected / N of M".
- NVDA announces "{label} combo box" and reads the active option.
- Selection changes are announced because the select's value changes.

## React 19 specifics

- The select file is a client component (`"use client"`). The
  consumer file importing the select must also be a client component
  if it manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The select's
  `initialisedRef` guards against double-application; tests should
  cover the StrictMode path.

## Common mistakes to avoid

- **Returning non-`<option>` children from custom-rendering.** The
  `children` render prop renders inside the `<select>`, which only
  accepts `<option>` / `<optgroup>`. Render other controls outside the
  select and call `setTheme`.
- **Removing the `aria-label`.** It is the accessible name of the
  select; without it the control is unnamed.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `outline: none` in CSS.** Visible focus is a WCAG AAA
  requirement; the select preserves the browser default. Don't strip
  it.

## References

- MDN — `<select>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select>
- MDN — `<option>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option>
- WAI-ARIA APG — Combobox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
