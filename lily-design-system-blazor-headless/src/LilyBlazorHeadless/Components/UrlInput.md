# UrlInput

An input for entering a URL <input type="url">.

See `components/url-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `url-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<UrlInput Label="...">
    Content
</UrlInput>
```
