# TourList

## Overview

A headless guided walkthrough overlay that presents step-by-step
instructions to users. Useful for onboarding flows, feature tutorials, or
contextual help systems. The consumer provides TourListItem children to
define each step of the tour.

## What it does

An ordered list of tour guide steps.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TourList label="Getting started" bind:active>...</TourList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the tour dialog via aria-label. |
| `active` | boolean, default false | Whether the tour is visible; bindable with bind:active. |
| `children` | Snippet, required | TourListItem elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Multi-step tour -->
<TourList label="Getting started" bind:active>
  <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
    <p>Welcome to the app!</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
    <p>Here are the features.</p>
    <button onclick={() => step--}>Back</button>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
</TourList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TourList from "$lib/components/TourList/TourList.svelte";
</script>

<TourList label="Getting started" bind:active>...</TourList>
```

## Keyboard

- Escape: closes the tour by setting active to false

## Accessibility

- role="dialog" identifies the overlay as a dialog window
- aria-modal="true" indicates the dialog is modal
- aria-label={label} provides an accessible name for the tour
- tabindex="-1" allows the dialog to receive focus for keyboard events

## Internationalization

- The label prop accepts any translated string
- All step content comes through TourListItem children

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
