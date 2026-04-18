# SegmentGroupItem

## Overview

A single segment option within a SegmentGroup (role="radiogroup"). Renders
as a <button> with role="radio" and aria-checked to indicate selection state.
Uses roving tabindex so only the checked item receives tab focus. Used inside
SegmentGroup to build custom segmented controls like view mode toggles.

## What it does

One selectable segment in a segment group.

## When to use

- Use when you need one selectable segment in a segment group.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<SegmentGroupItem checked={true} value="grid">Grid</SegmentGroupItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `checked` | boolean, default false | Whether this segment is currently selected. |
| `value` | string, default "" | Value associated with this segment, exposed as data-value. |
| `disabled` | boolean, default false | Whether the segment is disabled. |
| `children` | Snippet, required | Label content to render inside the button. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Inside a SegmentGroup with click handlers -->
<SegmentGroup label="View">
  <SegmentGroupItem checked={mode === 'grid'} value="grid" onclick={() => mode = 'grid'}>Grid</SegmentGroupItem>
  <SegmentGroupItem checked={mode === 'list'} value="list" onclick={() => mode = 'list'}>List</SegmentGroupItem>
</SegmentGroup>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SegmentGroupItem from "$lib/components/SegmentGroupItem/SegmentGroupItem.svelte";
</script>

<SegmentGroupItem checked={true} value="grid">Grid</SegmentGroupItem>
```

## Keyboard

- Tab: focus moves to the checked segment (roving tabindex)
- Space/Enter: activates the focused segment (native button behavior)
- Arrow Left/Right: consumer should implement on the parent SegmentGroup

## Accessibility

- role="radio" identifies this button as a radio-like option within a radiogroup
- aria-checked indicates whether this segment is selected (true/false)
- Roving tabindex: checked item has tabindex="0", others have tabindex="-1"
- data-value exposes the segment value for CSS or JS queries

## Internationalization

- Label content comes through the children snippet for localization

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
