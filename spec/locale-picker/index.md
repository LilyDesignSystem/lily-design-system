# Locale Picker

Label: a **globe** icon — an outline circle with a lighter graticule, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph. It was the glyph 🌐︎ U+1F310 until 2026-09-16 (see `AGENTS/helpers.md`).

Button:

```html
<button
  type="button"
  class="locale-picker-button"
  aria-label="Locale Picker"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-controls="locale-picker-list"
>
  <svg
    class="locale-picker-icon"
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
      stroke-width="1.1"
      d="M2 8h12M8 2v12M3.35 4.3a8 8 0 0 0 9.3 0M12.65 11.7a8 8 0 0 0-9.3 0M7.54 2.15a7.7 7.7 0 0 0 0 11.7M8.46 13.85a7.7 7.7 0 0 0 0-11.7"
    />
  </svg>
</button>
```

Tooltip (a sibling right after the button since 2026-10-04; purely visual, holds the button's own label, not linked with
`aria-describedby`):

```html
<div
  class="locale-picker-tooltip"
  role="tooltip"
  id="locale-picker-tooltip"
  hidden=""
>
  Locale Picker
</div>
```

List:

```html
<ul
  class="locale-picker-list"
  id="locale-picker-list"
  role="listbox"
  aria-label="Locale Picker List"
  tabindex="-1"
  hidden=""
></ul>
```

List item with locale picker option <slug>:

```html
<li
  role="option"
  class="locale-picker-option"
  id="locale-picker-option-en-us"
  aria-selected="true"
>
  English (US)
</li>
```

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-locale-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).

## Related topics

[helpers](../helpers/index.md) · [theme-picker](../theme-picker/index.md) · [text-size-picker](../text-size-picker/index.md) · [internationalization](../internationalization/index.md) · [label-packs](../label-packs/index.md)
