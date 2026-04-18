# Progress

## Overview

A headless progress indicator using the native HTML <progress> element with
built-in semantic meaning and accessibility. It supports both determinate
progress (with a known value and maximum) and indeterminate progress (when
value is undefined, indicating an ongoing process of unknown duration).
Commonly used for file uploads, form submissions, loading sequences, and
installation wizards.

## What it does

A horizontal progress bar showing completion.

## When to use

- Use to communicate completion status of a long-running task.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Progress label="Upload progress" value={50} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label describing what process is tracked. |
| `value` | number, default undefined | Current progress value; undefined means indeterminate. |
| `max` | number, default 100 | Maximum value representing 100% completion. |
| `...restProps` | additional HTML attributes spread onto the <progress> |  |

## Examples

```svelte
<!-- Determinate progress at 50% -->
<Progress label="Upload progress" value={50} max={100} />

<!-- Indeterminate loading (no value) -->
<Progress label="Loading" />

<!-- Step-based progress (3 of 5 steps) -->
<Progress label="Installation" value={3} max={5} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Progress from "$lib/components/Progress/Progress.svelte";
</script>

<Progress label="Upload progress" value={50} />
```

## Keyboard

- None — this is a passive display element that does not accept user input.

## Accessibility

- aria-label describes what process the progress bar represents
- The <progress> element implicitly has role="progressbar" with aria-valuenow,
- aria-valuemin, and aria-valuemax managed by the browser

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings

## References

- MDN progress element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
- WAI-ARIA progressbar role: https://www.w3.org/WAI/ARIA/apd/patterns/meter/
