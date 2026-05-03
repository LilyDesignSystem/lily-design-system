# Drawer

A panel that slides in from the edge of the screen.

See `components/drawer/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `drawer`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Drawer Label="...">
    Content
</Drawer>
```
