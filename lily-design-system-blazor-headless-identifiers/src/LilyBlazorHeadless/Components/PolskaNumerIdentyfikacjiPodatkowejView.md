# PolskaNumerIdentyfikacjiPodatkowejView

A a read-only display of Poland's Numer Identyfikacji Podatkowej (NIP).

See `components/polska-numer-identyfikacji-podatkowej-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `polska-numer-identyfikacji-podatkowej-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PolskaNumerIdentyfikacjiPodatkowejView Label="Tax Identification Number">...</PolskaNumerIdentyfikacjiPodatkowejView>
```
