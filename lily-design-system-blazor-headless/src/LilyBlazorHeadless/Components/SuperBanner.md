# SuperBanner

A super-banner communicates a high-priority state that affects an entire app, experience, process, or system.

See `components/super-banner/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `super-banner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SuperBanner>
    Content
</SuperBanner>
```
