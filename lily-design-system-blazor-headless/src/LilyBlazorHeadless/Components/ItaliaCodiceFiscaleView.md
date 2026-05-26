# ItaliaCodiceFiscaleView

A a read-only display of Italy's Codice fiscale (CF).

See `components/italia-codice-fiscale-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `italia-codice-fiscale-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ItaliaCodiceFiscaleView Label="Italian Fiscal Code">...</ItaliaCodiceFiscaleView>
```
