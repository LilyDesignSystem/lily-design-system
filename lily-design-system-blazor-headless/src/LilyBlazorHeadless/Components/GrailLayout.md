# GrailLayout

A responsive web design structure with header, left aside, center main, right aside, footer.

See `components/grail-layout/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `grail-layout`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<GrailLayout>
    Content
</GrailLayout>
```
