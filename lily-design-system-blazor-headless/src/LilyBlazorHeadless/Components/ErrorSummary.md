# ErrorSummary

A summary of all validation errors on a form.

See `components/error-summary/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `error-summary`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ErrorSummary>
    Content
</ErrorSummary>
```
