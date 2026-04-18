# MedicalBannerBoxForDanger

## Overview

A headless component for displaying critical medical record danger information
such as reactions, warnings, alarms, and other danger-level clinical alerts.
Renders a <div> with role="region", aria-label, and data-type="danger".

## What it does

A medical record banner box for danger information e.g. reactions, warnings, alarms, etc.

## When to use

- Use when you need a medical record banner box for danger information e.g. reactions, warnings, alarms, etc..

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<MedicalBannerBoxForDanger label="Allergies">content</MedicalBannerBoxForDanger>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `children` | Snippet, required | The danger banner box content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MedicalBannerBoxForDanger from "$lib/components/MedicalBannerBoxForDanger/MedicalBannerBoxForDanger.svelte";
</script>

<MedicalBannerBoxForDanger label="Allergies">content</MedicalBannerBoxForDanger>
```

## Keyboard

- None (passive layout element)

## Accessibility

- role="region" for landmark identification
- aria-label provides accessible name
- data-type="danger" for consumer CSS targeting

## Internationalization

- label prop is the only user-facing string; no hardcoded strings
