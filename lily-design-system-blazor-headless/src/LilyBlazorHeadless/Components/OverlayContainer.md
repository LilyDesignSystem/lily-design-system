# OverlayContainer

A full-viewport overlay backdrop for modals and sheets.

See `components/overlay-container/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `overlay-container`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<OverlayContainer>
    Content
</OverlayContainer>
```
