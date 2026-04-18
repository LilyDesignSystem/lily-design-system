# MedicalBannerBoxForAdvice

## Overview

A headless component for displaying routine medical record advice information
such as contacts, contexts, care plans, and other advice-level clinical data.
Renders a <div> with role="region", aria-label, and data-type="advice".

## What it does

A medical record banner box for advice information e.g. contacts, contexts, plans, etc.

## When to use

- Use when you need a medical record banner box for advice information e.g. contacts, contexts, plans, etc..

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<MedicalBannerBoxForAdvice label="Care contacts">content</MedicalBannerBoxForAdvice>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `children` | Snippet, required | The advice banner box content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MedicalBannerBoxForAdvice from "$lib/components/MedicalBannerBoxForAdvice/MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBannerBoxForAdvice label="Care contacts">content</MedicalBannerBoxForAdvice>
```

## Keyboard

- None (passive layout element)

## Accessibility

- role="region" for landmark identification
- aria-label provides accessible name
- data-type="advice" for consumer CSS targeting

## Internationalization

- label prop is the only user-facing string; no hardcoded strings
