# TextInputWithSearch

## Overview

A headless component that wraps a native <input type="text"> and
<button type="button"> inside a <div role="search">. The search button
triggers a callback with the current input value. Pressing Enter in the
input also triggers the search. Useful for search bars, filter inputs,
lookup fields, and any interface with an explicit search action.

## What it does

A single-line text input field <input type="text"> with search capability.

## When to use

- Use when you need a single-line text input field <input type="text"> with search capability.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TextInputWithSearch label="Site search" onsearch={handleSearch} bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the search region via aria-label. |
| `inputLabel` | string, default "Search" | Accessible name for the text input. |
| `searchLabel` | string, default "Search" | Accessible label and text for the search button. |
| `value` | string, default "" | Bindable text input value. |
| `placeholder` | string, optional | Placeholder text for the input. |
| `onsearch` | (value: string) => void, optional | Callback when search is triggered. |
| `required` | boolean, default false | Whether the input is required. |
| `disabled` | boolean, default false | Whether the input and button are disabled. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TextInputWithSearch from "$lib/components/TextInputWithSearch/TextInputWithSearch.svelte";
</script>

<TextInputWithSearch label="Site search" onsearch={handleSearch} bind:value />
```

## Keyboard

- Tab: Moves focus between input and search button
- Enter in input: Triggers search
- Enter/Space on button: Triggers search

## Accessibility

- role="search" on wrapper for search landmark
- aria-label on region, input, and button

## Internationalization

- label, inputLabel, searchLabel, placeholder are the only user-facing strings

## References

- WAI-ARIA search role: https://www.w3.org/TR/wai-aria-1.2/#search
