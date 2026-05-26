# SuomiHenkilotunnusView

A a read-only display of Finland's Henkilötunnus (HETU).

See `components/suomi-henkilotunnus-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `suomi-henkilotunnus-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SuomiHenkilotunnusView Label="Personal Identity Code">...</SuomiHenkilotunnusView>
```
