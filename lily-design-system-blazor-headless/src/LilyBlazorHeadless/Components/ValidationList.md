# ValidationList

A live-feedback list of input validation rules with pending, passed, and failed states.

See `components/validation-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `validation-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ValidationList Label="...">
    Content
</ValidationList>
```
