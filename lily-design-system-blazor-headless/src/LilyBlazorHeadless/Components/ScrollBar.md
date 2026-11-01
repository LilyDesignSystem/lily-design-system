# ScrollBar

A custom scrollbar element.

See `components/scroll-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Orientation`: string (default `"vertical"`) — `aria-orientation`
- `Value` / `ValueChanged`: double (default `0`; `@bind-Value`) — the scroll position, `aria-valuenow`
- `Min` / `Max`: double (default `0` / `100`) — the range
- `Step`: double (default `1`) — the arrow-key increment
- `PageStep`: double (default `10`) — the Page Up / Page Down increment
- `Controls`: string — the scrolled element's id, `aria-controls`
- `CssClass`: string — extra CSS classes appended to `scroll-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ScrollBar Label="Page scroll" Controls="page-content" @bind-Value="position">
    <div class="thumb"></div>
</ScrollBar>
```

The keys move `Value`: ArrowUp/ArrowLeft and ArrowDown/ArrowRight by `Step`, PageUp/PageDown by `PageStep`, Home/End to the bounds,
clamped. Without JS interop the handler cannot cancel only these keys, so they may also scroll the page behind the scrollbar.
