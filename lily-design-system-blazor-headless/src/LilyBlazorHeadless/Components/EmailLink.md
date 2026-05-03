# EmailLink

A mailto hyperlink for an email address.

See `components/email-link/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `email-link`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EmailLink>
    Content
</EmailLink>
```
