# PhaseBanner

A banner showing service development phase and inviting feedback.

See `components/phase-banner/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `phase-banner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PhaseBanner>
    Content
</PhaseBanner>
```
