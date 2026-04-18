# SegmentGroup

## Overview

A headless segmented control group that uses the ARIA radiogroup role to
contain a set of mutually exclusive options. Renders a <div> with
role="radiogroup" and expects children to be SegmentGroupItem buttons
(or buttons with role="radio" and aria-checked). Used for view mode toggles,
filter selections, display density controls, and similar single-select UIs.

## What it does

A group of mutually exclusive segment options.

## When to use

- Use when multiple related child components should be grouped semantically.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<SegmentGroup label="View">
  <button role="radio" aria-checked="true">Grid</button>
  <button role="radio" aria-checked="false">List</button>
</SegmentGroup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the segment group via aria-label. |
| `children` | Snippet, required | Segment button elements to render inside the group. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- With SegmentGroupItem children -->
<SegmentGroup label="Display mode">
  <SegmentGroupItem checked={mode === 'grid'} value="grid">Grid</SegmentGroupItem>
  <SegmentGroupItem checked={mode === 'list'} value="list">List</SegmentGroupItem>
</SegmentGroup>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SegmentGroup from "$lib/components/SegmentGroup/SegmentGroup.svelte";
</script>

<SegmentGroup label="View">
  <button role="radio" aria-checked="true">Grid</button>
  <button role="radio" aria-checked="false">List</button>
</SegmentGroup>
```

## Keyboard

- Tab: moves focus into the segment group
- Arrow Left/Right: consumer should implement navigation between segments
- Space/Enter: consumer should implement activation of the focused segment

## Accessibility

- role="radiogroup" identifies the container as mutually exclusive radio-like options
- aria-label provides an accessible name for the group
- Children should use role="radio" and aria-checked attributes

## Internationalization

- The label prop externalizes the accessible label string

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
