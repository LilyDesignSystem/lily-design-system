# Input

## Overview

A foundational form input component for text entry with accessible labeling and
two-way value binding. Renders a native <input> element supporting various HTML
input types such as text, email, password, number, search, and more. Provides
required and disabled attributes and spreads additional props for full consumer control.

## What it does

A generic HTML input element.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<Input label="Search" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `value` | string, default "" | Bindable current input value via bind:value. |
| `type` | string, default "text" | HTML input type attribute (e.g., "text", "email", "password", "number"). |
| `required` | boolean, default false | Whether the input is required for form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the input element |  |

## Examples

```svelte
<!-- Basic text input -->
<Input label="Search" bind:value />

<!-- Required name input -->
<Input label="Name" bind:value type="text" required />

<!-- Email input with disabled state -->
<Input label="Email address" bind:value type="email" required disabled={isSubmitting} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Input from "$lib/components/Input/Input.svelte";
</script>

<Input label="Search" bind:value />
```

## Keyboard

- Tab: Focus the input (native browser behavior)
- Standard text editing keys are supported natively

## Accessibility

- aria-label provides an accessible name since there is no built-in visible <label> element
- Consumer can add aria-describedby for linked hint text

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings

## References

- MDN Input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
