# Scroller

A scrollytelling container with step-based foreground and background composition.

See `components/scroller/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `scroller`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Scroller>
    Content
</Scroller>
```
