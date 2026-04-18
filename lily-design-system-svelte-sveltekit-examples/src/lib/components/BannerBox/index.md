# BannerBox

## Overview

A headless layout component designed to be placed inside a Banner component.
Renders a <div> that the consumer styles with flexbox horizontal layout
(display: flex; flex-direction: row) to arrange banner content items side by
side, such as a message and action buttons.

## What it does

A banner box that is inside a banner component, using flexbox horizontal.

## When to use

- Use when you need a banner box that is inside a banner component, using flexbox horizontal.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<BannerBox>content</BannerBox>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, optional | Accessible name via aria-label. |
| `children` | Snippet, required | The banner box content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<Banner>
  <BannerBox>
    <span>Important announcement</span>
    <button>Learn more</button>
  </BannerBox>
</Banner>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import BannerBox from "$lib/components/BannerBox/BannerBox.svelte";
</script>

<BannerBox>content</BannerBox>
```

## Keyboard

- None (passive layout element)

## Accessibility

- No additional ARIA required; parent Banner provides landmark and aria-live
- Optional aria-label via label prop

## Internationalization

- All text comes through children; no hardcoded strings

## References

- CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
