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

## The status region is part of the pattern

The `<select>` always displays its leading placeholder option, and the
client snaps `select.value` back to `""` after every change. This
keeps the control narrow and predictable, but it has a real
accessibility cost: a screen-reader user focusing the combobox hears
the placeholder word ("Theme") as its value, **not** the theme that is
currently active. The active theme is not discoverable from the
control itself.

That cost is real and this page does not claim it away. What it does
claim is where the compensation belongs: **in the pattern, by
default.** Lily targets WCAG 2.2 AAA, so the theme select ships
alongside a status region in the quick start and in
[`../examples/01-basic.njk`](../examples/01-basic.njk). Pair the
control with the region; **opting out is the deliberate choice, not
opting in.**

```njk
{{ themeSelect({
  label: "Theme",
  themesUrl: "/assets/themes/",
  themes: ["light", "dark", "abyss"]
}) }}
<p class="theme-select-status" aria-live="polite"></p>
```

```js
const status = document.querySelector(".theme-select-status");

autoInit({
    onChange(slug) {
        status.textContent =
            translate("Active theme: {name}", { name: labels[slug] });
    },
});
```

Why this shape:

- **Visible, not `sr-only`, by default.** A visible line helps sighted
  users and cognitive accessibility too, and satisfies WCAG 1.4.1
  without relying on the control. The visually-hidden variant is in
  [`./styling.md`](./styling.md) for designs that genuinely cannot
  spare the space — prefer shrinking it over deleting it.
- **`aria-live="polite"` announces mutations only**, so the region is
  silent on first paint and speaks on each subsequent change. That is
  the intended behaviour: no announcement the user did not cause.
- **The announcement text is consumer-supplied and translatable**, so
  this stays i18n-clean. Show the human label
  (`opts.themeLabels[slug]`), not the raw slug.
- **`.theme-select-status`** is the class hook, kebab-case like the
  rest of the system. See [`./styling.md`](./styling.md).

What this does *not* fix: focusing the closed combobox still announces
the placeholder word. The status region tells the user what is active;
it does not make the control self-describing.

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
