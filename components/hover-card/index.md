# Hover Card

HoverCard is a headless component that displays supplementary content when triggered, typically by a hover or focus interaction on a trigger element. It conditionally renders a container with `role="tooltip"` and an accessible label when the `open` prop is true.

This component is useful for user profile previews, link previews, contextual help, or any popover-style content that should appear on hover or focus. The `open` prop is bindable, allowing the consumer to control visibility from hover/focus event handlers on a trigger element. Consumers provide the card content as children and manage the show/hide logic externally.

## Implementation Notes

- Conditionally renders a `<div>` with `role="tooltip"` when `open` is true
- Uses `aria-label` for an accessible name describing the card content
- Supports two-way binding on the `open` prop
- Accepts a `children` slot for flexible card content
- Spreads `restProps` onto the container for consumer customization
- The consumer is responsible for managing hover/focus events on the trigger element to toggle `open`

## Props

- `label`: string (required) -- accessible name for the hover card via `aria-label`
- `open`: boolean (default: `false`) -- whether the hover card is currently visible; bindable with two-way `open` binding
- `children`: slot (required) -- content to display inside the hover card
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

Basic hover card with a trigger button:

```html
<button
  onmouseenter={() => open = true}
  onmouseleave={() => open = false}
  onfocus={() => open = true}
  onblur={() => open = false}
>
  Hover me
</button>
<HoverCard label="User info" open={open}>
  <p>Profile details here</p>
</HoverCard>
```

User profile preview on a username link:

```html
<a
  href="/users/jdoe"
  onmouseenter={() => profileOpen = true}
  onmouseleave={() => profileOpen = false}
  onfocus={() => profileOpen = true}
  onblur={() => profileOpen = false}
>
  @jdoe
</a>
<HoverCard label="Profile preview for jdoe" open={profileOpen}>
  <Avatar label="Jane Doe">
    <AvatarImage src="/avatars/jdoe.jpg" alt="Jane Doe" />
  </Avatar>
  <strong>Jane Doe</strong>
  <p>Software Engineer at Acme Corp</p>
  <p>12 projects &middot; 48 contributions</p>
</HoverCard>
```

Link preview hover card:

```html
<a
  href="https://example.com/article"
  onmouseenter={() => linkPreviewOpen = true}
  onmouseleave={() => linkPreviewOpen = false}
  onfocus={() => linkPreviewOpen = true}
  onblur={() => linkPreviewOpen = false}
>
  Understanding Accessibility
</a>
<HoverCard label="Article preview" open={linkPreviewOpen}>
  <Image src="/thumbnails/a11y.jpg" alt="Accessibility article thumbnail" />
  <strong>Understanding Accessibility</strong>
  <p>A practical guide to building inclusive web applications.</p>
</HoverCard>
```

## Keyboard Interactions

None at the component level. The consumer manages focus-based visibility on the trigger element.

## ARIA

- `role="tooltip"` -- identifies the hover card as supplementary descriptive content
- `aria-label={label}` -- provides an accessible name describing the hover card content

## When to Use

- Use for user profile previews triggered by hovering over a username or avatar.
- Use for link previews that show a summary of the destination page.
- Use for contextual help or supplementary information triggered by hover or focus.
- Use when the content is supplementary and does not require user interaction to dismiss.

## When Not to Use

- Do not use for content that requires user interaction such as buttons or forms -- use Popover instead.
- Do not use for simple text descriptions -- use Tooltip instead.
- Do not use as the only way to access content -- hover is not available on touch devices.
- Do not use for essential information the user must see -- place it inline instead.

## Headless

This headless component provides a `<div>` with `role="tooltip"` and `aria-label` that conditionally renders when `open` is true. The consumer provides all visual styling including positioning, shadows, borders, arrow indicators, and content layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.hover-card` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `hover-card`
- Verify role="tooltip"` -- identifies the hover card as supplementary descriptive content
- Verify aria-label={label}` -- provides an accessible name describing the hover card content
- Verify pass-through attributes are applied

## Advice

- **Designers**: Add a slight delay before showing and hiding the card to prevent flickering on accidental hover. Include an arrow pointing to the trigger element.
- **Developers**: Manage hover/focus events on the trigger element to toggle `open`. Consider adding a delay to prevent the card from disappearing when the user moves the mouse between the trigger and the card.

## References

- WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
