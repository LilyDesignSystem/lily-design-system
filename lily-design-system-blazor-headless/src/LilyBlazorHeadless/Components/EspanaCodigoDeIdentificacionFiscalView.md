# EspanaCodigoDeIdentificacionFiscalView

A a read-only display of Spain's Código de Identificación Fiscal (CIF).

See `components/espana-codigo-de-identificacion-fiscal-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `espana-codigo-de-identificacion-fiscal-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EspanaCodigoDeIdentificacionFiscalView Label="Tax Identification Code">...</EspanaCodigoDeIdentificacionFiscalView>
```
