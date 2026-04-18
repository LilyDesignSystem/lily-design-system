# TagInput

## Overview

A headless text input for adding tags to a collection. When the user types
a value and presses Enter, the component calls the onadd callback with the
trimmed text and automatically clears the input, providing a streamlined
tag entry experience. Commonly used alongside TagGroup for tag management
interfaces such as adding skills, keywords, or labels.

## What it does

An input for adding and removing tags.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<TagInput label="Add tag" bind:value onadd={(tag) => tags.push(tag)} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the input via aria-label. |
| `value` | string, default "" | Current input text; bindable with bind:value. |
| `onadd` | (value: string) => void, optional | Callback fired when Enter is pressed with non-empty trimmed value. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Tag input with add handler -->
<TagInput label="Add skill" bind:value onadd={(skill) => skills = [...skills, skill]} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TagInput from "$lib/components/TagInput/TagInput.svelte";
</script>

<TagInput label="Add tag" bind:value onadd={(tag) => tags.push(tag)} />
```

## Keyboard

- Enter: when the input has a non-empty trimmed value, calls onadd and clears input

## Accessibility

- aria-label={label} provides an accessible name for the text input

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA textbox role: https://www.w3.org/TR/wai-aria-1.2/#textbox
