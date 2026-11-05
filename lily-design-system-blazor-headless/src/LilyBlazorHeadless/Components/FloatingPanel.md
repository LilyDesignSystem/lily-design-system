# FloatingPanel

A panel that floats above page content.

See `components/floating-panel/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Open`: bool — whether it shows. The consumer owns it: there is no Escape or light dismiss, because the popover is manual
- `CssClass`: string — extra CSS classes appended to `floating-panel`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FloatingPanel Label="Filters" Open="_open">
    Content
</FloatingPanel>
```
