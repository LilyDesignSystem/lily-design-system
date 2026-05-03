# ValidationListItem

One validation rule in a validation list with a status of pending, passed, or failed.

See `components/validation-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `validation-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ValidationListItem>
    Content
</ValidationListItem>
```
