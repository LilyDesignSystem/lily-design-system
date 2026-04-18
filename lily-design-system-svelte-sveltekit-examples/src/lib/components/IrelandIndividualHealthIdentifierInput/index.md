# IrelandIndividualHealthIdentifierInput

## Overview

A headless input for entering an Ireland Individual Health Identifier (IHI),
a 10-digit clinical identifier used by the HSE to safely match patients
with their medical records across different hospitals and GPs.

## What it does

An input for entering Ireland Individual Health Identifier (IHI) unique national healthcare identifier.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<IrelandIndividualHealthIdentifierInput label="IHI" bind:value />
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
<!-- Required IHI input -->
<IrelandIndividualHealthIdentifierInput label="IHI" required />

<!-- Disabled IHI input -->
<IrelandIndividualHealthIdentifierInput label="IHI" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import IrelandIndividualHealthIdentifierInput from "$lib/components/IrelandIndividualHealthIdentifierInput/IrelandIndividualHealthIdentifierInput.svelte";
</script>

<IrelandIndividualHealthIdentifierInput label="IHI" bind:value />
```

## Keyboard

- Standard text input keyboard behavior

## Accessibility

- aria-label provides the accessible name for screen readers
- inputmode="numeric" hints mobile devices to show numeric keyboard
- pattern="[0-9]{10}" validates 10-digit format
- autocomplete="off" protects sensitive health identifiers
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- HSE: https://www.hse.ie/
