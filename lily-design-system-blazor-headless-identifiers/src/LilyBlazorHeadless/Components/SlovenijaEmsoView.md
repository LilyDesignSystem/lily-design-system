# SlovenijaEmsoView

A a read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO).

See `components/slovenija-emso-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `slovenija-emso-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SlovenijaEmsoView Label="Unique Master Citizen Number">...</SlovenijaEmsoView>
```
