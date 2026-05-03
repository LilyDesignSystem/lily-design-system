# GovernmentIdentifier

An identifier section with a parent agency logo, agency name, and required government links.

See `components/government-identifier/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `government-identifier`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<GovernmentIdentifier Label="...">
    Content
</GovernmentIdentifier>
```
