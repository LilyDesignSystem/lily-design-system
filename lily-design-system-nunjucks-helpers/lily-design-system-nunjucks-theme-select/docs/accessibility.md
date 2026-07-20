# Accessibility

The select targets WCAG 2.2 AAA using a native HTML `<select>`.

## Roles and properties

| Element        | Role / Property               | Source        |
| -------------- | ----------------------------- | ------------- |
| `<select>`     | implicit `role="combobox"`    | Browser       |
| `<select>`     | `aria-label="{label}"`        | `opts.label`  |
| `<select>`     | `name`                        | Macro         |
| `<option>`     | implicit `role="option"`      | Browser       |
| `<option>`     | selected state (implicit)     | Browser       |

The macro does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly what assistive technology
expects.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus to the select (one stop).              |
| `Shift+Tab`        | Move focus away from the select.                  |
| `Arrow Down`       | Select the next option.                           |
| `Arrow Up`         | Select the previous option.                       |
| `Home` / `End`     | Select the first / last option.                   |
| Typeahead          | Type characters to jump to a matching option.     |
| `Enter` / `Space`  | Open the option list (platform-dependent).        |
| `Escape`           | Close the option list.                            |

## State signals

The active state is exposed in two independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The managed `<link>`'s `href` attribute.

Note that the `<select>`'s own selected `<option>` is deliberately
**not** one of these channels — see below.

## Tradeoff: the control does not announce the active theme

The `<select>` always displays its leading placeholder option, and the
client snaps `select.value` back to `""` after every change. This
keeps the control narrow and predictable, but it has a real
accessibility cost: a screen-reader user focusing the combobox hears
the placeholder word ("Theme") as its value, **not** the theme that is
currently active. The active theme is no longer discoverable from the
control itself.

Where knowing the active theme matters, surface it elsewhere:

- Render the active theme as visible text next to the control (this
  also helps sighted users, and satisfies WCAG 1.4.1 without relying
  on the control).
- Announce changes from a polite live region the consumer owns:

  ```html
  <p aria-live="polite" id="theme-status"></p>
  ```

  ```js
  initThemeSelect(root, {
      onChange: (slug) => {
          document.getElementById("theme-status").textContent =
              translate("Theme changed to {name}", { name: labels[slug] });
      },
  });
  ```

  The announcement text is consumer-supplied and translatable, so this
  stays i18n-clean.

## Internationalisation

- `opts.label` is consumer-supplied; pass a translated string.
- `opts.placeholder` is consumer-supplied and defaults to `label`, so
  the always-visible placeholder word is never a hardcoded English
  string.
- `opts.themeLabels` entries are consumer-supplied; localise the
  values.
- The macro never emits hardcoded natural-language strings,
  including the word "default".

## Visible focus

The helper does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring.
NHS-UK and Lily™ themes ship a high-contrast focus outline that
meets AAA.

## Reduced motion

The helper performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up
  button" and each option as "{labelFor(slug)}, selected / not
  selected".
- NVDA announces "{label} combo box" and each option similarly.
- Selection changes are announced because the underlying control
  value changes.

## Common mistakes to avoid

- **Replacing the select with a div in the caller block.** The
  `{% call %}` block renders inside the select root; do not wrap a
  div *around* the macro invocation if you need the control
  semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `opts.themeLabels`.** The macro only
  knows what the consumer tells it; locale-aware copy is the
  consumer's responsibility.
- **Emitting `<script>` from the macro.** Forbidden. CSP
  `script-src` policies that forbid inline scripts must continue
  to work.

---

Lily™ and Lily Design System™ are trademarks.
