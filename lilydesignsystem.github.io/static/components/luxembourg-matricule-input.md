# Luxembourg Matricule Input

LuxembourgMatriculeInput is a headless input for entering Luxembourg's Numéro d'Identification Nationale (Matricule), Luxembourg's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to LuxembourgMatriculeView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to LuxembourgMatriculeView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Numéro d'Identification Nationale (Matricule)" required>
  <LuxembourgMatriculeInput label="Numéro d'Identification Nationale (Matricule)" value={value} required />
  <Hint>Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.</Hint>
  <ErrorMessage>Please enter a valid Numéro d'Identification Nationale</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Luxembourg's Numéro d'Identification Nationale (Matricule).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `luxembourg-matricule-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.luxembourg-matricule-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.

**Where to find it:** Printed on the Luxembourg eID card and required for CCSS (Centre commun de la sécurité sociale) health-insurance registration, tax, and social-security records.

## Related components

- `luxembourg-matricule-view` — a read-only display of Luxembourg's Numéro d'Identification Nationale (Matricule)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Numéro d'identification national](https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html)

---

Lily™ and Lily Design System™ are trademarks.
