# MockupBrowser

A box area that looks like a web browser.

See `components/mockup-browser/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-browser`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupBrowser Label="...">
    Content
</MockupBrowser>
```
