# Details

A disclosure widget that shows and hides content.

See `components/details/index.md` for canonical documentation.

Native `<details>` and `<summary>`. `Details.razor.js` reports the state to C#, which needs an interactive render mode; the browser still opens it without one.

## Parameters

- `Summary`: string (required) — the toggle's text
- `Open`, `OpenChanged`: bool — two-way with `@bind-Open`
- `CssClass`: string — extra CSS classes appended to `details`
- `ChildContent`: RenderFragment — the content revealed
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Details Summary="What happens next" @bind-Open="open">
    <p>...</p>
</Details>
```
