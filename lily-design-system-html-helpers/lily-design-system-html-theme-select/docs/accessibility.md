# Accessibility

The select targets WCAG 2.2 AAA and uses a native `<select>`, which
maps to the platform combobox (Listbox / Combobox) model.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<theme-select>` (host)       | none (transparent)         | —             |
| Rendered `<select>`           | implicit `role="combobox"` | Browser       |
| Rendered `<select>`           | `aria-label={label}`       | Consumer attr |
| Rendered `<select>`           | `name`                     | Select        |
| `<option>`                    | implicit `role="option"`   | Browser       |
| `<option>`                    | selected state (implicit)  | Browser       |

The select does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly the platform combobox.

The host `<theme-select>` element has no implicit ARIA role. It is
a lifecycle container that holds the rendered `<select>`.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                 | Action                                           |
| ------------------- | ------------------------------------------------ |
| `Tab`               | Move focus onto the control.                     |
| `Shift+Tab`         | Move focus backwards off the control.            |
| `Arrow Down`        | Change selection to the next option.             |
| `Arrow Up`          | Change selection to the previous option.         |
| `Home` / `End`      | Select the first / last option.                  |
| typeahead           | Jump to the option matching typed characters.    |
| `Enter` / `Space`   | Open the option list (where the platform pops it up). |
| `Escape`            | Close the option list.                           |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` in the `<select>`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` attribute / `el.value` property.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `theme-labels` entries are consumer-supplied; localise the values.
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
  button" and each option as "{labelFor(slug)}, selected / not
  selected".
- NVDA announces "{label} combo box" and the current option.
- Selection changes are announced because the underlying control
  state (the selected option) changes.

## Tradeoff: the placeholder hides the active theme

The `<select>` keeps its own selection pinned to the leading
placeholder option, so the closed control always reads
`placeholder ?? label` — "Theme" — rather than the active theme
name. This keeps the control narrow, but it costs something real:

**A screen-reader user no longer hears the active theme announced
as the combobox value.** Where a sighted user sees no visual
regression (they were reading the label anyway), an assistive-
technology user loses the one place the current selection was
previously spoken. The same applies to the visual state: nothing in
the control itself now indicates which theme is active.

If the active theme matters to your users, surface it elsewhere:

- Render it as visible text next to the select (which also serves
  sighted users), or
- Announce it through a polite live region on change (see the next
  section), or
- Both — a `role="status"` element whose text is the active theme
  covers both audiences with one node.

The element still writes `data-theme` on the target, so the active
theme remains observable to CSS and to your own scripts.

## Announcing the theme change

`themechange` is a JS event, not an ARIA live region. If you want a
spoken confirmation of the new theme (e.g. "Theme changed to dark"),
wire a status element yourself:

```html
<div role="status" id="theme-status" aria-live="polite"></div>
<theme-select label="Theme" themes-url="/t/" themes="light,dark"></theme-select>
<script type="module">
    const status = document.getElementById("theme-status");
    document.querySelector("theme-select")
        .addEventListener("themechange", (e) => {
            status.textContent = `Theme changed to ${e.detail.theme}`;
        });
</script>
```

The `role="status"` element politely announces its text on change
without interrupting the user.

## Common mistakes to avoid

- **Adding a redundant `role` on the host element.** The rendered
  `<select>` already carries the combobox role. Overriding it
  produces confusing announcements.
- **Hiding the `<option>` elements with `display: none`.** That
  removes them from the accessibility tree. Keep the native
  `<select>` intact; if you need a different visual, subclass and
  own your own a11y contract.
- **Forgetting to translate `theme-labels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Wrapping the select in a Shadow DOM.** The select uses light
  DOM; placing it inside a closed shadow root breaks
  `aria-labelledby` and `aria-controls` references from outside.

## When subclassing

If you subclass `ThemeSelect` to render a different visual (swatch
buttons, a segmented control), the subclass becomes responsible for
the accessibility tree:

- Keep the native `<select>` if you only need to restyle it; its
  combobox role and keyboard contract come for free.
- If you switch to buttons, wrap them in a `role="group"` container
  with an `aria-label` and use `aria-pressed` to signal the active
  state.

See [custom-rendering.md](./custom-rendering.md) for examples.

---

Lily™ and Lily Design System™ are trademarks.
