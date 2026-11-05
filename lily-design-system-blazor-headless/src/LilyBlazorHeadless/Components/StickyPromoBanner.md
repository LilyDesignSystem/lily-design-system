# StickyPromoBanner

A fixed-position promotional banner with a dismiss button.

See `components/sticky-promo-banner/index.md` for canonical documentation.

Fixed by an inline style, which is structural. Set `--lily-fixed-bar-block-start` or `--lily-fixed-bar-block-end` while it is open, so a focused control is not hidden behind it.

## Parameters

- `Label`, `DismissLabel`: string (required)
- `Open`: bool, default true — the consumer owns it
- `Position`: `top` or `bottom`, rendered as `data-position`
- `OnDismiss`: EventCallback<MouseEventArgs> — the button exists only with a handler
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<StickyPromoBanner Label="Offer" DismissLabel="Dismiss" Open="open" OnDismiss="@(() => open = false)">...</StickyPromoBanner>
```
