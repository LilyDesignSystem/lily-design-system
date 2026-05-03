# MedicalBannerBoxForAdvice

A medical record banner box for advice information e.g. contacts, contexts, plans, etc..

See `components/medical-banner-box-for-advice/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `medical-banner-box-for-advice`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MedicalBannerBoxForAdvice Label="...">
    Content
</MedicalBannerBoxForAdvice>
```
