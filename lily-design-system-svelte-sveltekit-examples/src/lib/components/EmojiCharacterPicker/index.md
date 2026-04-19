# EmojiCharacterPicker

## Overview

A grid of selectable emoji characters for browsing and selecting emoji.
Renders a <div> with role="grid" and an accessible label. Commonly used
in messaging apps, social media, comment systems, and rich text editors.
The consumer provides grid content, selection logic, and category navigation.

## What it does

A picker for browsing and selecting emoji characters.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<EmojiCharacterPicker label="Choose an emoji">
  <div role="row"><button role="gridcell">😀</button></div>
</EmojiCharacterPicker>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the picker. |
| `children` | Snippet, required | The grid content containing emoji characters. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Emoji picker with row of characters -->
<EmojiCharacterPicker label="Choose an emoji">
  <div role="row">
    <button role="gridcell">😀</button>
    <button role="gridcell">😂</button>
    <button role="gridcell">😍</button>
  </div>
</EmojiCharacterPicker>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import EmojiCharacterPicker from "$lib/components/EmojiCharacterPicker/EmojiCharacterPicker.svelte";
</script>

<EmojiCharacterPicker label="Choose an emoji">
  <div role="row"><button role="gridcell">😀</button></div>
</EmojiCharacterPicker>
```

## Keyboard

- None built-in — consumer should implement grid keyboard navigation
- (arrow keys for cell movement, Enter/Space for selection)

## Accessibility

- role="grid" identifies the container as a grid widget for structured navigation
- aria-label provides an accessible name for the picker
- Consumer should provide role="row" and role="gridcell" on children

## Internationalization

- The label prop accepts any string; consumers provide localized text
- Emoji characters are locale-independent

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
