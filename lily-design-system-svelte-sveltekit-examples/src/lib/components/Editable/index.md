# Editable

## Overview

An inline-editable text component that toggles between a read-only display
and an input field for editing. In display mode it renders a <span> with
role="button"; in edit mode it renders an <input type="text">. Pressing
Enter confirms the edit and Escape cancels it, reverting to the original value.

## What it does

An inline-editable text element that toggles between view and edit modes.

## When to use

- Use to display structured tabular data with headers and rows.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Editable label="Name" bind:value />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `value` | string, default "" | Current text value; bindable. |
| `label` | string, required | Accessible name for the editable control. |
| `editing` | boolean, default false | Whether the component is in edit mode; bindable. |
| `disabled` | boolean, default false | Whether editing is disabled. |
| `...restProps` | additional HTML attributes spread onto the <span> or <input> |  |

## Examples

```svelte
<!-- Basic inline edit -->
<Editable label="Name" bind:value />

<!-- With external editing state control -->
<Editable label="Title" bind:value bind:editing />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Editable from "$lib/components/Editable/Editable.svelte";
</script>

<Editable label="Name" bind:value />
```

## Keyboard

- Enter (display mode): activate edit mode
- Space (display mode): activate edit mode
- Enter (edit mode): confirm the edit and return to display mode
- Escape (edit mode): cancel the edit and return to display mode

## Accessibility

- role="button" on the display span indicates it is activatable
- aria-label provides the accessible name in both modes
- aria-disabled on the span when disabled
- tabindex="0" when enabled, tabindex="-1" when disabled

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
