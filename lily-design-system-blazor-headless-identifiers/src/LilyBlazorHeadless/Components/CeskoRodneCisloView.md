# CeskoRodneCisloView

A a read-only display of Czech Republic's Rodné číslo (RČ).

See `components/cesko-rodne-cislo-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `cesko-rodne-cislo-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CeskoRodneCisloView Label="Czech Personal Number">...</CeskoRodneCisloView>
```
