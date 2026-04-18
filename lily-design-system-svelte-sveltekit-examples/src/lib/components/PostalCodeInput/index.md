# PostalCodeInput

## Overview

A headless text input for entering postal or ZIP codes with
autocomplete="postal-code" for browser autofill support. It renders a native
<input type="text"> (not type="number", since postal codes may contain letters
or dashes) with a bindable value for two-way data binding. Commonly used in
address forms, checkout flows, shipping calculators, and location-based inputs.
Pairs with PostalCodeView for the Input/View pattern.

## What it does

An input for entering a postal or ZIP code.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<PostalCodeInput label="Postal code" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Current postal code value; bindable with bind:value. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Basic postal code input -->
<PostalCodeInput label="Postal code" bind:value />

<!-- Required ZIP code input -->
<PostalCodeInput label="ZIP code" bind:value={zipCode} required />

<!-- UK postcode with placeholder -->
<PostalCodeInput label="Postcode" bind:value={postcode} placeholder="SW1A 1AA" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import PostalCodeInput from "$lib/components/PostalCodeInput/PostalCodeInput.svelte";
</script>

<PostalCodeInput label="Postal code" bind:value />
```

## Keyboard

- None beyond native input behavior — standard text editing keys
- (typing, backspace, selection, clipboard-copy-button shortcuts) handled by the browser.

## Accessibility

- aria-label provides an accessible name since no visible <label> is included
- autocomplete="postal-code" hints browser autofill for postal code fields

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings
- Consumer can pass pattern, placeholder, and maxlength via restProps for locale-specific formats

## References

- HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
