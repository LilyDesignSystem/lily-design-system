# Theme Picker

Label: a **contrast** icon — an outline circle with a filled right half, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph. It was the glyph ◑ U+25D1 until 2026-09-16 (see `AGENTS/helpers.md`).

Button:

```html
<button
  type="button"
  class="theme-picker-button"
  aria-label="Theme Picker"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-controls="theme-picker-list"
>
  <svg
    class="theme-picker-icon"
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
    <circle
      cx="8"
      cy="8"
      r="6"
    />
    <path
      d="M8 2a6 6 0 0 1 0 12z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
</button>
```

Tooltip (a sibling right after the button since 2026-10-04; purely visual, holds the button's own label, not linked with
`aria-describedby`):

```html
<div
  class="theme-picker-tooltip"
  role="tooltip"
  id="theme-picker-tooltip"
  hidden=""
>
  Theme Picker
</div>
```

List:

```html
<ul
  class="theme-picker-list"
  id="theme-picker-list"
  role="listbox"
  aria-label="Theme Picker List"
  tabindex="-1"
  hidden=""
></ul>
```

List item with theme picker option <slug>:

```html
<li
  role="option"
  class="theme-picker-option"
  id="theme-picker-option-lorem-ipsum"
  aria-selected="false"
>
  Lorem Ipsum
</li>
```

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-theme-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).
- [x] `variant="select"` (a native `<select>`) in all eight frameworks, opt-in; checked in a browser by the HTML example's
      `e2e/theme-select.spec.ts` in Chromium and WebKit, with and without `appearance: base-select`.

## Related topics

[helpers](../helpers/index.md) · [theme](../theme/index.md) · [locale-picker](../locale-picker/index.md) · [text-size-picker](../text-size-picker/index.md)
