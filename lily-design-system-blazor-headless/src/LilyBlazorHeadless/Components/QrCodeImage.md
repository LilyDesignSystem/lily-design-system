# QrCodeImage

A QR code image generated from text or URL data.

See `components/qr-code-image/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `qr-code-image`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<QrCodeImage Label="...">
    Content
</QrCodeImage>
```
