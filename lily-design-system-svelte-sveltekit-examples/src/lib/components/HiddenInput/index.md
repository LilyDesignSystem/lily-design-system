# HiddenInput

## Overview

A hidden form input that renders a native <input type="hidden"> element for passing
data in forms that should not be visible or editable by the user. Useful for including
hidden form values such as CSRF tokens, record IDs, or other metadata that must be
submitted with a form but has no visual presence.

## What it does

A hidden input for including data in form submission <input type="hidden">.

## When to use

- Use when you need a hidden input for including data in form submission <input type="hidden">.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<HiddenInput name="csrf" value={token} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `name` | string, required | The form field name attribute. |
| `value` | string, default "" | The hidden input value. |
| `...restProps` | additional HTML attributes spread onto the input element |  |

## Examples

```svelte
<!-- CSRF token hidden input -->
<HiddenInput name="csrf" value={token} />

<!-- Record ID hidden input -->
<HiddenInput name="record_id" value={id} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import HiddenInput from "$lib/components/HiddenInput/HiddenInput.svelte";
</script>

<HiddenInput name="csrf" value={token} />
```

## Keyboard

- None — hidden inputs are not visible or focusable

## Accessibility

- No ARIA attributes needed because hidden inputs are not perceivable by any user

## Internationalization

- No user-facing strings; name and value are programmatic data

## References

- HTML hidden input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden
