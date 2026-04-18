# EditableForm

## Overview

An editable form that wraps inline editing functionality in a <form> element,
providing submit and cancel semantics with keyboard support. The form is only
rendered when the editing prop is true. Useful for editing records in place,
such as updating profiles, renaming items, or modifying settings.

## What it does

A form wrapper for inline editing of content.

## When to use

- Use when you need a form wrapper for inline editing of content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<EditableForm label="Edit profile" bind:editing onsubmit={save}>
  <input name="name" />
  <button type="submit">Save</button>
</EditableForm>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the form. |
| `editing` | boolean, default false | Whether the form is in edit mode; bindable. |
| `onsubmit` | (event: SubmitEvent) => void, default undefined | Callback when the form is submitted. |
| `oncancel` | () => void, default undefined | Callback when editing is cancelled. |
| `children` | Snippet, required | Form content (inputs, buttons, etc.). |
| `...restProps` | additional HTML attributes spread onto the <form> element |  |

## Examples

```svelte
<!-- Basic editable form -->
<EditableForm label="Edit profile" bind:editing onsubmit={save}>
  <input name="name" value={name} />
  <button type="submit">Save</button>
</EditableForm>

<!-- With cancel callback and cancel button -->
<EditableForm label="Rename item" bind:editing onsubmit={rename} oncancel={revert}>
  <input name="title" value={title} />
  <button type="submit">OK</button>
  <button type="button" onclick={() => editing = false}>Cancel</button>
</EditableForm>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import EditableForm from "$lib/components/EditableForm/EditableForm.svelte";
</script>

<EditableForm label="Edit profile" bind:editing onsubmit={save}>
  <input name="name" />
  <button type="submit">Save</button>
</EditableForm>
```

## Keyboard

- Enter: submits the form (native behavior), exits edit mode, calls onsubmit
- Escape: cancels editing, exits edit mode, calls oncancel

## Accessibility

- aria-label provides the accessible name for the form
- tabindex="-1" allows programmatic focus management

## Internationalization

- The label prop accepts any string; consumers provide localized text
- All button and input labels come from consumer-provided children

## References

- WAI-ARIA Form Role: https://www.w3.org/WAI/ARIA/apd/roles/form/
