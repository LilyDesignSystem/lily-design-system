# Textarea

## Overview

A headless multi-line text input that wraps the native HTML <textarea>
element. Used for comments, messages, descriptions, feedback, code input,
and any scenario where users need to enter extended text content. Unlike
a single-line TextInput, Textarea provides a larger, scrollable text area
that supports multiple lines.

## What it does

A multi-line text input area.

## When to use

- Use when you need a multi-line text input area.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Textarea label="Comments" bind:value rows={5} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Bindable text content; supports bind:value. |
| `rows` | number, default undefined | Number of visible text rows. |
| `required` | boolean, default false | Whether the textarea is required. |
| `disabled` | boolean, default false | Whether the textarea is disabled. |
| `...restProps` | additional HTML attributes spread onto the <textarea> |  |

## Examples

```svelte
<!-- Required description field -->
<Textarea label="Description" bind:value={description} required />

<!-- Read-only notes -->
<Textarea label="Notes" bind:value disabled={isReadOnly} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Textarea from "$lib/components/Textarea/Textarea.svelte";
</script>

<Textarea label="Comments" bind:value rows={5} />
```

## Keyboard

- Tab: moves focus to and from the textarea (native behavior)
- Enter: inserts a new line (does not submit forms)
- All standard text editing keys function normally

## Accessibility

- aria-label={label} provides an accessible name since no visible <label> is included

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- MDN textarea element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
