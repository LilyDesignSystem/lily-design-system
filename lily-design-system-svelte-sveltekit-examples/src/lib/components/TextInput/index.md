# TextInput

## Overview

A headless single-line text input that wraps the native HTML <input type="text">
element. Used for entering short text values such as names, titles, or other
brief textual data. The component supports accessible labeling via aria-label
and two-way data binding through a bindable value prop.

## What it does

A single-line text input field <input type="text">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<TextInput label="Full name" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Bindable text value; supports bind:value. |
| `required` | boolean, default false | Whether the field is required. |
| `disabled` | boolean, default false | Whether the field is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required email field -->
<TextInput label="Email" bind:value={email} required />

<!-- Disabled notes field -->
<TextInput label="Notes" bind:value={notes} disabled />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TextInput from "$lib/components/TextInput/TextInput.svelte";
</script>

<TextInput label="Full name" bind:value />
```

## Keyboard

- None beyond native input behavior -- standard text editing keys

## Accessibility

- aria-label={label} provides an accessible name since no visible <label> is included

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
