# SelectWithExtras

## Overview

A headless enhanced select that wraps a native <select> element with optional
content areas before and after it. Allows consumers to place supplementary
elements such as icons, flags, status indicators, or helper text alongside
the select without breaking its accessibility. Preserves full native select
behavior including keyboard navigation and form submission.

## What it does

A select dropdown with additional features like search or groups.

## When to use

- Use when you need a select dropdown with additional features like search or groups.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<SelectWithExtras label="Country" bind:value>
  <option value="us">USA</option>
</SelectWithExtras>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the select via aria-label. |
| `value` | string, default "" | Currently selected value; bindable with bind:value. |
| `required` | boolean, default false | Whether the select is required for form validation. |
| `disabled` | boolean, default false | Whether the select is disabled. |
| `children` | Snippet, required | <option> elements for the select. |
| `before` | Snippet, optional | Content rendered before the select element. |
| `after` | Snippet, optional | Content rendered after the select element. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## Examples

```svelte
<!-- With before snippet for a flag icon -->
<SelectWithExtras label="Country" bind:value>
  {#snippet before()}<span>Flag:</span>{/snippet}
  <option value="us">USA</option>
  <option value="uk">United Kingdom</option>
</SelectWithExtras>

<!-- With after snippet for a unit label -->
<SelectWithExtras label="Unit" bind:value={unit}>
  {#snippet after()}<span>selected</span>{/snippet}
  <option value="kg">Kilograms</option>
  <option value="lb">Pounds</option>
</SelectWithExtras>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SelectWithExtras from "$lib/components/SelectWithExtras/SelectWithExtras.svelte";
</script>

<SelectWithExtras label="Country" bind:value>
  <option value="us">USA</option>
</SelectWithExtras>
```

## Keyboard

- Tab: moves focus to the native select element
- Arrow Up/Down: navigates between options (native select behavior)
- Space/Enter: opens the dropdown (native select behavior)
- Escape: closes the dropdown (native select behavior)

## Accessibility

- aria-label on the <select> provides the accessible name
- Native <select> semantics are fully preserved

## Internationalization

- The label prop externalizes the accessible name for localization
- Before/after snippet content is consumer-provided for localization

## References

- HTML <select> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
