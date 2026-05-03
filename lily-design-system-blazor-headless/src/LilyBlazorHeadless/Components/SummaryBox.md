# SummaryBox

A boxed callout highlighting key takeaways or next steps from a longer page.

See `components/summary-box/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `summary-box`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SummaryBox>
    Content
</SummaryBox>
```
