# Popup

A popup is a UI component that temporarily appears over the main content to convey information, prompt user actions, or display additional options without navigating away from the current screen. The Popup component is a headless `popover="auto"` dialog overlay that the browser's Popover API opens and closes, using proper dialog semantics for assistive technology.

The component is similar to Popover but is designed as a general-purpose overlay dialog. It uses `$bindable()` for the `open` prop, enabling two-way binding so parent components can control visibility. The consumer provides the trigger (`command="toggle-popover" commandfor="{id}"`, no script needed) and all content.

## Implementation Notes

- Always renders a `<div popover="auto" role="dialog">`: the native Popover API shows it in the top layer and closes it on Escape or a click outside (light dismiss); `open` follows the element's `toggle` event, with a `hidden` fallback where `showPopover` is missing
- Uses `$bindable()` for the `open` prop, enabling two-way binding with `bind:open`
- The `label` prop is required and provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer provides the trigger: `command="toggle-popover" commandfor="{id}"` (plus `popovertarget` for older engines)
- Content is provided via the `children` snippet

## Props

- `label`: string (required) -- accessible name for the popup dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- controls whether the popup is visible; supports two-way binding
- `children`: Snippet (required) -- the popup content rendered inside the dialog
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<script lang="ts">
  let showPopup = $state(false);
</script>

<button onclick={() => (showPopup = !showPopup)}>Open popup</button>
<Popup
  label="Confirmation"
  bind:open={showPopup}
>
  <p>Are you sure you want to proceed?</p>
  <button onclick={() => (showPopup = false)}>Yes</button>
  <button onclick={() => (showPopup = false)}>No</button>
</Popup>
```

## Keyboard Interactions

- Escape: Consumer should implement closing the popup by setting `open` to false
- Tab: Should trap focus within the popup when open (consumer responsibility)

## ARIA

- `role="dialog"` -- identifies the popup as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
