# Accessibility

The control targets WCAG 2.2 AAA using an icon `<button>` that opens a
`<ul role="listbox">`, following the WAI-ARIA Authoring Practices
listbox pattern.

This page states the tradeoffs of that choice plainly. The helper used
to render a native `<select>`; it no longer does, and the difference is
not free.

## WCAG 1.4.4 (Resize Text) — this helper's whole point

Success Criterion 1.4.4 requires that text can be resized up to 200%
without loss of content or functionality. This helper is one route to
satisfying it: the user picks a slug, the slug lands on the document
root as `data-text-size`, and the consumer's CSS maps it to a real type
scale.

Two things follow, and both matter:

- **Your CSS has to actually deliver the resize.** The helper signals
  the choice; it defines no typography. Map the slugs to a scale that
  reaches 200% at the top end, use relative units (`rem`, `em`, `ch`)
  throughout, and verify that layouts reflow rather than clip or
  overlap at the largest size. A control that sets an attribute nothing
  responds to satisfies nothing.
- **This control is not the only route, and should not be the only
  route.** Browser zoom and the user's own default font size satisfy
  1.4.4 on their own, and they keep working when this helper does not
  (see the no-JS regression below). Treat the in-page control as a
  convenience layered on top of those, and never build a page that
  depends on it.

Related criteria worth checking once you wire the scale up: 1.4.10
(Reflow) at the largest slug, 1.4.12 (Text Spacing), and 1.4.8 (Visual
Presentation, AAA) which explicitly contemplates user-selectable
sizing.

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

`aria-selected` tracks the **applied** size, not the merely-active
option. Arrowing through the list changes `aria-activedescendant` and
`data-active`; nothing becomes selected until the user commits with
`Enter`, `Space`, or a click.

## Keyboard contract

Owned entirely by `text-size-select.client.js`. Nothing below works
before that module runs — see [`./ssr.md`](./ssr.md).

On the **button**:

| Key                          | Action                                                   |
| ---------------------------- | -------------------------------------------------------- |
| `Tab` / `Shift+Tab`          | Move focus to / away from the button (one stop).          |
| `ArrowDown`, `Enter`, `Space`| Open, with the selected size active. Focus moves to the list. |
| `ArrowUp`                    | Open, with the LAST option active.                        |

On the **listbox**:

| Key                | Action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends; no wrapping. |
| `Home` / `End`     | Jump to the first / last option.                              |
| `Enter` / `Space`  | Select the active option, apply it, close, return focus.      |
| `Escape`           | Close and return focus, leaving the size unchanged.           |
| `Tab`              | Close without stealing focus back.                            |
| Printable character| Typeahead over the option labels; 500 ms buffer reset.        |

