# ActionBar

A contextual action bar that appears when items are selected, showing the selection count and bulk action buttons.

See `components/action-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `action-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ActionBar Label="...">
    Content
</ActionBar>
```
