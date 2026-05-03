# MedicalBanner

A prominent message bar across the top of a page, with medical information.

See `components/medical-banner/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `medical-banner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MedicalBanner Label="...">
    Content
</MedicalBanner>
```
