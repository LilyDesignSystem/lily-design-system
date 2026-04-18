# PinInputDiv

## Overview

A headless PIN input that renders a group of single-character numeric inputs
for entering PINs, verification codes, or one-time passwords (OTPs). Each
digit occupies its own input field, creating a segmented entry experience that
communicates the expected code length. Focus auto-advances on digit entry and
retreats on Backspace. Commonly used in two-factor authentication, SMS
verification, and secure PIN entry interfaces.

## What it does

A series of single-digit inputs for entering a PIN or OTP code.

## When to use

- Use when you need a series of single-digit inputs for entering a PIN or OTP code.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<PinInputDiv label="Enter PIN" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the group of inputs via aria-label. |
| `length` | number, default 4 | Number of digit inputs to render. |
| `value` | string, default "" | Bindable combined string of all entered digits. |
| `disabled` | boolean, default false | Whether all inputs are disabled. |
| `...restProps` | additional HTML attributes spread onto the group <div> |  |

## Examples

```svelte
<!-- 4-digit PIN input -->
<PinInputDiv label="Enter PIN" bind:value={pin} />

<!-- 6-digit verification code -->
<PinInputDiv label="Verification Code" length={6} bind:value={code} />

<!-- Disabled PIN input -->
<PinInputDiv label="Locked PIN" disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import PinInputDiv from "$lib/components/PinInputDiv/PinInputDiv.svelte";
</script>

<PinInputDiv label="Enter PIN" bind:value />
```

## Keyboard

- Digit entry: enters value and auto-focuses next input
- Backspace: clears current digit or moves to previous input if empty
- ArrowLeft: focuses previous input
- ArrowRight: focuses next input
- Tab: standard tab navigation in/out of the group

## Accessibility

- role="group" with aria-label on the container identifies the PIN group
- Each input has aria-label="Digit X of Y" for positional context
- inputmode="numeric" ensures numeric keyboard on mobile devices
- maxlength="1" restricts each input to a single character

## Internationalization

- The label prop is consumer-provided for the group name
- Individual "Digit X of Y" labels are currently hardcoded in English
- No other hardcoded user-facing strings

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
