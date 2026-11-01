# Motion Picker

Label: a **pause** icon — two vertical bars, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph. It was the glyph ⏸︎ U+23F8 + U+FE0E until 2026-09-16 (see `AGENTS/helpers.md`).

Same icon-button + listbox shape as Theme Picker, Locale Picker and
Text Size Picker. The one behavioural difference: the initial value
defers **unconditionally** to the platform's `(prefers-reduced-motion:
reduce)` media query when the consumer offers the `reduce` /
`no-preference` slugs — motion has a real accessibility signal
(WCAG 2.3.3), so deferring to it is the correct default, not an opt-in.

Button:

```html
<button
  type="button"
  class="motion-picker-button"
  aria-label="Motion Picker"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-controls="motion-picker-list"
>
  <svg
    class="motion-picker-icon"
    viewBox="0 0 16 16"
    width="1.05rem"
    height="1.05rem"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M5 3v10M11 3v10" />
  </svg>
</button>
```

Tooltip (a sibling right after the button since 2026-10-04; purely visual, holds the button's own label, not linked with
`aria-describedby`):

```html
<div
  class="motion-picker-tooltip"
  role="tooltip"
  id="motion-picker-tooltip"
  hidden=""
>
  Motion Picker
</div>
```

List:

```html
<ul
  class="motion-picker-list"
  id="motion-picker-list"
  role="listbox"
  aria-label="Motion Picker"
  tabindex="-1"
  hidden=""
></ul>
```

List items:

```html
<li
  role="option"
  class="motion-picker-option"
  id="motion-picker-option-no-preference"
  aria-selected="true"
>
  No Preference
</li>
<li
  role="option"
  class="motion-picker-option"
  id="motion-picker-option-reduce"
  aria-selected="false"
>
  Reduce
</li>
```

Applies `data-motion="{slug}"` to the document root; consumer CSS/JS maps
the slug to whatever gets suppressed.

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-motion-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).

## Related topics

[helpers](../helpers/index.md) · [theme-picker](../theme-picker/index.md) · [accessibility](../accessibility/index.md)
