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

The element still writes `data-theme` on the target, so the active
theme remains observable to CSS and to your own scripts — but that
is machine-readable state, not something a user perceives.

## The status region is the default pattern

Because of that gap, **the select ships paired with a compensating
status region**. It is in
[`examples/01-basic.html`](../examples/01-basic.html) and in the
`index.md` quick start, so the first thing an adopter copies already
has it. Leaving it out is the deliberate choice — a decision to make
knowingly, with a reason — not something to opt into later:

```html
<theme-select label="Theme" themes-url="/t/" themes="light,dark"></theme-select>

<p class="theme-select-status" aria-live="polite">Active theme: Light</p>

<script type="module">
    await customElements.whenDefined("theme-select");

    const select = document.querySelector("theme-select");
    const status = document.querySelector(".theme-select-status");
    const labelFor = (slug) =>
        select.querySelector(`option[value="${slug}"]`)?.textContent ?? slug;

    select.addEventListener("themechange", (e) => {
        status.textContent = `Active theme: ${labelFor(e.detail.theme)}`;
    });
</script>
```

Why it is shaped this way:

- **Visible, not `sr-only`.** The gap is not screen-reader-only:
  nothing in the control indicates the active theme to *anyone*. A
  visible line answers "which theme am I on?" for sighted users and
  helps cognitive accessibility, which is what AAA favours. The
  visually-hidden variant is in
  [styling.md](./styling.md#the-status-region) for designs that
  genuinely cannot spare the space.
- **`aria-live="polite"` announces mutations only**, so the region
  is silent on first paint and speaks once per change. No
  interruption, no page-load chatter.
- **Initial text authored in the markup**, not written by JS at
  startup — a startup write is a mutation, and mutations are what
  the live region announces. Under SSR/SSG, render it from the same
  resolved value you inline as the `value` attribute.
- **`labelFor` reads the rendered `<option>`** rather than
  re-deriving the name, so `theme-labels` overrides and translations
  are picked up for free and the line never shows a raw slug.

### What this does and does not fix

It restores the *information*, not the *semantics*. The combobox's
own accessible value is still the placeholder; a screen-reader user
tabbing onto the control still hears "Theme" and must read on to
learn the active value. That is a genuine residual cost of the
placeholder-pinned design. If your users depend on the control
itself announcing its value, don't pin the placeholder — let the
`<select>` track the selection and accept the wider control.

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
