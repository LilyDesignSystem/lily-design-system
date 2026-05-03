# MedicalBannerBox

A medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information.

See `components/medical-banner-box/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `medical-banner-box`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MedicalBannerBox>
    Content
</MedicalBannerBox>
```
