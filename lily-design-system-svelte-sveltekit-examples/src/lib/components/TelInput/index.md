# TelInput

## Overview

A headless telephone input using the native HTML <input type="tel"> element.
Provides accessible labeling via aria-label and browser autofill support via
autocomplete="tel". Commonly used in contact forms, registration flows, and
profile editors. Supports two-way data binding through a bindable value prop.

## What it does

An input for entering a telephone number <input type="tel">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<TelInput label="Phone number" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the input via aria-label. |
| `value` | string, default "" | Bindable telephone number value. |
| `required` | boolean, default false | Whether the field is required for form submission. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required phone input -->
<TelInput label="Mobile" bind:value required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TelInput from "$lib/components/TelInput/TelInput.svelte";
</script>

<TelInput label="Phone number" bind:value />
```

## Keyboard

- Native <input type="tel"> keyboard behavior (Tab to focus, type to enter digits)

## Accessibility

- aria-label provides the accessible name for the input
- autocomplete="tel" enables browser and password manager autofill
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- HTML tel input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel
