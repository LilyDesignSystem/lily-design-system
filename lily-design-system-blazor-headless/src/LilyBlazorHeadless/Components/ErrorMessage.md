# ErrorMessage

An error message associated with a form field.

See `components/error-message/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `error-message`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ErrorMessage>
    Content
</ErrorMessage>
```
