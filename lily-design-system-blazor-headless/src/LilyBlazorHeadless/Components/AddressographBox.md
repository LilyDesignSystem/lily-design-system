# AddressographBox

A labeled stamp-style block that identifies a patient or record with name, date of birth, and identifier.

See `components/addressograph-box/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `addressograph-box`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AddressographBox Label="Patient identification">
    <p>Jane Doe</p>
    <p>DOB: 1980-05-12</p>
    <p>NHS: 943 476 5919</p>
</AddressographBox>
```
