# BelgiqueNumeroDeRegistreNationalView

A a read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN).

See `components/belgique-numero-de-registre-national-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `belgique-numero-de-registre-national-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BelgiqueNumeroDeRegistreNationalView Label="National Register Number">...</BelgiqueNumeroDeRegistreNationalView>
```
