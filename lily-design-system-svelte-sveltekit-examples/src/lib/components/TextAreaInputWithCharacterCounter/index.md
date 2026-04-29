# TextAreaInputWithCharacterCounter

## Overview

A headless component that wraps a native <textarea> and a character counter
caption inside a <div>. The counter displays "[number] of [maximum] characters"
below the text-area-input and updates reactively as the user types. Useful for
feedback forms, comment fields, bio inputs, and any interface with a character limit.

## What it does

A multi-line text area with a caption below that is a character counter "[number] of [maximum] characters".

## When to use

- Use when you need a multi-line text area with a caption below that is a character counter "[number] of [maximum] characters".

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TextAreaInputWithCharacterCounter label="Feedback" maxLength={500} bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the text-area-input via aria-label. |
| `value` | string, default "" | Bindable text-area-input value. |
| `maxLength` | number, required | Maximum number of characters allowed. |
| `counterTemplate` | string, default "{count} of {max} characters" | Counter text template. |
| `rows` | number, optional | Number of visible text rows. |
| `placeholder` | string, optional | Placeholder text for the text-area-input. |
| `required` | boolean, default false | Whether the text-area-input is required. |
| `disabled` | boolean, default false | Whether the text-area-input is disabled. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TextAreaInputWithCharacterCounter from "$lib/components/TextAreaInputWithCharacterCounter/TextAreaInputWithCharacterCounter.svelte";
</script>

<TextAreaInputWithCharacterCounter label="Feedback" maxLength={500} bind:value />
```

## Keyboard

- Tab: Focus the text-area-input (native browser behavior)
- Standard text-area-input keyboard interactions

## Accessibility

- aria-label on the text-area-input provides accessible name
- aria-describedby links text-area-input to the counter
- aria-live="polite" on counter announces updates to screen readers

## Internationalization

- counterTemplate prop allows full customization of counter text
- {count} and {max} placeholders are replaced with actual values

## References

- MDN text-area-input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input
