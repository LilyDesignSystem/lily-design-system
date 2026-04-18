# Tour

## Overview

A tour guide is an outer container for a guided walkthrough experience,
such as for sightseeing, or pathways, or demonstrations, or onboarding.
It wraps a TourList and its TourListItem children, providing
the dialog overlay and keyboard dismissal behavior. When active, it
renders as a modal dialog that traps focus and can be closed with Escape.

## What it does

A tour guide, such as for sightseeing, or pathways, or demonstrations, etc.

## When to use

- Use when you need a tour guide, such as for sightseeing, or pathways, or demonstrations, etc..

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Tour label="Getting started" bind:active>
  <TourList label="Steps">
    <TourListItem label="Welcome" current={step === 0}>...</TourListItem>
  </TourList>
</Tour>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the tour dialog via aria-label. |
| `active` | boolean, default false | Whether the tour is visible; bindable with bind:active. |
| `children` | Snippet, required | TourList and its TourListItem elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Multi-step tour with navigation -->
<Tour label="Onboarding tour" bind:active>
  <TourList label="Tour steps">
    <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
      <p>Welcome to the app!</p>
      <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
      <p>Here are the features.</p>
      <button onclick={() => step--}>Back</button>
      <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Finish" current={step === 2} stepNumber={3} totalSteps={3}>
      <p>You're all set!</p>
      <button onclick={() => active = false}>Done</button>
    </TourListItem>
  </TourList>
</Tour>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Tour from "$lib/components/Tour/Tour.svelte";
</script>

<Tour label="Getting started" bind:active>
  <TourList label="Steps">
    <TourListItem label="Welcome" current={step === 0}>...</TourListItem>
  </TourList>
</Tour>
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
- All step content comes through TourList and TourListItem children

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
