# BarcodeImage

A barcode image with a required text alternative for assistive technologies.

See `components/barcode-image/index.md` for canonical documentation.

## Parameters

- `Src`: string (required) — image source URL or data URI
- `Alt`: string (required) — text alternative describing the encoded value
- `Loading`: string (optional) — image loading hint (`lazy` or `eager`)
- `CssClass`: string — extra CSS classes appended to `barcode-image`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BarcodeImage Src="data:image/svg+xml;utf8,..." Alt="Order number 12345" />
```
