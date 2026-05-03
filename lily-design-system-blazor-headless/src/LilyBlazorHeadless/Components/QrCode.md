# QrCode

A QR code image generated from text or URL data.

See `components/qr-code/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `qr-code`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<QrCode Label="...">
    Content
</QrCode>
```
