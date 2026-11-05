# GovernmentBanner

A banner identifying a website as belonging to a government, with an expandable details panel.

See `components/government-banner/index.md` for canonical documentation.

The Svelte port leaves `expanded` to the consumer; this one also updates itself, so it works unbound.

## Parameters

- `Label`, `HeaderText`, `ExpandLabel`: string (required)
- `Expanded`, `ExpandedChanged`: bool — two-way with `@bind-Expanded`
- `PanelId`: string — the panel's id
- `ChildContent` — the panel
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<GovernmentBanner Label="Official" HeaderText="An official site" ExpandLabel="How you know" @bind-Expanded="open">...</GovernmentBanner>
```
