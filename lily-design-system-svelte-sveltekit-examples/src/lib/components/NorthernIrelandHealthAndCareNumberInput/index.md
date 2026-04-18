# NorthernIrelandHealthAndCareNumberInput

## Overview

A headless input for entering a Northern Ireland Health and Care (H&C)
Number, a 10-digit identifier displayed as XXX XXX XXXX, used by HSC
Northern Ireland to uniquely identify patients.

## What it does

An input for entering a Northern Ireland Health and Care (H&C) Number unique national healthcare identifier.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<NorthernIrelandHealthAndCareNumberInput label="H&C Number" bind:value />
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
<!-- Required H&C Number input -->
<NorthernIrelandHealthAndCareNumberInput label="H&C Number" required />

<!-- Disabled H&C Number input -->
<NorthernIrelandHealthAndCareNumberInput label="H&C Number" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from "$lib/components/NorthernIrelandHealthAndCareNumberInput/NorthernIrelandHealthAndCareNumberInput.svelte";
</script>

<NorthernIrelandHealthAndCareNumberInput label="H&C Number" bind:value />
```

## Keyboard

- Standard text input keyboard behavior

## Accessibility

- aria-label provides the accessible name for screen readers
- inputmode="numeric" hints mobile devices to show numeric keyboard
- pattern="[0-9]{3} [0-9]{3} [0-9]{4}" validates 3-3-4 digit format
- autocomplete="off" protects sensitive health identifiers
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- HSC NI: https://online.hscni.net/