Typeahead matches the **rendered** label, so `opts.sizeLabels`
overrides participate: if you relabel `x-large` as "Huge", typing `h`
finds it.

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the size.

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
literal, and matched to what a user would plausibly call it ("Text
size", not "Typographic scale preference selector").

### 2. A custom listbox has weaker AT support than a native `<select>`

A native `<select>` is implemented by the platform. It gets the OS
picker on mobile, correct virtual-cursor behaviour in every screen
reader, and years of bug-for-bug compatibility work. A `<ul
role="listbox">` driven by `aria-activedescendant` is a
reimplementation, and support for it is good but not uniform —
browse-mode quirks, inconsistent announcement of `aria-selected`, and
mobile screen readers that handle `aria-activedescendant` less reliably
than real focus are all documented in the wild.

**A native `<select>` remains the better choice for some audiences**,
and this helper no longer offers one. That statement is sharper here
than in the sibling helpers: the audience for a text-size control is,
by construction, weighted toward users with vision impairments and
therefore toward assistive technology. If your audience is broad or the
size choice is load-bearing, test with the AT your users actually run,
and consider rendering a plain `<select>` of the same slugs wired to
`setSize` instead.

### 3. The glyph may not render

The button glyph is a Unicode character rendered with whatever font the
consumer's CSS resolves. On platforms whose font stack lacks the glyph
it degrades to a tofu box, and its weight, baseline, and optical size
vary by platform. It may also be re-coloured or hidden entirely by a
user stylesheet or forced-colors mode.

**This helper is materially safer on this point than its siblings**,
and deliberately so. The glyph is `"A"` (U+0041 LATIN CAPITAL LETTER
A) — a plain Latin capital letter present in every font that can render
the page's own text. If "A" fails to render, the page has no readable
text at all and the button is the least of the problems. Contrast
`theme-select`'s ◑ and `locale-select`'s 🌐, which are genuinely
absent from some stacks.

The obvious pictographic candidate, U+1F5DB DECREASE FONT SIZE SYMBOL,
was rejected for exactly this reason: it has no real glyph in common
font stacks, falls back to a crude bitmap shape, and additionally means
*decrease* rather than *size*.

Because the glyph is decorative and `aria-hidden`, a missing glyph is
never an accessibility failure — the accessible name survives. It is a
visual failure. Consumers who want a guaranteed rendering, or a
two-size "Aa" affordance, can override the glyph via the `{% call %}`
block and keep `aria-hidden="true"` on it.

## The no-JS regression

Without JavaScript the button **cannot be operated at all**, which the
native `<select>` it replaced could. The listbox renders `hidden` and
nothing server-side reveals it.

For a control whose purpose is Resize Text, this is the most serious of
the four costs on this page. [`./ssr.md`](./ssr.md) covers it in full,
including what still works (the server-resolved size still paints, and
the hidden input still submits) and why browser zoom remains the
backstop.

## State signals

The active size is exposed in three independent channels — no
colour-only meaning is required:

1. `data-text-size="<slug>"` on the target element (default `<html>`).
2. The hidden input's `value`.
3. The `aria-selected="true"` option.

## The status region is part of the pattern

The closed control shows a glyph and nothing else. A screen-reader user
focusing the button hears the label ("Text size") — **not** the size
that is currently active. A sighted user sees an "A" that looks the
same whichever size is applied. The active size is not discoverable
from the closed control by anyone.

That cost is real and this page does not claim it away. What it does
claim is where the compensation belongs: **in the pattern, by
default.** Lily targets WCAG 2.2 AAA, so the text-size select ships
alongside a status region in the quick start and in
[`../examples/01-basic.njk`](../examples/01-basic.njk). Pair the
control with the region; **opting out is the deliberate choice, not
opting in.**

```njk
{{ textSizeSelect({
  label: "Text size",
  sizes: ["small", "medium", "large", "x-large"]
}) }}
<p class="text-size-select-status" aria-live="polite"></p>
```

```js
const status = document.querySelector(".text-size-select-status");

autoInit({
    onChange(slug) {
        status.textContent =
            translate("Text size: {name}", { name: labels[slug] });
    },
});
```

Why this shape:

- **Visible, not `sr-only`, by default.** A visible line helps sighted
  users and cognitive accessibility too, and satisfies WCAG 1.4.1
  without relying on the control.
- **`aria-live="polite"` announces mutations only**, so the region is
  silent on first paint and speaks on each subsequent change. That is
  the intended behaviour: no announcement the user did not cause.
- **The announcement text is consumer-supplied and translatable**, so
  this stays i18n-clean. Show the human label
  (`opts.sizeLabels[slug]`), not the raw slug.
- **`.text-size-select-status`** is the class hook, kebab-case like the
  rest of the system.

There is a bonus here the sibling helpers do not get: because the
status region is itself page text, it visibly changes size when the
user picks a new slug. That is direct, immediate feedback that the
control did something — useful for cognitive accessibility and for
confirming the CSS is actually wired up.

## Internationalisation

- `opts.label` is consumer-supplied; pass a translated string. It is
  load-bearing here in a way it was not for a labelled `<select>`, per
  tradeoff 1 above.
- `opts.sizeLabels` entries are consumer-supplied; localise the values.
  The default title-cased slugs are English-shaped
  (`"x-large"` → `"X Large"`) and should be overridden in non-English
  locales.
- The macro never emits hardcoded natural-language strings. The only
  string it emits unprompted is the decorative, `aria-hidden` glyph.

## Visible focus

The helper does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring on **both**
the button and the `<ul>` — the list receives DOM focus while open, and
an unstyled focus ring on it is easy to miss.

Take particular care that the focus ring scales with the type scale:
a ring specified in `px` on a control sized in `rem` will look
progressively thinner as the user picks larger sizes.

## Reduced motion

The helper performs no animation, and does not animate the listbox open
or closed. Consumer CSS that adds a transition on the open state is
responsible for respecting `prefers-reduced-motion`. Be especially wary
of transitioning `font-size` on the `data-text-size` swap: animating
the whole page's type scale is a strong vestibular trigger.

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

- **Setting the attribute but not the CSS.** The single most common
  failure: the control works, `data-text-size` changes, and nothing
  resizes. Wire the scale first, then the control.
- **Sizing in `px`.** Absolute units defeat both this helper and the
  user's own browser settings. Use `rem` / `em`.
- **Letting the glyph be the name.** Never remove `aria-hidden="true"`
  from the icon span, and never omit `opts.label`.
- **Putting the accessible name in the `{% call %}` block.** The block
  replaces the glyph, not the label. Anything you render there should
  be `aria-hidden="true"` too.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)`) instead.
- **Styling the list open by default.** The `hidden` attribute is the
  open-state contract; a CSS rule like `.text-size-select-list {
  display: block }` overrides `hidden` and leaves the list permanently
  visible and out of sync with `aria-expanded`. Use
  `.text-size-select-list:not([hidden])` for open-state styling.
- **Treating this control as your 1.4.4 compliance story.** It helps;
  it is not sufficient on its own, and it does not work without JS.
- **Emitting `<script>` from the macro.** Forbidden. CSP `script-src`
  policies that forbid inline scripts must continue to work.

---

Lily™ and Lily Design System™ are trademarks.
