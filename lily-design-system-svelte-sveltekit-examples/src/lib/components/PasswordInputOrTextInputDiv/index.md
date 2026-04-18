# PasswordInputOrTextInputDiv

## Overview

A headless password input with an optional show/hide toggle button. It renders
a wrapper <div> containing an <input> that dynamically switches between
type="password" and type="text", plus a toggle button with aria-pressed state.
Includes autocomplete="current-password" for browser password manager support.
Commonly used in login forms, registration forms, and account settings.

## What it does

An input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle.

## When to use

- Use when you need an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<PasswordInputOrTextInputDiv label="Password" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the password input via aria-label. |
| `value` | string, default "" | Current password value; bindable with bind:value. |
| `showToggle` | boolean, default true | Whether to render the show/hide toggle button. |
| `toggleLabel` | string, default "Show password" | Accessible label for the toggle button. |
| `required` | boolean, default false | Whether the input is required. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## Examples

```svelte
<!-- Password input with toggle (default) -->
<PasswordInputOrTextInputDiv label="Password" bind:value />

<!-- Password input without toggle -->
<PasswordInputOrTextInputDiv label="Password" bind:value showToggle={false} />

<!-- Custom toggle label for internationalization -->
<PasswordInputOrTextInputDiv label="Mot de passe" bind:value toggleLabel="Afficher le mot de passe" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import PasswordInputOrTextInputDiv from "$lib/components/PasswordInputOrTextInputDiv/PasswordInputOrTextInputDiv.svelte";
</script>

<PasswordInputOrTextInputDiv label="Password" bind:value />
```

## Keyboard

- Enter/Space on the toggle button: toggles password visibility

## Accessibility

- aria-label on the input provides the accessible name
- aria-label on the toggle button describes its purpose
- aria-pressed on the toggle button indicates current visibility state
- autocomplete="current-password" enables browser password manager integration

## Internationalization

- The label and toggleLabel props are the only user-facing strings
- Default toggleLabel is "Show password"; override for other locales
- No other hardcoded user-facing strings

## References

- HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
