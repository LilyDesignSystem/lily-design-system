# VitalSignBellyCircumferenceAsCmInput

## Overview

A headless numeric input for entering a belly circumference value in centimeters.
Wraps a native <input type="number"> element with accessible labelling and
sensible defaults for belly circumference entry (min 0, max 300, step 1).

## What it does

Number input of one vital sign belly circumference in centimetres with integers.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the input via aria-label. |
| `value` | number \| undefined, default undefined | Current belly circumference value; bindable. |
| `min` | number, default 0 | Minimum allowed value. |
| `max` | number, default 300 | Maximum allowed value. |
| `step` | number, default 1 | Increment/decrement step size. |
| `required` | boolean, default false | Whether the input is required. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import VitalSignBellyCircumferenceAsCmInput from "$lib/components/VitalSignBellyCircumferenceAsCmInput/VitalSignBellyCircumferenceAsCmInput.svelte";
</script>

<VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" bind:value />
```

## Keyboard

- Up Arrow: increment value by step (native browser behavior)
- Down Arrow: decrement value by step (native browser behavior)

## Accessibility

- aria-label provides an accessible name describing the input purpose
- Implicit spinbutton role from <input type="number">
