# SignaturePad

A drawing area for capturing a handwritten signature.

See `components/signature-pad/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `signature-pad`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SignaturePad Label="...">
    Content
</SignaturePad>
```
