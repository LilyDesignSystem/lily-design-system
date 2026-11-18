# EspanaTarjetaSanitariaIndividualView

A read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

See `components/espana-tarjeta-sanitaria-individual-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `espana-tarjeta-sanitaria-individual-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EspanaTarjetaSanitariaIndividualView Label="...">
    Content
</EspanaTarjetaSanitariaIndividualView>
```
