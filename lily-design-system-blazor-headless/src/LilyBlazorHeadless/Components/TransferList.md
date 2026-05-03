# TransferList

A dual list box for moving items between two lists.

See `components/transfer-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `transfer-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TransferList Label="...">
    Content
</TransferList>
```
