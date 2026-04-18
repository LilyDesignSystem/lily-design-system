# Label

## Overview

A headless <label> element that provides a descriptive name or instruction
for an associated form control such as an input field, checkbox, or radio
button. When a user clicks the label text, the browser focuses or activates
the linked form control. Screen readers announce the label when the
associated control receives focus.

## What it does

A label associated with a form input.

## When to use

- Use when you need a label associated with a form input.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Label for="email">Email address</Label>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `for` | string, optional | The id of the associated form control (HTML for attribute). |
| `children` | Snippet, required | The label text content. |
| `...restProps` | additional HTML attributes spread onto the <label> |  |

## Examples

```svelte
<!-- Label linked to a form control by ID -->
<Label for="email">Email address</Label>
<input id="email" type="email" />

<!-- Label wrapping a form control (no for attribute needed) -->
<Label>
  Email address
  <input type="email" />
</Label>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Label from "$lib/components/Label/Label.svelte";
</script>

<Label for="email">Email address</Label>
```

## Keyboard

- None — clicking the label focuses or activates its associated form
- control via native browser behavior.

## Accessibility

- Native <label> element with for attribute provides an implicit accessible
- name for the linked form control
- No additional ARIA attributes needed; semantic HTML <label> is fully
- recognized by assistive technology

## Internationalization

- All text content comes through the children snippet
- No hardcoded user-facing strings

## References

- WAI Forms Tutorial - Labels: https://www.w3.org/WAI/tutorials/forms/labels/
- HTML label element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
