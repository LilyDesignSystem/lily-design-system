# Accessibility

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Picker        |
| `<fieldset>`                  | `aria-label={label}`       | Consumer prop |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Picker        |

The picker does not add ARIA where native semantics already cover the
need. There is no `aria-pressed`, no roving tabindex, no manual focus
management — the native radio behaviour is exactly the WAI-ARIA
Authoring Practices pattern.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key             | Action                                            |
| --------------- | ------------------------------------------------- |
| `Tab`           | Move focus into / out of the group.               |
| `Shift+Tab`     | Move focus backwards out of the group.            |
| `Arrow Down/Right` | Move selection to the next option.             |
| `Arrow Up/Left` | Move selection to the previous option.            |
| `Space`         | Re-select the focused option (rarely needed).     |
| `Home` / `End`  | Move to first / last option (most browsers).      |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio (implicit).
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The controlled `value` prop in user code.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The picker does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring. NHS-UK and
Lily themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The picker performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the group as "{label}, radiogroup" and
  each option as "{labelFor(slug)}, radio button, selected / not
  selected".
- NVDA announces "{label} grouping" and each option similarly.
- Selection changes are announced because the underlying control
  state (checked) changes.

## React 19 specifics

- The picker file is a client component (`"use client"`). The
  consumer file importing the picker must also be a client component
  if it manages controlled state with `useState`.
- React 19's StrictMode double-invokes effects. The picker's
  `initialisedRef` guards against double-application; tests should
  cover the StrictMode path.

## Common mistakes to avoid

- **Replacing the fieldset with a div in custom-rendering.** The
  `children` render prop renders inside the fieldset; do not wrap a
  div *around* the picker if you need group semantics.
- **Hiding the radio inputs with `display: none`.** That removes them
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The picker only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `outline: none` in CSS.** Visible focus is a WCAG AAA
  requirement; the picker preserves the browser default. Don't strip
  it.

## References

- WAI-ARIA APG — Radio Group pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- MDN — `<fieldset>` element:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset>
- MDN — `<input type="radio">`:
  <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio>
