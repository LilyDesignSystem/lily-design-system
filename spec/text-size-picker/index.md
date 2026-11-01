## Text Size Picker

Label: a stroke-drawn **"A"** icon, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph. It was the glyph A U+0041 until 2026-09-16 (see `AGENTS/helpers.md`).

Button:

```html
<button
  type="button"
  class="text-size-picker-button"
  aria-label="Text Size Picker"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-controls="text-size-picker-list"
>
  <svg
    class="text-size-picker-icon"
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
    <path d="M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2" />
  </svg>
</button>
```

Tooltip (a sibling right after the button since 2026-10-04; purely visual, holds the button's own label, not linked with
`aria-describedby`):

```html
<div
  class="text-size-picker-tooltip"
  role="tooltip"
  id="text-size-picker-tooltip"
  hidden=""
>
  Text Size Picker
</div>
```

List:

```html
<ul
  class="text-size-picker-list"
  id="text-size-picker-list"
  role="listbox"
  aria-label="Text Size Picker"
  tabindex="-1"
  hidden=""
></ul>
```

List items:

```html
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-largest"
  aria-selected="false"
>
  Largest
</li>
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-larger"
  aria-selected="false"
>
  Larger
</li>
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-large"
  aria-selected="false"
>
  Large
</li>
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-medium"
  aria-selected="false"
>
  Medium
</li>
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-small"
  aria-selected="false"
>
  Small
</li>
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-smaller"
  aria-selected="false"
>
  Smaller
</li>
<li
  role="option"
  class="text-size-picker-option"
  id="text-size-picker-option-smallest"
  aria-selected="false"
>
  Smallest
</li>
```

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-text-size-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).

## Related topics

[helpers](../helpers/index.md) · [theme-picker](../theme-picker/index.md) · [responsive](../responsive/index.md)
