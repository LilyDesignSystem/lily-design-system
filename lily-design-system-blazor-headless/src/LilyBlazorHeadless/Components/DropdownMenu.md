# DropdownMenu

A menu that opens below a trigger button.

See `components/dropdown-menu/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `dropdown-menu`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DropdownMenu Label="...">
    Content
</DropdownMenu>
```
