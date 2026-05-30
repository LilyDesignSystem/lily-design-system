# BarcodeImage

a barcode-image image rendered from encoded data such as an order number, SKU, or identifier.

This is the Angular headless implementation. See `components/barcode-image/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-barcode-image [src]="..." [alt]="..."></lily-barcode-image>
```

## Files

- `BarcodeImage.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `BarcodeImage.spec.ts` — vitest + TestBed render test
