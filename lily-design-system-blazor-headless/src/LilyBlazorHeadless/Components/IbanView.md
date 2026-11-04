# IbanView

A a read-only display of an International Bank Account Number (IBAN).

See `components/iban-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `iban-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<IbanView Label="IBAN">...</IbanView>
```
