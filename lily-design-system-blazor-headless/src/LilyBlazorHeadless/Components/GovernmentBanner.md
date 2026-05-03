# GovernmentBanner

A banner identifying a website as belonging to a government, with an expandable details panel.

See `components/government-banner/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `government-banner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<GovernmentBanner Label="...">
    Content
</GovernmentBanner>
```
