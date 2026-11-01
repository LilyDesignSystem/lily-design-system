# Popover

A popover is a UI component that displays contextual information or actions in an overlay that appears near the element that triggered it. The Popover component is a headless `popover="auto"` dialog that the browser's Popover API opens and closes, with proper dialog semantics for accessibility.

Unlike tooltips, popovers can contain rich interactive content such as text, forms, buttons, or other controls. The component uses `$bindable()` for the `open` prop, allowing parent components to control visibility with two-way binding. The consumer provides the trigger: `<button command="toggle-popover" commandfor="{id}">` opens it with no script.

## Implementation Notes

- Always renders a `<div popover="auto" role="dialog">`: the native Popover API shows it in the top layer and closes it on Escape or a click outside (light dismiss); `open` follows the element's `toggle` event, with a `hidden` fallback where `showPopover` is missing
- Uses `$bindable()` for the `open` prop, enabling two-way binding with `bind:open`
- The `label` prop provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer provides the trigger: `command="toggle-popover" commandfor="{id}"` (plus `popovertarget` for older engines)
- Content is provided via the `children` snippet

## Props

- `label`: string (required) -- accessible name for the popover dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- controls whether the popover is visible; supports two-way binding
- `children`: Snippet (required) -- the popover content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<script lang="ts">
  let showPopover = $state(false);
</script>

<button onclick={() => (showPopover = !showPopover)}>Toggle info</button>
<Popover
  label="Additional information"
  bind:open={showPopover}
>
  <p>Here is some contextual information.</p>
  <button onclick={() => (showPopover = false)}>Close</button>
</Popover>
```

## Keyboard Interactions

- Escape: Consumer should implement closing the popover by setting `open` to false
- Tab: Should trap focus within the popover when open (consumer responsibility)

## ARIA

- `role="dialog"` -- identifies the popover as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
