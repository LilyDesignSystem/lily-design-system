# UnitedKingdomNationalHealthServiceNumberInput

A United Kingdom National Health Service (NHS) number input is a specialized
form field for entering a 10-digit NHS patient identifier. The NHS number is
assigned to every patient registered with the National Health Service in
England, Wales, and the Isle of Man, and is used to uniquely identify
individuals across the health system.

The standard display format is "XXX XXX XXXX" (three groups of digits separated
by spaces). This input component enforces that pattern, uses a numeric keyboard
hint for mobile devices, and disables autocomplete to protect sensitive health
information. The component supports required and disabled states, and provides
accessible labeling for screen readers.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation for NHS number format
- Pattern: `[0-9]{3} [0-9]{3} [0-9]{4}` (XXX XXX XXXX)
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
  import UnitedKingdomNationalHealthServiceNumberInput from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";

  let nhsNumber = $state("");
</script>

<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" />
```

With two-way binding:

```svelte
<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" bind:value={nhsNumber} />
```

Required field in a form:

```svelte
<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" required />
```

Disabled state:

```svelte
<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" disabled />
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type digits and spaces in the format XXX XXX XXXX

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## References

- NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/
