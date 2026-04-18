# NumberInput

## Overview

A headless numeric input that wraps a native <input type="number"> element
with accessible labelling and optional min, max, and step constraints. It
provides a bindable numeric value for two-way data flow. Commonly used for
quantity selectors, age inputs, price fields, and configuration values.

## What it does

An input for entering a numeric value with validation <input type="number">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<NumberInput label="Quantity" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the input via aria-label. |
| `value` | number \| undefined, default undefined | Current numeric value; bindable. |
| `min` | number, optional | Minimum allowed value. |
| `max` | number, optional | Maximum allowed value. |
| `step` | number, optional | Increment/decrement step size. |
| `required` | boolean, default false | Whether the input is required. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Number input with constraints -->
<NumberInput label="Quantity" bind:value min={0} max={100} step={1} />

<!-- Required number input -->
<NumberInput label="Age" bind:value required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NumberInput from "$lib/components/NumberInput/NumberInput.svelte";
</script>

<NumberInput label="Quantity" bind:value />
```

## Keyboard

- Up Arrow: increment value by step (native browser behavior)
- Down Arrow: decrement value by step (native browser behavior)

## Accessibility

- aria-label provides an accessible name describing the input purpose
- Implicit spinbutton role from <input type="number">
- Native validation via min, max, and step attributes

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings
- Consumer can pass placeholder via restProps for localized hint text

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
