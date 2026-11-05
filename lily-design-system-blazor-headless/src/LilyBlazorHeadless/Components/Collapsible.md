# Collapsible

A container that can be expanded or collapsed.

See `components/collapsible/index.md` for canonical documentation.

Native `<details>` and `<summary>`, like the Svelte, React, Vue and Nunjucks ports. `Details.razor.js` reports the state to C#, which needs an interactive render mode.

## Parameters

- `Summary`: string (required) — the toggle's text
- `Open`, `OpenChanged`: bool — two-way with `@bind-Open`
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Collapsible Summary="More" @bind-Open="open">...</Collapsible>
```
