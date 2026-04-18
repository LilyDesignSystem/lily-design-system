# UnitedKingdomNationalHealthServiceNumberInput

## Overview

A headless input for entering a United Kingdom National Health Service (NHS)
number. The NHS number is a 10-digit identifier assigned to every patient
registered with the NHS in England, Wales, and the Isle of Man. The standard
display format is "XXX XXX XXXX" (three groups separated by spaces). The
component enforces this pattern, uses a numeric keyboard hint for mobile,
and disables autocomplete to protect sensitive health information.

## What it does

An input for entering a UK NHS number.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `value` | string, default "" | Bindable input value; supports bind:value. |
| `required` | boolean, default false | Whether the input is required for form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required NHS number input -->
<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" required />

<!-- Disabled NHS number input -->
<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberInput from "$lib/components/UnitedKingdomNationalHealthServiceNumberInput/UnitedKingdomNationalHealthServiceNumberInput.svelte";
</script>

<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" bind:value />
```

## Keyboard

- Standard text input keyboard behavior
- Users type digits and spaces in the format XXX XXX XXXX

## Accessibility

- aria-label provides the accessible name for screen readers
- inputmode="numeric" hints mobile devices to show a numeric keyboard
- pattern enforces XXX XXX XXXX format on form validation
- autocomplete="off" protects sensitive health identifiers
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- NHS Number format: https://www.nhs.uk/nhs-services/online-services/find-nhs-number/
