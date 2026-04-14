# Tooltip

A tooltip is a headless component that displays brief, contextual information when made visible. It uses `role="tooltip"` for semantic identification and is designed to be linked to a trigger element via `aria-describedby`, providing supplementary text that screen readers can announce.

Tooltips are used to clarify the function or meaning of an element without cluttering the interface, offering helpful hints, labels, or explanations on demand. The consumer controls visibility through the bindable `visible` prop and is responsible for toggling it on hover, focus, or other interaction events.

## Implementation Notes

- Renders a `<div>` with `role="tooltip"` when visible, removed from the DOM when hidden
- Uses conditional rendering, so the tooltip is fully removed from the DOM when not shown
- Supports two-way binding on the `visible` prop
- The consumer is responsible for managing visibility (e.g., on hover/focus of a trigger element)
- The `id` prop enables linking the tooltip to its trigger element via `aria-describedby`
- Spreads `restProps` onto the div element for consumer extensibility

## Props

- `label`: string (required) -- the tooltip text content
- `visible`: boolean (default: false) -- bindable boolean controlling whether the tooltip is shown
- `id`: string (default: undefined) -- optional id for linking to a trigger element via `aria-describedby`
- `...restProps`: unknown -- additional attributes spread onto the tooltip div

## Usage

Tooltip on an icon button:

```html
<button aria-describedby="save-tip"
  onmouseenter={() => showSaveTip = true}
  onmouseleave={() => showSaveTip = false}
  onfocusin={() => showSaveTip = true}
  onfocusout={() => showSaveTip = false}
>
  <Icon name="save" />
  <ScreenReaderSpan>Save document</ScreenReaderSpan>
</button>
<Tooltip id="save-tip" label="Save document" visible={showSaveTip} />
```

Tooltip explaining an abbreviation:

```html
<span aria-describedby="a11y-tip"
  onmouseenter={() => showA11yTip = true}
  onmouseleave={() => showA11yTip = false}
  onfocusin={() => showA11yTip = true}
  onfocusout={() => showA11yTip = false}
  tabindex="0"
>
  WCAG
</span>
<Tooltip id="a11y-tip" label="Web Content Accessibility Guidelines" visible={showA11yTip} />
```

Tooltip for a toolbar action:

```html
<button aria-describedby="delete-tip"
  onmouseenter={() => showDeleteTip = true}
  onmouseleave={() => showDeleteTip = false}
  onfocusin={() => showDeleteTip = true}
  onfocusout={() => showDeleteTip = false}
>
  <Icon name="trash" />
</button>
<Tooltip id="delete-tip" label="Delete selected items" visible={showDeleteTip} />
```

## Keyboard Interactions

- Escape: The consumer should hide the tooltip when Escape is pressed (not built into the component; must be handled by the consumer)
- The tooltip itself does not receive focus; it is a supplementary description for another element

## ARIA

- `role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- `id={id}` -- used with `aria-describedby` on the trigger element to create an accessible association between the trigger and the tooltip

## When to Use

- Use Tooltip to provide brief, supplementary descriptions for UI elements on hover or focus, such as explaining an icon button's purpose.
- Use to clarify abbreviations, technical terms, or truncated text.
- Use when the information is helpful but not essential for completing a task.
- Use for labelling icon-only buttons where a visible label would not fit.
- Use for showing full text when content is truncated with ellipsis.

## When Not to Use

- Do not use for critical information that users must see -- use inline text or Alert instead.
- Do not use for interactive content such as links, buttons, or forms -- use Popover instead.
- Do not use for long text -- keep tooltip content to one short sentence.
- Do not use for rich content previews -- use HoverCard instead.

## Headless

This headless component provides a `<div>` with `role="tooltip"` and conditional rendering (fully removed from DOM when hidden). The consumer manages visibility toggling (hover, focus events), positioning, and all visual styling including background, border, and arrow indicators.


## Styles

The consumer provides all CSS styling. The component renders with a `.tooltip` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `tooltip`
- Verify role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep tooltip text concise (one line if possible). Position tooltips so they do not obscure the trigger element or important content.
- **Developers**: Link the tooltip to its trigger using `id` and `aria-describedby`. Handle Escape key to dismiss the tooltip and ensure it works on both hover and focus for keyboard accessibility.

## References

- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/tooltip/
- MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby
