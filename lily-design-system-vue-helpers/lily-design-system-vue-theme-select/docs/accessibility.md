# Accessibility

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries the WAI-ARIA `combobox` semantics for free.

## Roles and properties

| Element        | Role / Property            | Source        |
| -------------- | -------------------------- | ------------- |
| `<select>`     | implicit `role="combobox"` | Browser       |
| `<select>`     | `aria-label={label}`       | Consumer prop |
| `<select>`     | `name`                     | Select        |
| `<option>`     | implicit `role="option"`   | Browser       |
| `<option>`     | selected state (implicit)  | Browser       |

The select does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly the platform combobox.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                  | Action                                          |
| -------------------- | ----------------------------------------------- |
| `Tab`                | Move focus to the select (one stop).            |
| `Shift+Tab`          | Move focus away from the select.                |
| `Arrow Down`         | Select the next option.                         |
| `Arrow Up`           | Select the previous option.                     |
| `Home` / `End`       | Select the first / last option.                 |
| Typeahead            | Type characters to jump to a matching option.   |
| `Enter` / `Space`    | Open the option list (platform-dependent).      |
| `Escape`             | Close the option list.                          |

## State signals

The active state is exposed in two independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The `v-model:value` binding in user code.

Note that the `<select>`'s own selected `<option>` is **not** one of
these channels — see the tradeoff below.

## Tradeoff: the closed control does not announce the active theme

The `<select>` always displays its leading placeholder option
(`placeholder ?? label`); after every change the component snaps
`select.value` back to `""`. This keeps the control narrow and
predictable, but it has a real accessibility cost: **a screen-reader
user no longer hears the active theme announced as the combobox
value.** VoiceOver and NVDA read the placeholder word ("Theme"),
not "Dark".

If knowing the current theme matters in your interface, surface it
yourself. Two recommended patterns:

Visible text next to the control:

```vue
<ThemeSelect v-model:value="theme" label="Theme" ... />
<p>Current theme: {{ themeLabels[theme] ?? theme }}</p>
```

Or a polite live region, which announces the change without moving
focus:

```vue
<ThemeSelect v-model:value="theme" label="Theme" ... />
<p role="status" aria-live="polite">
    Theme changed to {{ themeLabels[theme] ?? theme }}
</p>
```

Both strings are consumer-supplied, so they localise with the rest
of your copy.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily™ themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up
  button" and each option as "{labelFor(slug)}, N of M".
- NVDA announces "{label} combo box" and each option similarly.
- The announced *value* of the closed control is always the
  placeholder text, never the active theme — by design, per the
  tradeoff above. Pair the select with visible text or a polite live
  region when the active theme needs to be announced.

## Common mistakes to avoid

- **Replacing the `<select>` with a div in custom-rendering.** The
  default slot renders inside the `<select>`; don't wrap a div
  around the select if you need combobox semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `inheritAttrs: false` on a wrapping component.** Don't
  break the attribute fall-through; consumers rely on it for
  `data-testid`, `id`, and event handlers.

---

Lily™ and Lily Design System™ are trademarks.
