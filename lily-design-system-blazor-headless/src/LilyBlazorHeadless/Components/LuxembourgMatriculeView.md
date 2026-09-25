# LuxembourgMatriculeView

A a read-only display of Luxembourg's Numero d'Identification Nationale (Matricule).

See `components/luxembourg-matricule-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `luxembourg-matricule-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<LuxembourgMatriculeView Label="Luxembourg Matricule">...</LuxembourgMatriculeView>
```
