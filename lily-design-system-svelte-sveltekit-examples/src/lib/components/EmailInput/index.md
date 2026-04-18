# EmailInput

## Overview

A headless email input wrapping a native <input type="email"> with accessible
labeling. Provides a streamlined API for basic email collection with required
and disabled state support.

## What it does

An input for entering an email address <input type="email">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<EmailInput label="Your email" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Current email value; bindable. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Basic email input -->
<EmailInput label="Your email" bind:value />

<!-- Required email field -->
<EmailInput label="Contact email" bind:value required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import EmailInput from "$lib/components/EmailInput/EmailInput.svelte";
</script>

<EmailInput label="Your email" bind:value />
```

## Keyboard

- None custom — keyboard behavior provided by the browser-native email input

## Accessibility

- aria-label provides the accessible name since no visible <label> is included
- Native <input type="email"> provides built-in validation

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- MDN input type="email": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
