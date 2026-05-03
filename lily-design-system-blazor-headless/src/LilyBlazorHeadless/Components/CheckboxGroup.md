# CheckboxGroup

A group component that manages a collection of checkboxes with shared state.

See `components/checkbox-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `checkbox-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CheckboxGroup Label="...">
    Content
</CheckboxGroup>
```
