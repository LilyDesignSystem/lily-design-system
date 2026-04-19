# SearchInput

## Overview

A headless search field using the native HTML <input type="search"> element.
Provides semantic search meaning and may trigger browser-specific behaviors
such as a clear button, search icon, or search-optimized mobile keyboard.
Commonly used for site-wide search bars, filtering lists, and query entry.

## What it does

An input for entering a search query <input type="search">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<SearchInput label="Search" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `value` | string, default "" | Current search text; bindable with bind:value. |
| `required` | boolean, default false | Whether the field must be filled before form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Required search with binding -->
<SearchInput label="Filter products" bind:value={query} required />

<!-- With placeholder and name -->
<SearchInput label="Search articles" bind:value placeholder="Type to search..." name="q" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SearchInput from "$lib/components/SearchInput/SearchInput.svelte";
</script>

<SearchInput label="Search" bind:value />
```

## Keyboard

- Escape: clears the search field (browser-native behavior for search inputs)
- Enter: submits the containing form (standard input behavior)

## Accessibility

- aria-label provides the accessible name since there is no visible <label> element
- Native <input type="search"> has implicit search semantics

## Internationalization

- The label prop externalizes the accessible name for localization
- Placeholder text should be provided via restProps for localization

## References

- MDN input type="search": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
- WAI-ARIA Search Role: https://www.w3.org/WAI/ARIA/apg/patterns/search/
