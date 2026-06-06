# Accessibility

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<theme-picker>` (host)       | none (transparent)         | —             |
| Rendered `<fieldset>`         | `role="radiogroup"`        | Picker        |
| Rendered `<fieldset>`         | `aria-label={label}`       | Consumer attr |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Picker        |

The picker does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no roving tabindex, no manual
focus management — the native radio behaviour is exactly the
WAI-ARIA Authoring Practices pattern.

The host `<theme-picker>` element has no implicit ARIA role. It is
a lifecycle container that holds the rendered fieldset.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus into / out of the group.               |
| `Shift+Tab`        | Move focus backwards out of the group.            |
| `Arrow Down/Right` | Move selection to the next option.                |
| `Arrow Up/Left`    | Move selection to the previous option.            |
| `Space`            | Re-select the focused option (rarely needed).     |
| `Home` / `End`     | Move to first / last option (most browsers).      |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` attribute / `el.value` property.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `theme-labels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The picker does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The picker performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the group as "{label}, radiogroup"
  and each option as "{labelFor(slug)}, radio button, selected /
  not selected".
- NVDA announces "{label} grouping" and each option similarly.
- Selection changes are announced because the underlying control
  state (checked) changes.

## Announcing the theme change

`themechange` is a JS event, not an ARIA live region. If you want a
spoken confirmation of the new theme (e.g. "Theme changed to dark"),
wire a status element yourself:

```html
<div role="status" id="theme-status" aria-live="polite"></div>
<theme-picker label="Theme" themes-url="/t/" themes="light,dark"></theme-picker>
<script type="module">
    const status = document.getElementById("theme-status");
    document.querySelector("theme-picker")
        .addEventListener("themechange", (e) => {
            status.textContent = `Theme changed to ${e.detail.theme}`;
        });
</script>
```

The `role="status"` element politely announces its text on change
without interrupting the user.

## Common mistakes to avoid

- **Setting `role="radiogroup"` on the host element.** The rendered
  fieldset already carries the role. Doubling it produces a double
  announcement.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `theme-labels`.** The picker only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Wrapping the picker in a Shadow DOM.** The picker uses light
  DOM; placing it inside a closed shadow root breaks
  `aria-labelledby` and `aria-controls` references from outside.

## When subclassing

If you subclass `ThemePicker` to render a different visual (swatch
buttons, `<select>` dropdown), the subclass becomes responsible for
the accessibility tree:

- Keep `role="radiogroup"` on the outer container if you keep radios.
- Drop the radio semantics entirely if you switch to buttons; then
  use `aria-pressed` to signal the active state.
- Use a native `<select>` (which carries the combobox role) if you
  switch to a dropdown.

See [custom-rendering.md](./custom-rendering.md) for examples.
