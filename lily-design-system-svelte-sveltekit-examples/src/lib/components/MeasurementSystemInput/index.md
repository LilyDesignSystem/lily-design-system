# MeasurementSystemInput

## Overview

A headless text input for entering a measurement system name, such as
"metric", "imperial", or "SI". A measurement system is a collection of
units and rules for measuring physical quantities. The component renders
an <input type="text"> with aria-label for accessible naming and a bindable
value for reactive form integration.

## What it does

An input for selecting a measurement system.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<MeasurementSystemInput label="Measurement system" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the input via aria-label. |
| `value` | string, default "" | Bindable measurement system name via $bindable(). |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Basic measurement system input -->
<MeasurementSystemInput label="Measurement system" bind:value />

<!-- Required system input -->
<MeasurementSystemInput label="System" bind:value required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MeasurementSystemInput from "$lib/components/MeasurementSystemInput/MeasurementSystemInput.svelte";
</script>

<MeasurementSystemInput label="Measurement system" bind:value />
```

## Keyboard

- Native <input type="text"> keyboard behavior (typing, selection, clipboard-copy-button).

## Accessibility

- aria-label provides the accessible name from the label prop
- Supports required and disabled HTML states

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- HTML input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
