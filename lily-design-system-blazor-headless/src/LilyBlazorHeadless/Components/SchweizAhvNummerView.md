# SchweizAhvNummerView

A read-only display of Switzerland's AHV-Nummer / Numero AVS.

See `components/schweiz-ahv-nummer-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `schweiz-ahv-nummer-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SchweizAhvNummerView Label="Schweiz Ahv Nummer">...</SchweizAhvNummerView>
```
