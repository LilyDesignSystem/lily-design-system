# UnitedStatesSocialSecurityNumberInput

## Overview

A headless input for entering a United States Social Security Number (SSN).
The SSN is a 9-digit identifier assigned by the Social Security Administration,
displayed in "XXX-XX-XXXX" format (3-digit area number, 2-digit group number,
4-digit serial number). The component enforces this pattern, uses a numeric
keyboard hint for mobile, and disables autocomplete to protect sensitive
personally identifiable information.

## What it does

An input for entering a US Social Security number.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<UnitedStatesSocialSecurityNumberInput label="Social Security Number" bind:value />
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
<!-- Required SSN input -->
<UnitedStatesSocialSecurityNumberInput label="Social Security Number" required />

<!-- Disabled SSN input -->
<UnitedStatesSocialSecurityNumberInput label="Social Security Number" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import UnitedStatesSocialSecurityNumberInput from "$lib/components/UnitedStatesSocialSecurityNumberInput/UnitedStatesSocialSecurityNumberInput.svelte";
</script>

<UnitedStatesSocialSecurityNumberInput label="Social Security Number" bind:value />
```

## Keyboard

- Standard text input keyboard behavior
- Users type digits and hyphens in the format XXX-XX-XXXX

## Accessibility

- aria-label provides the accessible name for screen readers
- inputmode="numeric" hints mobile devices to show a numeric keyboard
- pattern enforces XXX-XX-XXXX format on form validation
- autocomplete="off" protects sensitive PII
- required and disabled states are conveyed to assistive technology

## Internationalization

- The label prop externalizes user-facing text for translation
- No hardcoded strings in the component

## References

- Social Security Number format: https://www.ssa.gov/employer/randomization.html
