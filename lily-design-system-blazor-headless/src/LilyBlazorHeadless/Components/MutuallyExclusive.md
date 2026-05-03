# MutuallyExclusive

A container ensuring only one option can be selected from a group.

See `components/mutually-exclusive/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mutually-exclusive`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MutuallyExclusive Label="...">
    Content
</MutuallyExclusive>
```
