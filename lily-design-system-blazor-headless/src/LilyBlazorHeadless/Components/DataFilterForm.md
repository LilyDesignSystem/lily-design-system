# DataFilterForm

A form for filtering data by criteria.

See `components/data-filter-form/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `data-filter-form`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataFilterForm Label="...">
    Content
</DataFilterForm>
```
