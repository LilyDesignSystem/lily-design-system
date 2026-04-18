# TourListItem

## Overview

A single step within a TourList guided tour. Each step represents one
screen or instruction in the tour sequence. The step conditionally shows
or hides based on the current prop, using the hidden attribute and
aria-hidden for proper accessibility. When stepNumber and totalSteps are
provided, progress info ("Step N of M") is appended to the accessible label.

## What it does

One step in a tour guide list.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>...</TourListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for this step via aria-label. |
| `current` | boolean, default false | Whether this step is the currently visible step. |
| `stepNumber` | number, optional | 1-based step number (e.g. 1, 2, 3). |
| `totalSteps` | number, optional | Total number of steps in the tour. |
| `children` | Snippet, required | Step content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Multi-step tour with navigation -->
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
  import TourListItem from "$lib/components/TourListItem/TourListItem.svelte";
</script>

<TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>...</TourListItem>
```

## Keyboard

- None directly -- keyboard behavior comes from child interactive elements

## Accessibility

- role="group" groups the step content semantically
- aria-roledescription="step" identifies the element as a tour step
- aria-label includes step label and optional "Step N of M" progress
- aria-current="step" indicates the currently active step
- aria-hidden="true" and hidden attribute hide inactive steps

## Internationalization

- All user-facing text comes through props
- No hardcoded strings

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA aria-roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
