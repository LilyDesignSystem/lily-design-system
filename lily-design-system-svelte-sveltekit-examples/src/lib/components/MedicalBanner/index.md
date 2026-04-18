# MedicalBanner

## Overview

A headless medical banner for displaying prominent medical information
messages at the top of a page. Renders as a <div role="region"> with
aria-live="polite", data-type for variants, and data-context="medical".
Supports optional dismiss functionality. Commonly used for patient alerts,
clinical notifications, and medical record summaries.

## What it does

A prominent message bar across the top of a page, with medical information.

## When to use

- Use for a top-of-page message that applies to the whole site or section.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<MedicalBanner label="Patient alerts">content</MedicalBanner>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `type` | "info" \| "success" \| "warning" \| "error", default "info" |  |
| `dismissible` | boolean, default false |  |
| `onclose` | () => void, optional | Callback when dismissed. |
| `closeLabel` | string, optional | Accessible label for dismiss button. |
| `children` | Snippet, required | The banner content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MedicalBanner from "$lib/components/MedicalBanner/MedicalBanner.svelte";
</script>

<MedicalBanner label="Patient alerts">content</MedicalBanner>
```

## Keyboard

- Tab: Focus dismiss button (when dismissible)
- Enter/Space: Dismiss the banner

## Accessibility

- role="region" for landmark identification
- aria-live="polite" for announcing content changes
- data-context="medical" for medical context
