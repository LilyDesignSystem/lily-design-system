# NewsletterSignup

An email subscription form composition with idle, submitting, success, and error states.

See `components/newsletter-signup/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `newsletter-signup`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NewsletterSignup Label="...">
    Content
</NewsletterSignup>
```
