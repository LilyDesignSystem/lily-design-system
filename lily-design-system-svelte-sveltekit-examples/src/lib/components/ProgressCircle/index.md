# ProgressCircle

## Overview

A headless circular progress indicator that renders a <div> with ARIA
progressbar semantics including aria-valuenow, aria-valuemin, and
aria-valuemax. Unlike a linear progress bar, the progress circle is intended
for radial layout, commonly used for loading indicators, completion
percentages, and dashboard widgets. Consumers provide their own CSS to create
the circular visual representation using the ARIA value attributes.

## What it does

A circular progress indicator.

## When to use

- Use when you need a circular progress indicator.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ProgressCircle label="Upload" value={75} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the progress indicator via aria-label. |
| `value` | number, default 0 | Current progress value. |
| `min` | number, default 0 | Minimum value of the progress range. |
| `max` | number, default 100 | Maximum value of the progress range. |
| `children` | Snippet, optional | Content rendered inside (e.g., percentage text). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Progress circle with percentage text inside -->
<ProgressCircle label="Upload" value={75}>
  <span>75%</span>
</ProgressCircle>

<!-- Progress circle without inner content -->
<ProgressCircle label="Loading" value={30} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ProgressCircle from "$lib/components/ProgressCircle/ProgressCircle.svelte";
</script>

<ProgressCircle label="Upload" value={75} />
```

## Keyboard

- None — this is a passive, read-only display element.

## Accessibility

- role="Progress" identifies the element as a progress indicator
- aria-label provides the accessible name
- aria-valuenow communicates the current progress value
- aria-valuemin and aria-valuemax define the progress range

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings
- Inner content (e.g., percentage) comes through children snippet

## References

- WAI-ARIA Meter Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/meter/
- MDN role="progressbar": https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role
