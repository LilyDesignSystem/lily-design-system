# SearchPicker (React helper)

A headless React 19 site-search control: a single-icon button (a bundled
magnifying-glass SVG) that opens a dropdown holding a search field and,
at its right, a submit button labelled `⏎`. Pressing Return in the field,
or the `⏎` button, navigates to `/?<query>` — a search for `foo` goes to
`/?foo`.

The single source of truth is [spec/index.md](./spec/index.md). This file
is the human-readable guide.

## Install

```sh
npm install @lilydesignsystem/react-search-picker
```

```tsx
import { SearchPicker, searchHref } from "@lilydesignsystem/react-search-picker";
```

## Quick start

```tsx
import SearchPicker from "@lilydesignsystem/react-search-picker";

export function SiteHeader() {
  return (
    <SearchPicker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
    />
  );
}
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

The bare query (`/?foo`, not `/?q=foo`) is why the component navigates
in script: a native GET form always sends `name=value` pairs, so it
cancels the native submission and navigates to the exact URL itself.

## Client-side routing

By default the component calls `location.assign(href)` — a real GET
request. In a single-page app, pass your router's navigate function so
the search stays in-app:

```tsx
"use client";
import { useRouter } from "next/navigation";
import SearchPicker from "@lilydesignsystem/react-search-picker";

export function SiteSearch() {
  const router = useRouter();
  return (
    <SearchPicker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
      navigate={(href) => router.push(href)}
    />
  );
}
```

`onSearch(query, href)` fires before navigating, for analytics or to
record the query.

## Controlled or uncontrolled text

Omit `value` and the component keeps its own text, optionally seeded by
`defaultValue`. Pass `value` + `onChange` to own the text yourself — for
example to pre-fill the field from the current URL.

## Props

Full table in [spec/index.md §4.1](./spec/index.md#41-props). Required:
`label`, `inputLabel`, `submitLabel` — no English defaults, because every
user-facing string is yours to localise. Optional: `placeholder`,
`value`, `defaultValue`, `onChange`, `action`, `navigate`, `onSearch`,
`children` (a render prop receiving `{ open, query }`), `className`.

## Accessibility

- The icon is `aria-hidden`; the button's name comes from `label`.
- The dropdown is a real `<form role="search">` — a search landmark named
  by `label` — with a real `type="search"` field and `type="submit"`
  button, so Return-to-submit and mobile search keyboards just work.
- `⏎` is the visible label only: it is `aria-hidden`, and the submit
  button's name is `submitLabel`.
- Opening focuses the field; `Escape` closes and returns focus to the
  button; clicking outside or tabbing away closes. A blur with no new
  focus target (Safari's click on a button) does not close it.
- See [docs/accessibility.md](./docs/accessibility.md) for the tradeoffs.

## Styling

Class hooks: `.search-picker` (root), `.search-picker-button`,
`.search-picker-icon`, `.search-picker-panel`, `.search-picker-form`,
`.search-picker-input`, `.search-picker-submit`,
`.search-picker-submit-symbol`.

The package ships no CSS beyond the icon markup. The root `themes/`
stylesheets position the panel and lay the field and `⏎` button out in
a row.

## Tests

`npx vitest run lily-design-system-react-search-picker` from the
catalog root — 25 cases covering every §7 clause (§7.19 has two: the
uncontrolled and the controlled form).

---

Lily™ and Lily Design System™ are trademarks.
