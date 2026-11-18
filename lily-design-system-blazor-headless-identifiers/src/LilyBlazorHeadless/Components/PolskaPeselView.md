# PolskaPeselView

A a read-only display of Poland's PESEL.

See `components/polska-pesel-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `polska-pesel-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PolskaPeselView Label="PESEL">...</PolskaPeselView>
```
