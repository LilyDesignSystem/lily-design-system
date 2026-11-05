# MedicalBanner

A prominent message bar across the top of a page, with medical information.

See `components/medical-banner/index.md` for canonical documentation.

Dismissing removes it for good.

## Parameters

- `Label`: string (required) — names the region
- `Type`: `info`, `success`, `warning` or `error`, rendered as `data-type`
- `Dismissible`: bool; `CloseLabel`: string — the button's `aria-label`
- `OnClose`: EventCallback
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<MedicalBanner Label="Allergy" Type="warning">...</MedicalBanner>
```
