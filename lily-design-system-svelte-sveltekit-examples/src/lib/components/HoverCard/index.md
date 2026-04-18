# HoverCard

## Overview

A hover card that displays supplementary content when triggered, typically by a
hover or focus interaction on a trigger element. It conditionally renders a container
with role="tooltip" when the open prop is true. Useful for user profile previews,
link previews, contextual help, or any popover-style content.

## What it does

A card that appears on hover over a trigger element.

## When to use

- Use to group related content in a single surfaceable container.
- Use for supplemental, on-demand information tied to a trigger element.

## When not to use

- Do not nest cards deeply or use a card as a generic container when a plain element suffices.

## Usage

```svelte
<HoverCard label="User info" bind:open>{children}</HoverCard>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the hover card via aria-label. |
| `open` | boolean, default false | Whether the hover card is visible; bindable with bind:open. |
| `children` | Snippet, required | Content to display inside the hover card. |
| `...restProps` | additional HTML attributes spread onto the container div |  |

## Examples

```svelte
<!-- Hover card triggered by mouse/focus events on a button -->
<button
  onmouseenter={() => open = true}
  onmouseleave={() => open = false}
  onfocus={() => open = true}
  onblur={() => open = false}
>Hover me</button>
<HoverCard label="User info" bind:open>
  <p>Profile details here</p>
</HoverCard>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import HoverCard from "$lib/components/HoverCard/HoverCard.svelte";
</script>

<HoverCard label="User info" bind:open>{children}</HoverCard>
```

## Keyboard

- None at the component level — consumer manages focus-based visibility on the trigger element

## Accessibility

- role="tooltip" identifies the hover card as supplementary descriptive content
- aria-label provides an accessible name describing the hover card content
- Consumer should link the trigger to the tooltip via aria-describedby

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings
- All content comes through the children snippet

## References

- WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
