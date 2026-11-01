# Share Picker

Label: an outline **right arrow** icon, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph. It was the glyph ➤ U+27A4 until 2026-09-16 (see `AGENTS/helpers.md`).

Button:

```html
<button
  type="button"
  class="share-picker-button"
  aria-label="Share Picker"
  aria-expanded="false"
  aria-controls="share-picker-list"
>
  <svg
    class="share-picker-icon"
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
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
</button>
```

Tooltip (a sibling right after the button since 2026-10-04; purely visual, holds the button's own label, not linked with
`aria-describedby`):

```html
<div
  class="share-picker-tooltip"
  role="tooltip"
  id="share-picker-tooltip"
  hidden=""
>
  Share Picker
</div>
```

List:

```html
<ul
  class="share-picker-list"
  id="share-picker-list"
  aria-label="Share Picker"
  hidden=""
></ul>
```

List item with share picker slug:

```html
<li class="share-picker-list-item">
  <button
    type="button"
    class="share-picker-copy-link"
  >
    Copy link
  </button>
</li>
```

List items:

- Copy Link
- Email Link
- Share on LinkedIn
- Share on Bluesky
- Share on Threads
- Share on Reddit
- Share on Mastodon -> use mastodonshare.com
- Share on WhatsApp
- Share on Telegram

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-share-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).

## Related topics

[helpers](../helpers/index.md) · [link-picker](../link-picker/index.md) (the other disclosure of links) · [search-picker](../search-picker/index.md)
