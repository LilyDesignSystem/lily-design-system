# SlovenskoRodneCisloView

A a read-only display of Slovakia's Rodné číslo (RČ).

See `components/slovensko-rodne-cislo-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `slovensko-rodne-cislo-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SlovenskoRodneCisloView Label="Slovak Personal Number">...</SlovenskoRodneCisloView>
```
