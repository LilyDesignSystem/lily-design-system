# TabGroup

## Overview

A headless tab list container that provides the ARIA tablist role and
built-in keyboard navigation for tabbed interfaces. It manages arrow key
navigation between tab elements, allowing users to cycle through tabs
with Left/Right arrow keys and jump to first/last with Home/End keys.
The consumer provides tab buttons as children and manages selection state.

## What it does

The TabGroup component.

## When to use

- Use when multiple related child components should be grouped semantically.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TabBar label="Settings">...</TabBar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the tab list via aria-label. |
| `children` | Snippet, required | Tab button elements to render inside the tablist. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Tab list with manual tab buttons -->
<TabBar label="Settings">
  <button role="tab" aria-selected="true">General</button>
  <button role="tab" aria-selected="false">Advanced</button>
</TabBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TabGroup from "$lib/components/TabGroup/TabGroup.svelte";
</script>

<TabBar label="Settings">...</TabBar>
```

## Keyboard

- ArrowRight: moves focus to the next tab (wraps to first)
- ArrowLeft: moves focus to the previous tab (wraps to last)
- Home: moves focus to the first tab
- End: moves focus to the last tab
- Tab: moves focus into and out of the tab list

## Accessibility

- role="tablist" identifies the container as a list of tabs
- aria-label={label} provides an accessible name for the tab list
- Child tabs should have role="tab" and aria-selected attributes
- Associated tab panels should have role="tabpanel" with aria-labelledby

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA Authoring Practices - Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
