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
[Svelte package spec](../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/spec/index.md).

Button:

```html
<button
  type="button"
  class="search-picker-button"
  aria-label="Search this site"
  aria-expanded="false"
  aria-controls="search-picker-panel"
>
  <svg class="search-picker-icon" viewBox="0 0 16 16" width="1.05rem" height="1.05rem" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>
</button>
```

Panel:

```html
<div class="search-picker-panel" id="search-picker-panel" hidden>
  <form class="search-picker-form" role="search" aria-label="Search this site" action="/" method="get">
    <input class="search-picker-input" type="search" aria-label="Search terms" enterkeyhint="search" />
    <button type="submit" class="search-picker-submit" aria-label="Search">
      <span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>
    </button>
  </form>
</div>
```

The form keeps `action`/`method="get"` so its semantics stay truthful,
but the component cancels the native submission and navigates itself: a
native GET form always sends `name=value` pairs (`/?q=foo`), and the
contract is the bare query (`/?foo`).

In `picker-bar`, search is the first picker in the row.
