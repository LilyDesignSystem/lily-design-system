# FranceNumeroDIdentificationAuRepertoireInput

## Overview

A headless input for entering a France numéro d'identification au répertoire
(NIR), the unique 15-digit French national healthcare identifier printed on
the Carte Vitale. The standard display format is "X XX XX XX XXX XXX XX".
The component enforces this pattern, uses a numeric keyboard hint for mobile,
and disables autocomplete to protect sensitive health information.

## What it does

An input for entering a France numéro d'identification au répertoire (NIR) unique national healthcare identifier.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<FranceNumeroDIdentificationAuRepertoireInput label="NIR" bind:value />
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
<!-- Required NIR input -->
<FranceNumeroDIdentificationAuRepertoireInput label="NIR" required />

<!-- Disabled NIR input -->
<FranceNumeroDIdentificationAuRepertoireInput label="NIR" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FranceNumeroDIdentificationAuRepertoireInput from "$lib/components/FranceNumeroDIdentificationAuRepertoireInput/FranceNumeroDIdentificationAuRepertoireInput.svelte";
</script>

<FranceNumeroDIdentificationAuRepertoireInput label="NIR" bind:value />
```

## Keyboard

- Standard text input keyboard behavior
- Users type digits and spaces in the format X XX XX XX XXX XXX XX

## Accessibility

- aria-label provides the accessible name for screen readers
- inputmode="numeric" hints mobile devices to show a numeric keyboard
- pattern enforces X XX XX XX XXX XXX XX format on form validation
- autocomplete="off" protects sensitive health identifiers
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale
