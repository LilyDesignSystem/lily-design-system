# PortugalNumeroDeIdentificacaoFiscalView

A a read-only display of Portugal's Número de Identificação Fiscal (NIF).

See `components/portugal-numero-de-identificacao-fiscal-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `portugal-numero-de-identificacao-fiscal-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PortugalNumeroDeIdentificacaoFiscalView Label="Tax Identification Number">...</PortugalNumeroDeIdentificacaoFiscalView>
```
