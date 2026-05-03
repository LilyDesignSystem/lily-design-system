# ReviewDate

A display of a content review date.

See `components/review-date/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `review-date`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ReviewDate Label="...">
    Content
</ReviewDate>
```
