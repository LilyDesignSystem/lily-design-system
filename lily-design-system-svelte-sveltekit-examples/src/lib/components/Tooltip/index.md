# Tooltip

## Overview

A headless tooltip that displays brief, contextual information when made
visible. Uses role="tooltip" for semantic identification and is designed
to be linked to a trigger element via aria-describedby, providing
supplementary text that screen readers can announce. Tooltips are used to
clarify the function or meaning of elements without cluttering the interface.

## What it does

A small popup showing descriptive text on hover or focus.

## When to use

- Use for supplemental, on-demand information tied to a trigger element.

## When not to use

- Do not use to convey essential information — tooltips must only reinforce content.

## Usage

```svelte
<Tooltip id="tip" label="Additional info" bind:visible={showTip} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | The tooltip text content. |
| `visible` | boolean, default false | Bindable boolean controlling visibility. |
| `id` | string, default undefined | Optional id for aria-describedby linking to trigger element. |
| `...restProps` | additional HTML attributes spread onto the tooltip <div> |  |

## Examples

```svelte
<!-- Tooltip linked to a trigger button -->
<button aria-describedby="tip"
  onmouseenter={() => showTip = true}
  onmouseleave={() => showTip = false}>Hover me</button>
<Tooltip id="tip" label="Additional info" bind:visible={showTip} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Tooltip from "$lib/components/Tooltip/Tooltip.svelte";
</script>

<Tooltip id="tip" label="Additional info" bind:visible={showTip} />
```

## Keyboard

- Escape: consumer should hide the tooltip (not built into the component)
- Tooltip itself does not receive focus; it describes another element

## Accessibility

- role="tooltip" identifies the element as a tooltip popup
- id enables aria-describedby linking to the trigger element
- Conditionally rendered: fully removed from DOM when not visible

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/tooltip/
- MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby
