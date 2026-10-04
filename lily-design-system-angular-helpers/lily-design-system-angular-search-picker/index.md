# SearchPicker (Angular helper)

A headless Angular 20 site-search control: a single-icon button (a
bundled magnifying-glass SVG) that opens a dropdown holding a search
field and, at its right, a submit button labelled `⏎`. Pressing Return
in the field, or the `⏎` button, navigates to `/?<query>` — a search for
`foo` goes to `/?foo`.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the human-readable guide.

## Install

```ts
import { SearchPicker, searchHref } from "@lilydesignsystem/angular-search-picker";
```

## Quick start

```ts
import { Component } from "@angular/core";
import { SearchPicker } from "@lilydesignsystem/angular-search-picker";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [SearchPicker],
  template: `
    <lily-search-picker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
    />
  `,
})
export class AppHeader {}
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
request. In a single-page app, pass a function that hands the URL to
your router:

```ts
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { SearchPicker } from "@lilydesignsystem/angular-search-picker";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [SearchPicker],
  template: `
    <lily-search-picker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
      [navigate]="navigate"
      (searched)="record($event.query)"
    />
  `,
})
export class AppHeader {
  private readonly router = inject(Router);
  readonly navigate = (href: string) => this.router.navigateByUrl(href);
  record(query: string): void {
    console.log("searched for", query);
  }
}
```

`(searched)` emits `{ query, href }` before navigating, for analytics or
to record the query. It is named `searched`, not `search`, because
`<input type="search">` fires a native bubbling `search` DOM event that
Angular would also deliver to a `(search)` binding.

## Inputs and outputs

Full table in [spec/index.md §4.1](./spec/index.md#41-inputs--outputs).
Required: `label`, `inputLabel`, `submitLabel` — no English defaults,
because every user-facing string is yours to localise. Optional:
`placeholder`, `value` (two-way, `[(value)]`), `action`, `navigate`,
`className`. Output: `searched`. A projected `<ng-template>` (optionally
marked `lilySearchPickerIcon`) replaces the icon.

## Accessibility

- The icon is `aria-hidden`; the button's name comes from `label`.
- The dropdown is a real `<form role="search">` — a search landmark
  named by `label` — with a real `type="search"` field and
  `type="submit"` button, so Return-to-submit and mobile search
  keyboards just work.
- `⏎` is the visible label only: it is `aria-hidden`, and the submit
  button's name is `submitLabel`.
- Opening focuses the field; `Escape` closes and returns focus to the
  button; clicking outside or tabbing away closes.
- See [docs/accessibility.md](./docs/accessibility.md) for the tradeoffs.

## Styling

Class hooks: `.search-picker` (root), `.search-picker-button`,
`.search-picker-icon`, `.search-picker-panel`, `.search-picker-form`,
`.search-picker-input`, `.search-picker-submit`,
`.search-picker-submit-symbol`, `.search-picker-tooltip`.

The package ships no CSS beyond the icon markup. The root `themes/`
stylesheets position the panel and lay the field and `⏎` button out in
a row.

## Tests

`npx vitest run lily-design-system-angular-search-picker` from the
catalog root — 24 cases, one per §7 clause.

---

Lily™ and Lily Design System™ are trademarks.
