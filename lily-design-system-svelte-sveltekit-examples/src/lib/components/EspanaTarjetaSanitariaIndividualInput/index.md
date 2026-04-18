# EspanaTarjetaSanitariaIndividualInput

## Overview

A headless input for entering a España Tarjeta Sanitaria Individual (TSI),
the unique Spanish national healthcare identifier (CIP-SNS). The format
varies by Autonomous Community but typically starts with 4 region digits
followed by alphanumeric characters.

## What it does

An input for entering a España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value />
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
<!-- Required TSI input -->
<EspanaTarjetaSanitariaIndividualInput label="TSI" required />

<!-- Disabled TSI input -->
<EspanaTarjetaSanitariaIndividualInput label="TSI" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import EspanaTarjetaSanitariaIndividualInput from "$lib/components/EspanaTarjetaSanitariaIndividualInput/EspanaTarjetaSanitariaIndividualInput.svelte";
</script>

<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value />
```

## Keyboard

- Standard text input keyboard behavior

## Accessibility

- aria-label provides the accessible name for screen readers
- autocomplete="off" protects sensitive health identifiers
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- Ministerio de Sanidad: https://www.sanidad.gob.es/
