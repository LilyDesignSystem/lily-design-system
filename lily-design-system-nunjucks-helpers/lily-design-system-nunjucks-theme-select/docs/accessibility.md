# Accessibility

The control targets WCAG 2.2 AAA using an icon `<button>` that opens a
`<ul role="listbox">`, following the WAI-ARIA Authoring Practices
listbox pattern.

This page states the tradeoffs of that choice plainly. The helper used
to render a native `<select>`; it no longer does, and the difference is
not free.

## Roles and properties

| Element             | Role / Property                     | Source           |
| ------------------- | ----------------------------------- | ---------------- |
| `<div>` root        | none (a plain container)            | Macro            |
| `<button>`          | implicit `role="button"`            | Browser          |
| `<button>`          | `aria-label="{label}"`              | `opts.label`     |
| `<button>`          | `aria-haspopup="listbox"`           | Macro            |
| `<button>`          | `aria-expanded="true|false"`        | Macro + client   |
| `<button>`          | `aria-controls="{id}-list"`         | Macro            |
| `<span>` glyph      | `aria-hidden="true"`                | Macro            |
| `<ul>`              | `role="listbox"`                    | Macro            |
| `<ul>`              | `aria-label="{label}"`              | `opts.label`     |
| `<ul>`              | `aria-activedescendant="{optionId}"`| Client, while open |
| `<li>`              | `role="option"`                     | Macro            |
| `<li>`              | `aria-selected="true|false"`        | Macro + client   |
| `<input type=hidden>` | `name`                            | Macro            |

The active option is conveyed with `aria-activedescendant` on the
focused `<ul>`; DOM focus stays on the `<ul>` and never moves to an
individual `<li>`. That is the APG listbox pattern.

`aria-selected` tracks the **applied** theme, not the merely-active
option. Arrowing through the list changes `aria-activedescendant` and
`data-active`; nothing becomes selected until the user commits with
`Enter`, `Space`, or a click.

## Keyboard contract

Owned entirely by `theme-select.client.js`. Nothing below works before
that module runs — see [`./ssr.md`](./ssr.md).

On the **button**:

| Key                          | Action                                                   |
| ---------------------------- | -------------------------------------------------------- |
| `Tab` / `Shift+Tab`          | Move focus to / away from the button (one stop).          |
| `ArrowDown`, `Enter`, `Space`| Open, with the selected theme active. Focus moves to the list. |
| `ArrowUp`                    | Open, with the LAST option active.                        |

On the **listbox**:

| Key                | Action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends; no wrapping. |
| `Home` / `End`     | Jump to the first / last option.                              |
| `Enter` / `Space`  | Select the active option, apply it, close, return focus.      |
| `Escape`           | Close and return focus, leaving the theme unchanged.          |
| `Tab`              | Close without stealing focus back.                            |
| Printable character| Typeahead over the option labels; 500 ms buffer reset.        |

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the theme.

## The three tradeoffs of an icon button and a custom listbox

These are real costs. None of them is a bug to be fixed later; they are
consequences of the control shape.

### 1. The accessible name rests entirely on `aria-label`

The glyph is `aria-hidden="true"`, so it contributes nothing to the
accessible name. There is no visible label, no `<label>` element, and
no option text to fall back on while the listbox is closed. If
`opts.label` is missing, vague, or untranslated, the control is
effectively unnamed for screen-reader and voice-control users — a
straight WCAG 4.1.2 failure with no partial credit.

Voice control deserves specific mention: users of Voice Control and
Voice Access say the visible name of a control. An icon-only button has
none, so `aria-label` is also the *spoken* target. Keep it short,
literal, and matched to what a user would plausibly call it ("Theme",
not "Appearance preference selector").

### 2. A custom listbox has weaker AT support than a native `<select>`

A native `<select>` is implemented by the platform. It gets the OS
picker on mobile, correct virtual-cursor behaviour in every screen
reader, and years of bug-for-bug compatibility work. A `<ul
role="listbox">` driven by `aria-activedescendant` is a reimplementation,
and support for it is good but not uniform — browse-mode quirks,
inconsistent announcement of `aria-selected`, and mobile screen readers
that handle `aria-activedescendant` less reliably than real focus are
all documented in the wild.

If your audience is broad or the theme choice is load-bearing, test
with the assistive technology your users actually run. If no-JS or
maximal AT compatibility is a hard requirement, prefer the headless
catalog's plain `theme-select` `<select>` container over this helper.

### 3. The glyph may not render

U+25D1 CIRCLE WITH RIGHT HALF BLACK is a Unicode character rendered
with whatever font the consumer's CSS resolves. On platforms whose font
stack lacks the glyph it degrades to a tofu box, and its weight,
baseline, and optical size vary by platform. It may also be re-coloured
or hidden entirely by a user stylesheet or forced-colors mode.

Because the glyph is decorative and `aria-hidden`, a missing glyph is
never an accessibility failure — the accessible name survives. It is a
visual failure: the button becomes an empty box. Consumers who need a
guaranteed rendering should override the glyph with an inline SVG via
the `{% call %}` block (see
[`./custom-rendering.md`](./custom-rendering.md)) and keep
`aria-hidden="true"` on it.

## State signals

The active theme is exposed in three independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The managed `<link>`'s `href` attribute.
3. The hidden input's `value`, and the `aria-selected="true"` option.

## The status region is part of the pattern

The closed control shows a glyph and nothing else. A screen-reader user
focusing the button hears the label ("Theme") — **not** the theme that
is currently active. A sighted user sees a half-circle that looks the
same whichever theme is applied. The active theme is not discoverable
from the closed control by anyone.

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

What this does *not* fix: focusing the closed button still announces
only the label. The status region tells the user what is active; it
does not make the control self-describing. Opening the listbox does
surface the state — the applied theme is the `aria-selected` option —
but that requires an interaction.

## Internationalisation

- `opts.label` is consumer-supplied; pass a translated string. It is
  load-bearing here in a way it was not for a labelled `<select>`, per
  tradeoff 1 above.
- `opts.themeLabels` entries are consumer-supplied; localise the
  values.
- The macro never emits hardcoded natural-language strings,
  including the word "default". The only string it emits unprompted is
  the decorative, `aria-hidden` glyph.

## Visible focus

The helper does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring on **both**
the button and the `<ul>` — the list receives DOM focus while open, and
an unstyled focus ring on it is easy to miss. See
[`./styling.md`](./styling.md).

## Reduced motion

The helper performs no animation, and does not animate the listbox
open or closed. Consumer CSS that adds a transition on the open state
is responsible for respecting `prefers-reduced-motion`, as are theme
CSS files that transition on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the closed control as "{label}, pop-up
  button, collapsed"; on open, "{label}, list box" and each option as
  "{labelFor(slug)}, selected / not selected, n of m".
- NVDA announces "{label} button collapsed" then "{label} list box"
  with the active option read as it moves.
- Changes are announced because `aria-activedescendant` moves and
  `aria-selected` is re-derived on apply. Verify this against your own
  AT — see tradeoff 2.

## Common mistakes to avoid

- **Letting the glyph be the name.** Never remove `aria-hidden="true"`
  from the icon span, and never omit `opts.label`. A button whose
  accessible name is "◑" is unusable.
- **Putting the accessible name in the `{% call %}` block.** The block
  replaces the glyph, not the label. Anything you render there should
  be `aria-hidden="true"` too.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Styling the list open by default.** The `hidden` attribute is the
  open-state contract; a CSS rule like `.theme-select-list { display:
  block }` overrides `hidden` and leaves the list permanently visible
  and out of sync with `aria-expanded`. Use
  `.theme-select-list:not([hidden])` for open-state styling.
- **Forgetting to translate `opts.themeLabels`.** The macro only
  knows what the consumer tells it; locale-aware copy is the
  consumer's responsibility.
- **Emitting `<script>` from the macro.** Forbidden. CSP
  `script-src` policies that forbid inline scripts must continue
  to work.

---

Lily™ and Lily Design System™ are trademarks.
