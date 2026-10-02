# `<search-picker>` — Lily Design System HTML helper

A headless site-search control, packaged as a vanilla custom element. A
single-icon button (a bundled magnifying-glass SVG) opens a dropdown
holding a search field and, at its right, a submit button labelled `⏎`.
Pressing Return in the field, or the `⏎` button, navigates to
`/?<query>` — a search for `foo` goes to `/?foo`.

Ships no CSS. The one bundled visual asset is the default button icon.

Canonical contract: [spec/index.md](./spec/index.md).

## Install

```sh
npm install @lilydesignsystem/html-search-picker
```

## Quick start

```html
<search-picker
  label="Search this site"
  input-label="Search terms"
  submit-label="Search"
></search-picker>

<script type="module">
  import "@lilydesignsystem/html-search-picker";
</script>
```

That is the whole wiring: a search for `foo` performs a GET to `/?foo`.
Importing the package registers `<search-picker>`; to use another tag
name, import `SearchPicker` and call `customElements.define(...)`
yourself.

## Where the search goes

The destination is `searchHref(query, action)`:

| You type     | `action`    | Destination   |
| ------------ | ----------- | ------------- |
| `foo`        | `"/"`       | `/?foo`       |
| `  foo bar ` | `"/"`       | `/?foo%20bar` |
| `a&b`        | `"/"`       | `/?a%26b`     |
| `foo`        | `"/search"` | `/search?foo` |

The query is trimmed and URI-encoded, so spaces and `&` cannot split or
corrupt it. An empty query goes nowhere.

The bare query (`/?foo`, not `/?q=foo`) is why the element navigates in
script: a native GET form always sends `name=value` pairs, so it
cancels the native submission and navigates to the exact URL itself.

## Client-side routing and observing searches

By default the element calls `location.assign(href)` — a real GET
request. In a single-page app, assign your router's navigate function
to the `navigate` property (a function, so it cannot be an attribute):

```js
const search = document.querySelector("search-picker");
search.navigate = (href) => router.push(href);
```

Every search also dispatches a bubbling `search` event, after the
optional `onSearch(query, href)` property callback and before
navigating:

```js
search.addEventListener("search", (event) => {
  console.log(event.detail.query, event.detail.href);
});
```

## Attributes

Full table in [spec/index.md §4](./spec/index.md#4-public-api).
Required: `label`, `input-label`, `submit-label` — no English defaults,
because every user-facing string is yours to localise. Optional:
`placeholder`, `value` (seeds the field; the live text is the `value`
property, like a native `<input>`), `action` (default `"/"`), `class`.

Property-only: `navigate`, `onSearch`.

## Custom icon

Light DOM has no `<slot>`; subclass and override
`renderButtonContent()`, which can read `this.open` and `this.value`.
See [docs/custom-rendering.md](./docs/custom-rendering.md).

## Accessibility

- The icon is `aria-hidden`; the button's name comes from `label`.
- The dropdown is a real `<form role="search">` — a search landmark named
  by `label` — with a real `type="search"` field and `type="submit"`
  button, so Return-to-submit and mobile search keyboards just work.
- `⏎` is the visible label only: it is `aria-hidden`, and the submit
  button's name is `submit-label`.
- Opening focuses the field; `Escape` closes and returns focus to the
  button; clicking outside or tabbing away closes.
- See [docs/accessibility.md](./docs/accessibility.md) for the tradeoffs.

## Styling

Class hooks: `.search-picker` (root), `.search-picker-button`,
`.search-picker-icon`, `.search-picker-panel`, `.search-picker-form`,
`.search-picker-input`, `.search-picker-submit`,
`.search-picker-submit-symbol`. See [docs/styling.md](./docs/styling.md).

The package ships no CSS beyond the icon markup. The root `themes/`
stylesheets position the panel and lay the field and `⏎` button out in
a row.

## Tests

`npx vitest run lily-design-system-html-search-picker` from the catalog
root — 32 cases covering every §7 clause.

---

Lily™ and Lily Design System™ are trademarks.
