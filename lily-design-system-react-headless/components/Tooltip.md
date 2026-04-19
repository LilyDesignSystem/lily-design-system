# Tooltip

A tooltip is a headless component that displays brief, contextual information when made visible. It uses `role="tooltip"` for semantic identification and is designed to be linked to a trigger element via `aria-describedby`, providing supplementary text that screen readers can announce.

Tooltips are used to clarify the function or meaning of an element without cluttering the interface, offering helpful hints, labels, or explanations on demand. The consumer controls visibility through the controlled `visible` prop and is responsible for toggling it on hover, focus, or other interaction events.

## Implementation Notes

- Renders a `<div>` with `role="tooltip"` when visible, removed from the DOM when hidden
- Conditionally rendered, so the tooltip is fully removed from the DOM when not shown
- Supports controlled component usage for the `visible` prop
- The consumer is responsible for managing visibility (e.g., on hover/focus of a trigger element)
- The `id` prop enables linking the tooltip to its trigger element via `aria-describedby`
- Spreads `restProps` onto the div element for consumer extensibility

## Props

- `label`: string (required) -- the tooltip text content
- `visible`: boolean (default: false) -- controlled boolean indicating whether the tooltip is shown
- `id`: string (default: undefined) -- optional id for linking to a trigger element via `aria-describedby`
- `...restProps`: unknown -- additional attributes spread onto the tooltip div

## Usage

```tsx
<button aria-describedby="tip"
  onMouseEnter={() => setShowTip(true)}
  onMouseLeave={() => setShowTip(false)}
  onFocus={() => setShowTip(true)}
  onBlur={() => setShowTip(false)}
>
  Hover me
</button>
<Tooltip id="tip" label="Additional info" visible={showTip} onChange={setShowTip} />
```

```tsx
<Tooltip id="help-tip" label="Click to submit your form" visible={true} />
```

## Keyboard Interactions

- Escape: The consumer should hide the tooltip when Escape is pressed (not built into the component; must be handled by the consumer)
- The tooltip itself does not receive focus; it is a supplementary description for another element

## ARIA

- `role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- `id={id}` -- used with `aria-describedby` on the trigger element to create an accessible association between the trigger and the tooltip

## References

- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby
