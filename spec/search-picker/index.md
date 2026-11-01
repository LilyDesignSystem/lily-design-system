# Search Picker

Icon: a bundled magnifying-glass SVG (circle + handle), the same
`viewBox="0 0 16 16"`, stroke-based family as the other page-header
pickers.

Submit label: '⏎' U+23CE Return Symbol — visible only; the accessible
name comes from the required `submitLabel`.

Behaviour: click the icon to open a dropdown holding a search field and,
at its right, the ⏎ submit button. Pressing Return in the field, or the
⏎ button, performs a GET navigation to `/?<text>` — a search for `foo`
goes to `/?foo`. The text is trimmed and URI-encoded (`foo bar` →
`/?foo%20bar`); an empty search goes nowhere. `action` changes the path,
`navigate` swaps in a client-side router. Full contract: the canonical
[Svelte package spec](../../lily-design-system-svelte-search-picker/spec/index.md).

Button:

```html
<button
  type="button"
  class="search-picker-button"
  aria-label="Search this site"
  aria-expanded="false"
  aria-controls="search-picker-panel"
>
  <svg
    class="search-picker-icon"
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
      cx="7"
      cy="7"
      r="4.5"
    />
    <path d="M10.5 10.5 14 14" />
  </svg>
</button>
```

Panel:

```html
<div
  class="search-picker-panel"
  id="search-picker-panel"
  hidden
>
  <form
    class="search-picker-form"
    role="search"
    aria-label="Search this site"
    action="/"
    method="get"
  >
    <input
      class="search-picker-input"
      type="search"
      aria-label="Search terms"
      enterkeyhint="search"
    />
    <button
      type="submit"
      class="search-picker-submit"
      aria-label="Search"
    >
      <span
        class="search-picker-submit-symbol"
        aria-hidden="true"
        >⏎</span
      >
    </button>
  </form>
</div>
```

The form keeps `action`/`method="get"` so its semantics stay truthful,
but the component cancels the native submission and navigates itself: a
native GET form always sends `name=value` pairs (`/?q=foo`), and the
contract is the bare query (`/?foo`).

In `picker-bar`, search is the first picker in the row.

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks: `bin/list-helper-packages <framework>` lists `<framework>-search-picker` for
      svelte, react, vue, angular, html, web-components, nunjucks and blazor (checked 2026-10-30).
- [x] The HTML and Web Components packages carry the same class hooks, events and observed attributes (`bin/check-port-parity`,
      in `bin/test`).
- [x] The page-header rules in [AGENTS/helpers.md](../../AGENTS/helpers.md) apply: no English default text, the icon is
      decorative (`aria-hidden`), and the accessible name is the consumer's `label`.
- [ ] Verified in a real browser in Chromium, Firefox and WebKit for every framework (today: unit tests per package, and the
      example apps' own e2e where they use this picker).

## Related topics

[helpers](../helpers/index.md) · [link-picker](../link-picker/index.md) · [share-picker](../share-picker/index.md)
