# MedicalBannerBox

## Overview

A headless layout component designed to be placed inside a MedicalBanner.
Renders a <div> with data-context="medical" that the consumer styles with
flexbox horizontal layout to arrange medical banner content items side by side.

## What it does

A medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information.

## When to use

- Use when you need a medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<MedicalBannerBox>content</MedicalBannerBox>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, optional | Accessible name via aria-label. |
| `children` | Snippet, required | The medical banner box content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MedicalBannerBox from "$lib/components/MedicalBannerBox/MedicalBannerBox.svelte";
</script>

<MedicalBannerBox>content</MedicalBannerBox>
```

## Keyboard

- None (passive layout element)

## Accessibility

- No additional ARIA required; parent MedicalBanner provides landmark
- Optional aria-label via label prop
- data-context="medical" for medical context
