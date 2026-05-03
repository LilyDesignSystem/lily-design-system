# MedicalBannerBoxForDanger

A medical record banner box for danger information e.g. reactions, warnings, alarms, etc..

See `components/medical-banner-box-for-danger/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `medical-banner-box-for-danger`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MedicalBannerBoxForDanger Label="...">
    Content
</MedicalBannerBoxForDanger>
```
