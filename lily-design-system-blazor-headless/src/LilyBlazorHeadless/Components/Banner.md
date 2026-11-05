# Banner

A prominent message bar across the top of a page.

See `components/banner/index.md` for canonical documentation.

Dismissing removes it for good.

## Parameters

- `Label`: string — names the region
- `Type`: `info`, `success`, `warning` or `error`, rendered as `data-type`
- `Dismissible`: bool; `CloseLabel`: string — the button's `aria-label`
- `OnClose`: EventCallback
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Banner Label="Notice" Dismissible="true" CloseLabel="Dismiss" OnClose="Closed">...</Banner>
```
