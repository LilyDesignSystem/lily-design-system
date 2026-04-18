# FranceNumeroDIdentificationAuRepertoireInput

A France numéro d'identification au répertoire (NIR) input is a specialized
form field for entering the unique 15-digit French national healthcare identifier.
The NIR is printed on the Carte Vitale and used for all medical reimbursements
in France.

The standard display format is "X XX XX XX XXX XXX XX" (sex, birth year, birth
month, department, commune, order number, control key). This input component
enforces that pattern, uses a numeric keyboard hint for mobile devices, and
disables autocomplete to protect sensitive health information. The component
supports required and disabled states, and provides accessible labeling for
screen readers.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation for NIR format
- Pattern: `[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}` (X XX XX XX XXX XXX XX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive health identifiers
- Supports `bind:value` for two-way binding via `$bindable()`
- Pattern is defined as a constant to avoid Svelte template expression parsing of curly braces

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Usage

```svelte
<script>
  import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";

  let nir = $state("");
</script>

<FranceNumeroDIdentificationAuRepertoireInput label="NIR" />
```

With two-way binding:

```svelte
<FranceNumeroDIdentificationAuRepertoireInput label="NIR" bind:value={nir} />
```

Required field in a form:

```svelte
<FranceNumeroDIdentificationAuRepertoireInput label="NIR" required />
```

Disabled state:

```svelte
<FranceNumeroDIdentificationAuRepertoireInput label="NIR" disabled />
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type digits and spaces in the format X XX XX XX XXX XXX XX

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## References

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
