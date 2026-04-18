# Field

## Overview

A form field wrapper that combines a label, description, and error message
with proper labelling via the for attribute and accessible error announcements.
Works with any input type: text inputs, selects, textareas, checkboxes, and
more. Auto-generates IDs for linking the label to its input and for associating
description and error elements via ARIA attributes.

## What it does

A form field wrapper with label, input, and error message.

## When to use

- Use when you need a form field wrapper with label, input, and error message.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Field label="Name"><input id="name-input" /></Field>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Visible label text. |
| `description` | string, default undefined | Helper text displayed below the label. |
| `error` | string, default undefined | Error message displayed below the input. |
| `required` | boolean, default false | Adds a visual asterisk (hidden from screen readers). |
| `inputId` | string, default undefined | ID of the input to link the label to; auto-generated if omitted. |
| `children` | Snippet, required | Form control (input, select, textarea, etc.). |
| `...restProps` | additional HTML attributes spread onto the outer <div> |  |

## Examples

```svelte
<!-- Field with description -->
<Field label="Name" description="Enter full name">
  <input id="name-input" />
</Field>

<!-- Required field with error -->
<Field label="Email" required error="Email is required">
  <input id="email-input" type="email" />
</Field>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Field from "$lib/components/Field/Field.svelte";
</script>

<Field label="Name"><input id="name-input" /></Field>
```

## Keyboard

- None — passive container; clicking the label focuses the associated input via native for attribute

## Accessibility

- <label for={fieldId}> links the visible label to the input element
- role="alert" on the error paragraph announces errors to screen readers
- aria-hidden="true" on the required asterisk prevents screen reader noise
- data-required attribute on wrapper for consumer CSS styling

## Internationalization

- The label, description, and error props accept any string; consumers provide localized text

## References

- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
- WAI-ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
