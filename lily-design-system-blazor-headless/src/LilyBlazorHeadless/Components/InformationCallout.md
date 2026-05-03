# InformationCallout

A callout box highlighting informational content.

See `components/information-callout/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `information-callout`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<InformationCallout Label="...">
    Content
</InformationCallout>
```
