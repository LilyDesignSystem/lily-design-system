# Visible

An IntersectionObserver wrapper that exposes element visibility state.

See `components/visible/index.md` for canonical documentation.

## Parameters

- `Once`: bool — stops at the first sighting
- `Threshold`: double; `RootMargin`: string
- `ChildContent`: RenderFragment<bool> — `context` says whether it is on screen
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Visible Once="true">
    @if (context) { <Chart /> }
</Visible>
```
