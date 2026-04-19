# Expander

## Overview

An expander that shows or hides additional content with a toggle button.
Similar to native <details>/<summary> but uses a <button> trigger with
aria-expanded and aria-controls for full control over behavior. Useful for
FAQ sections, collapsible panels, settings groups, and progressive disclosure.

## What it does

A control that expands to reveal more content.

## When to use

- Use when you need a control that expands to reveal more content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Expander label="Show details" bind:expanded>Content</Expander>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Button text and accessible name for both the button and content region. |
| `expanded` | boolean, default false | Whether the content is visible; bindable. |
| `children` | Snippet, required | Expandable content rendered when expanded is true. |
| `...restProps` | additional HTML attributes spread onto the outer <div> wrapper |  |

## Examples

```svelte
<!-- Basic expander -->
<Expander label="Show details" bind:expanded>
  <p>Details here...</p>
</Expander>

<!-- Advanced settings panel -->
<Expander label="Advanced settings" bind:expanded={showAdvanced}>
  <form>...</form>
</Expander>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Expander from "$lib/components/Expander/Expander.svelte";
</script>

<Expander label="Show details" bind:expanded>Content</Expander>
```

## Keyboard

- Enter: toggles the expander open/closed (native button behavior)
- Space: toggles the expander open/closed (native button behavior)
- Tab: moves focus to/from the toggle button

## Accessibility

- aria-expanded on the button indicates whether content is visible
- aria-controls references the ID of the expandable content region
- role="region" on the content container identifies the expandable area
- aria-label on the content region provides an accessible name

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
