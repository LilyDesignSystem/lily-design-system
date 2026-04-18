# ProgressSpinner

## Overview

A headless indeterminate loading indicator that renders a <div> with
role="status" and aria-live="polite" to announce the loading state to screen
readers without interrupting the user. Unlike ProgressCircle which shows a
specific percentage, ProgressSpinner indicates an ongoing process of unknown
duration. Consumers provide their own spinning animation via CSS. Commonly
used for data fetching, form submissions, and async operations.

## What it does

An indeterminate spinning progress indicator.

## When to use

- Use to signal that work is in progress and the UI is not idle.

## When not to use

- Do not use for operations that complete almost instantly — avoid spinner flicker.

## Usage

```svelte
<ProgressSpinner label="Loading data" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the loading state via aria-label. |
| `children` | Snippet, optional | Content rendered inside (e.g., "Loading..." text). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Simple spinner with no visible text -->
<ProgressSpinner label="Loading data" />

<!-- Spinner with visible loading text -->
<ProgressSpinner label="Loading search results">
  <span>Loading...</span>
</ProgressSpinner>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ProgressSpinner from "$lib/components/ProgressSpinner/ProgressSpinner.svelte";
</script>

<ProgressSpinner label="Loading data" />
```

## Keyboard

- None — this is a passive, read-only status indicator with no interactive behavior.

## Accessibility

- role="status" identifies the element as a status region for non-urgent updates
- aria-label describes what is loading
- aria-live="polite" ensures content changes are announced without interrupting

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings
- Optional visible text comes through children snippet

## References

- WAI-ARIA status role: https://www.w3.org/WAI/ARIA/apd/roles/status/
- MDN aria-live: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
