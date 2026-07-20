# Accessibility

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries the platform combobox semantics for free.

## Roles and properties

| Element        | Role / Property            | Source        |
| -------------- | -------------------------- | ------------- |
| `<select>`     | implicit `role="combobox"` | Browser       |
| `<select>`     | `aria-label={label}`       | Consumer prop |
| `<select>`     | `name`                     | Select        |
| `<option>`     | implicit `role="option"`   | Browser       |
| `<option>`     | selected state (implicit)  | Browser       |

The select does not add ARIA where native semantics already cover the
need. There is no `aria-pressed`, no manual focus management — the
native `<select>` behaviour is exactly the platform combobox.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                  | Action                                            |
| -------------------- | ------------------------------------------------- |
| `Tab`                | Move focus to the select.                         |
| `Shift+Tab`          | Move focus away from the select.                  |
| `Arrow Down`         | Select the next option.                           |
| `Arrow Up`           | Select the previous option.                       |
| `Home` / `End`       | Select the first / last option.                   |
| Typeahead            | Type characters to jump to a matching option.     |
| `Enter` / `Space`    | Open the option list (platform-dependent).        |
| `Escape`             | Close the option list.                            |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` in the `<select>`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The bindable `value` prop in user code.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring. NHS-UK and
Lily™ themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap.

## The placeholder tradeoff

The closed control always displays the placeholder option
(`placeholder ?? label`, e.g. "Theme") rather than the active theme
name, so that it stays as narrow as that one word.

The cost is real and worth stating plainly: **a screen-reader user does
not hear the active theme announced as the combobox value**, and no
option in the open list is marked as the selected one. The control
reads as "Theme, pop-up button, Theme" whichever theme is active.

Where knowing the current theme matters, surface it outside the
control:

```svelte
<ThemeSelect label="Theme" {themesUrl} {themes} bind:value onChange={announce} />
<p aria-live="polite">{`Active theme: ${value}`}</p>
```

or render visible text next to the select. The `value` prop is always
the active theme, so either is a few lines.

If your context needs the standard announce-the-selection behaviour
more than it needs the narrow control, use the `children` snippet to
render your own options and omit the placeholder — but note the
component still pins its own selection to the placeholder, so you would
be better served by the plain headless `ThemeSelect` container in
`lily-design-system-svelte-headless`.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up button"
  and the placeholder as the current value.
- NVDA announces "{label} combo box" similarly.
- Selection changes are **not** announced via the control's value — see
  the tradeoff above.

## Common mistakes to avoid

- **Replacing the `<select>` with a div in custom-rendering.** The
  `children` snippet renders inside the `<select>`; do not wrap a div
  *around* the select if you need combobox semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.

---

Lily™ and Lily Design System™ are trademarks.
