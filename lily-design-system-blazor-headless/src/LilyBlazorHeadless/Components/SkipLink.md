# SkipLink

A hidden link for keyboard users to skip to main content.

See `components/skip-link/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `skip-link`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SkipLink>
    Content
</SkipLink>
```
