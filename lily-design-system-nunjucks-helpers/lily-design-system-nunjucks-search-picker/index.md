# SearchPicker (Nunjucks helper)

A headless Nunjucks 3 + vanilla-JS site-search control: a single-icon
button (a bundled magnifying-glass SVG) that opens a dropdown holding a
search field and, at its right, a submit button labelled `⏎`. Pressing
Return in the field, or the `⏎` button, navigates to `/?<query>` — a
search for `foo` goes to `/?foo`.

The single source of truth is [spec/index.md](./spec/index.md). This file
is the human-readable guide.

## Install

```sh
npm install @lilydesignsystem/nunjucks-search-picker
```

The package ships the macro (`@lilydesignsystem/nunjucks-search-picker/template`,
i.e. `dist/search-picker.njk`) and the client module (the package root).

## Quick start

```njk
{% from "search-picker.njk" import searchPicker %}

{{ searchPicker({
    label: "Search this site",
    inputLabel: "Search terms",
    submitLabel: "Search"
}) }}

<script type="module">
    import { autoInit } from "/js/search-picker.client.js";
    autoInit();
</script>
```

That is the whole wiring: a search for `foo` performs a GET to `/?foo`.

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

The bare query (`/?foo`, not `/?q=foo`) is why the client navigates in
script: a native GET form always sends `name=value` pairs, so it cancels
the native submission and navigates to the exact URL itself.

## Client-side routing and callbacks

A macro cannot hold a function, so `navigate` and `onSearch` are client
options:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-search-picker";

autoInit({
  navigate: (href) => myRouter.go(href), // default: location.assign(href)
  onSearch: (query, href) => analytics.track("search", { query }),
});
```

`onSearch(query, href)` fires before navigating. `action` may also be
passed here to override the rendered one.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).
Required: `label`, `inputLabel`, `submitLabel` — no English defaults,
because every user-facing string is yours to localise. Optional:
`placeholder`, `value` (initial), `action`, `name`, `id`, `classes`,
`attributes`, and a `{% call %}` body to replace the icon.

## Accessibility

- The icon is `aria-hidden`; the button's name comes from `label`.
- The dropdown is a real `<form role="search">` — a search landmark named
  by `label` — with a real `type="search"` field and `type="submit"`
  button, so Return-to-submit and mobile search keyboards just work.
- `⏎` is the visible label only: it is `aria-hidden`, and the submit
  button's name is `submitLabel`.
- Opening focuses the field; `Escape` closes and returns focus to the
  button; clicking outside or tabbing away closes.
- See [docs/accessibility.md](./docs/accessibility.md) for the tradeoffs
  and [docs/ssr.md](./docs/ssr.md) for what happens without JavaScript.

## Styling

Class hooks: `.search-picker` (root), `.search-picker-button`,
`.search-picker-icon`, `.search-picker-panel`, `.search-picker-form`,
`.search-picker-input`, `.search-picker-submit`,
`.search-picker-submit-symbol`.

The package ships no CSS beyond the icon markup.

## Tests

`npx vitest run lily-design-system-nunjucks-search-picker` from the
catalog root — one or more cases per spec §7 clause (1–24 mirror the
canonical Svelte spec; 25–27 cover the Nunjucks surface), plus the §6
no-JS checks.

## Tooltip

`.search-picker-tooltip` (`<div role="tooltip" id="{id}-tooltip" hidden>`) is rendered right after the icon button, holding the button's `label`. `search-picker.client.js` shows it on pointer hover (button or tooltip) or keyboard focus (`:focus-visible`), hides it on `Escape` (focus stays) and never shows it while the popup is open. Not linked with `aria-describedby`. See `spec/index.md` (Tooltip).

---

Lily™ and Lily Design System™ are trademarks.
