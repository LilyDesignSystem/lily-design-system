# HoverCard

HoverCard is a headless component that displays supplementary content when triggered, typically by a hover or focus interaction on a trigger element. It conditionally renders a container with `role="tooltip"` and an accessible label when the `open` prop is true.

This component is useful for user profile previews, link previews, contextual help, or any popover-style content that should appear on hover or focus. The `open` prop is bindable, allowing the consumer to control visibility from hover/focus event handlers on a trigger element. Consumers provide the card content as children and manage the show/hide logic externally.

## Implementation Notes

- Conditionally renders a `<div>` with `role="tooltip"` when `open` is true
- Uses `aria-label` for an accessible name describing the card content
- Uses `$bindable(false)` for the `open` prop, enabling two-way binding
- Accepts a `children` Snippet for flexible card content
- Spreads `restProps` onto the container for consumer customization
- The consumer is responsible for managing hover/focus events on the trigger element to toggle `open`

## Props

- `label`: string (required) -- accessible name for the hover card via `aria-label`
- `open`: boolean (default: `false`) -- whether the hover card is currently visible; bindable with `bind:open`
- `children`: Snippet (required) -- content to display inside the hover card
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

```svelte
<button
  onmouseenter={() => open = true}
  onmouseleave={() => open = false}
  onfocus={() => open = true}
  onblur={() => open = false}
>
  Hover me
</button>
<HoverCard label="User info" bind:open>
  <p>Profile details here</p>
</HoverCard>
```

## Keyboard Interactions

None at the component level. The consumer manages focus-based visibility on the trigger element.

## ARIA

- `role="tooltip"` -- identifies the hover card as supplementary descriptive content
- `aria-label={label}` -- provides an accessible name describing the hover card content

## References

- WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
