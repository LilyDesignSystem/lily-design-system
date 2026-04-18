# Popover

A popover is a UI component that displays contextual information or actions in an overlay that appears near the element that triggered it. The Popover component provides a headless conditional dialog container that renders its content only when the `open` state is true, with proper dialog semantics for accessibility.

Unlike tooltips, popovers can contain rich interactive content such as text, forms, buttons, or other controls. The component uses `$bindable()` for the `open` prop, allowing parent components to control visibility with two-way binding. The consumer is responsible for providing trigger elements and managing open/close logic.

## Implementation Notes

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Uses `$bindable()` for the `open` prop, enabling two-way binding with `bind:open`
- The `label` prop provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer must provide their own trigger element and open/close logic
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

<button onclick={() => showPopover = !showPopover}>Toggle info</button>
<Popover label="Additional information" bind:open={showPopover}>
  <p>Here is some contextual information.</p>
  <button onclick={() => showPopover = false}>Close</button>
</Popover>
```

## Keyboard Interactions

- Escape: Consumer should implement closing the popover by setting `open` to false
- Tab: Should trap focus within the popover when open (consumer responsibility)

## ARIA

- `role="dialog"` -- identifies the popover as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
