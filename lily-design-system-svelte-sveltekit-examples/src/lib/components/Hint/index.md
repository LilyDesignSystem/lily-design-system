# Hint

## Overview

A hint provides subtle, contextual guidance text associated with a form control.
Typically displayed near an input field to clarify expected formats, explain
functionality, or offer examples. Renders a <p> element with an optional id for
linking to a form control via aria-describedby on the input element.

## What it does

Hint text providing guidance for a form field.

## When to use

- Use when you need hint text providing guidance for a form field.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Hint id="email-hint">Enter your work email</Hint>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `id` | string, default undefined | ID for linking via aria-describedby on the associated form control. |
| `children` | Snippet, required | Hint text content. |
| `...restProps` | additional HTML attributes spread onto the p element |  |

## Examples

```svelte
<!-- Hint linked to an input via aria-describedby -->
<Hint id="email-hint">Enter your work email</Hint>
<input aria-describedby="email-hint" />

<!-- Password hint -->
<Hint id="password-hint">Must be at least 8 characters</Hint>
<input type="password" aria-describedby="password-hint" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hint from "$lib/components/Hint/Hint.svelte";
</script>

<Hint id="email-hint">Enter your work email</Hint>
```

## Keyboard

- None — this is a passive text element; announced by screen readers when the associated control receives focus

## Accessibility

- The id attribute provides a target for aria-describedby on the associated form control
- Screen readers announce the hint text when the linked input receives focus

## Internationalization

- All text content comes through the children snippet; no hardcoded user-facing strings

## References

- WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/
