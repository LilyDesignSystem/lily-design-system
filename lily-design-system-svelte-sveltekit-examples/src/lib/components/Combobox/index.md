# Combobox

## Overview

A headless combobox combining a text input with a dropdown listbox of
suggestions for autocomplete or type-ahead search experiences. Users type into
the input to filter suggestions, then select from matching options in the
dropdown. Commonly used for search fields, address inputs, tag selectors, and
choosing from large option sets.

## What it does

A text input combined with a dropdown list for filtering options.

## When to use

- Use when you need a text input combined with a dropdown list for filtering options.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Combobox label="Search" bind:value bind:open>
  <div role="option" tabindex="-1">Option 1</div>
</Combobox>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label on both input and listbox. |
| `value` | string, default "" | Bindable current text input value. |
| `open` | boolean, default false | Bindable dropdown visibility state. |
| `children` | Snippet, required | Option elements rendered inside the listbox dropdown. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## Examples

```svelte
<!-- Combobox with filtered options -->
<Combobox label="Select a fruit" bind:value bind:open>
  {#each filtered as option}
    <div role="option" tabindex="-1" onclick={() => { value = option; open = false; }}>
      {option}
    </div>
  {/each}
</Combobox>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Combobox from "$lib/components/Combobox/Combobox.svelte";
</script>

<Combobox label="Search" bind:value bind:open>
  <div role="option" tabindex="-1">Option 1</div>
</Combobox>
```

## Keyboard

- Escape: Close the dropdown listbox

## Accessibility

- role="combobox" on the input identifies it as a combobox widget
- aria-expanded reflects the open state for screen readers
- aria-controls links the input to the associated listbox by ID
- aria-autocomplete="list" indicates suggestions are provided via a list
- role="listbox" on the dropdown identifies selectable options

## Internationalization

- The label prop provides the accessible name; no hardcoded strings
- All option content is provided by consumers through the children snippet

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
