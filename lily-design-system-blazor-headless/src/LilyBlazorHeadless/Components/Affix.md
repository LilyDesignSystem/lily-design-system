# Affix

A wrapper that pins its content to a viewport position while the page scrolls.

See `components/affix/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `affix`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Affix>
    Content
</Affix>
```
