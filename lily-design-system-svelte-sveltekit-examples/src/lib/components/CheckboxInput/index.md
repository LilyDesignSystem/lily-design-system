# CheckboxInput

## Overview

A minimal headless wrapper around the native HTML <input type="checkbox">
element. Unlike the Checkbox component which includes a wrapping <label>,
CheckboxInput uses aria-label for accessibility, giving consumers full control
over label placement and visual presentation. Ideal for custom layouts where
the label position, custom indicators, or complex form integration requires
consumer control.

## What it does

A checkbox input for toggling a boolean value <input type="checkbox">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<CheckboxInput label="Accept terms" bind:checked />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `checked` | boolean, default false, bindable | Whether the checkbox is checked. |
| `label` | string, required | Accessible name applied via aria-label. |
| `disabled` | boolean, default false | Whether the checkbox is disabled. |
| `required` | boolean, default false | Whether the checkbox is required for form submission. |
| `name` | string, optional | Form field name attribute. |
| `id` | string, optional | Element id attribute. |
| `value` | string, optional | Value attribute for form submission. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Checkbox with external label -->
<CheckboxInput label="Subscribe to newsletter" bind:checked={subscribed} disabled={!hasEmail} />

<!-- Required checkbox in a form -->
<CheckboxInput label="Required field" bind:checked required name="agree" value="yes" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CheckboxInput from "$lib/components/CheckboxInput/CheckboxInput.svelte";
</script>

<CheckboxInput label="Accept terms" bind:checked />
```

## Keyboard

- Space: Toggle the checkbox checked state (native browser behavior)
- Tab: Move focus to and from the checkbox (native browser behavior)

## Accessibility

- aria-label provides an accessible name since there is no visible <label> element
- Implicit checkbox role from <input type="checkbox">

## Internationalization

- Label text comes through the label prop; no hardcoded strings

## References

- MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
