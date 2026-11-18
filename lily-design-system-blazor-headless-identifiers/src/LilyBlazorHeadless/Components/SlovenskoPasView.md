# SlovenskoPasView

A a read-only display of Slovakia's Pas.

See `components/slovensko-pas-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `slovensko-pas-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SlovenskoPasView Label="Slovak Passport">...</SlovenskoPasView>
```
