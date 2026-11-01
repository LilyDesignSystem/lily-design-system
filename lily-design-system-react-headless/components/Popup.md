# Popup

A popup is a UI component that temporarily appears over the main content to convey information, prompt user actions, or display additional options without navigating away from the current screen. The Popup component is a headless `popover="auto"` dialog overlay that the browser's Popover API opens and closes, using proper dialog semantics for assistive technology.

The component is similar to Popover but is designed as a general-purpose overlay dialog. It supports controlled component usage for the `open` prop, so parent components can control visibility. The consumer provides the trigger (`command="toggle-popover" commandfor="{id}"`, no script needed) and all content.

## Implementation Notes

- Always renders a `<div popover="auto" role="dialog">`: the native Popover API shows it in the top layer and closes it on Escape or a click outside (light dismiss); `open` follows the element's `toggle` event, with a `hidden` fallback where `showPopover` is missing
- Supports controlled component usage for the `open` prop
- The `label` prop is required and provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element
- The consumer provides the trigger: `command="toggle-popover" commandfor="{id}"` (plus `popovertarget` for older engines)
- Content is provided via the `children` snippet

## Props

- `label`: string (required) -- accessible name for the popup dialog via `aria-label`
- `open`: boolean (default: false) -- controls whether the popup is visible; controlled
- `children`: ReactNode (required) -- the popup content rendered inside the dialog
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```tsx

const [showPopup, setShowPopup] = useState(false);

<button onClick={() => setShowPopup(!showPopup)}>Open popup</button>
<Popup label="Confirmation" open={showPopup} onChange={setShowPopup}>
  <p>Are you sure you want to proceed?</p>
  <button onClick={() => setShowPopup(false)}>Yes</button>
  <button onClick={() => setShowPopup(false)}>No</button>
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
