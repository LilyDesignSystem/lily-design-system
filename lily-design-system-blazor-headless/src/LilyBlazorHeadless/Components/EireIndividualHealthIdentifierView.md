# EireIndividualHealthIdentifierView

A read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier.

See `components/eire-individual-health-identifier-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `eire-individual-health-identifier-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EireIndividualHealthIdentifierView Label="...">
    Content
</EireIndividualHealthIdentifierView>
```
