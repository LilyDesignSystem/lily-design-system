# ReviewDate

A display of a content review date.

See `components/review-date/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Datetime`: string — machine-readable ISO 8601 date, set on `datetime`
- `CssClass`: string — extra CSS classes appended to `review-date`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ReviewDate Label="Last reviewed" Datetime="2026-10-06">
    6 October 2026
</ReviewDate>
```
