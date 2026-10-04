# SearchPicker (Blazor helper)

A headless Blazor 10 site-search control: a single-icon button (a
bundled magnifying-glass SVG) that opens a dropdown holding a search
field and, at its right, a submit button labelled `⏎`. Pressing Return
in the field, or the `⏎` button, navigates to `/?<query>` — a search
for `foo` goes to `/?foo`.

Ships no CSS and no JS file.

The single source of truth is [spec/index.md](./spec/index.md). This file
is the human-readable guide.

## Install

Add a project reference to
`LilyDesignSystem.Blazor.SearchPicker.csproj`, or the
`LilyDesignSystem.Blazor.SearchPicker` NuGet package (not yet
published).

```xml
<ProjectReference Include="path/to/LilyDesignSystem.Blazor.SearchPicker.csproj" />
```

## Quick start

```razor
@using LilyDesignSystem.Blazor.Helpers

<SearchPicker Label="Search this site"
              InputLabel="Search terms"
              SubmitLabel="Search" />
```

That is the whole wiring: a search for `foo` performs a GET to `/?foo`.

The control needs an interactive render mode — `InteractiveServer`,
`InteractiveWebAssembly`, or `InteractiveAuto`. Under static SSR the
markup renders but the button cannot open the panel.

## Where the search goes

The destination is `SearchPicker.SearchHref(query, action)`:

| You type     | `Action`    | Destination   |
| ------------ | ----------- | ------------- |
| `foo`        | `"/"`       | `/?foo`       |
| `  foo bar ` | `"/"`       | `/?foo%20bar` |
| `a&b`        | `"/"`       | `/?a%26b`     |
| `foo`        | `"/search"` | `/search?foo` |

The query is trimmed and encoded exactly as JavaScript's
`encodeURIComponent` would, so spaces and `&` cannot split or corrupt it,
and every Lily catalog builds the same URL. An empty query goes nowhere.

The bare query (`/?foo`, not `/?q=foo`) is why the component navigates
in C#: a native GET form always sends `name=value` pairs, so the form's
submission is cancelled and the component navigates to the exact URL
itself.

## In-app routing

By default the component calls
`NavigationManager.NavigateTo(href, forceLoad: true)` — a real GET
request. Pass `Navigate` to route it yourself:

```razor
@inject NavigationManager Nav

<SearchPicker Label="Search this site"
              InputLabel="Search terms"
              SubmitLabel="Search"
              Navigate="@(href => Nav.NavigateTo(href))"
              OnSearch="@(e => Console.WriteLine($"searched {e.Query}"))" />
```

`OnSearch` fires before navigating, with the trimmed `Query` and the
`Href`, for analytics or to record the query.

## Parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-parameters).
Required: `Label`, `InputLabel`, `SubmitLabel` — no English defaults,
because every user-facing string is yours to localise. Optional:
`Placeholder`, `Value` (`@bind-Value`), `Action`, `Navigate`,
`OnSearch`, `ChildContent`, `CssClass`, and any unmatched attribute
(spread onto the root).

## Static helpers

- `SearchPicker.ReturnSymbol` — the bare `⏎` (U+23CE).
- `SearchPicker.SearchHref(query, action = "/")` — the destination for a
  query.
- `SearchPicker.NextSearchPickerId()` — the per-instance id minter.

## Accessibility

- The icon is `aria-hidden`; the button's name comes from `Label`.
- The dropdown is a real `<form role="search">` — a search landmark named
  by `Label` — with a real `type="search"` field and `type="submit"`
  button, so Return-to-submit and mobile search keyboards just work.
- `⏎` is the visible label only: it is `aria-hidden`, and the submit
  button's name is `SubmitLabel`.
- Opening focuses the field; `Escape` closes and returns focus to the
  button; clicking outside or tabbing away closes.
- See [docs/accessibility.md](./docs/accessibility.md) for the tradeoffs,
  and [spec/index.md §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation)
  for where Blazor differs from the canonical Svelte helper.

## Styling

Class hooks: `.search-picker` (root), `.search-picker-button`,
`.search-picker-icon`, `.search-picker-tooltip`, `.search-picker-panel`, `.search-picker-form`,
`.search-picker-input`, `.search-picker-submit`,
`.search-picker-submit-symbol`.

The package ships no CSS beyond the icon markup. The root `themes/`
stylesheets position the panel and lay the field and `⏎` button out in
a row.

## Tests

From `tests/LilyDesignSystem.Blazor.Helpers.Tests`, `dotnet test` — this
package contributes 32 cases, one per §7 clause (clauses 10 and 24
have two).

---

Lily™ and Lily Design System™ are trademarks.
