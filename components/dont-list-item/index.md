# Don't List Item

A single item within a DontList. Renders a semantic `<li>` element representing one discouraged action or practice to avoid. This component is designed to be placed inside a DontList `<ul>`, providing proper list item semantics for do/don't guidance patterns.

The consumer provides the content through the children slot. The component is intentionally minimal, serving as a semantic wrapper that can be styled by the consumer.

## Implementation Notes

- Renders as a semantic `<li>` element for use within a DontList `<ul>`
- All content is provided through the children slot
- Spreads `...restProps` onto the `<li>` element for consumer customization
- Should be placed inside a DontList component for valid HTML

## Props

- `children`: slot (required) -- list item content describing a discouraged action
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Usage

```html
<DontList heading="Don't">
  <DontListItem>do not burst a blister yourself</DontListItem>
  <DontListItem>do not peel the skin off a burst blister</DontListItem>
  <DontListItem>do not pick at the edges of the remaining skin</DontListItem>
</DontList>
```

## Keyboard Interactions

- None directly -- standard list item with no interactive behavior

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Inherits list context from the parent DontList `<ul>`

## When to Use

- Use inside DontList to represent one discouraged action or practice to avoid.
- Use with text starting with "do not" to make the prohibition clear.
- Use when each guidance item needs individual styling or interactive behavior.

## When Not to Use

- Do not use outside of DontList -- it has no standalone meaning and requires a parent `<ul>` container.
- Do not use for encouraged actions -- use DoListItem inside DoList instead.

## Headless

This headless component provides a semantic `<li>` element that inherits list context from its parent DontList. It handles proper list item semantics. The consumer provides all visual styling, icons, and content for the individual item.


## Styles

The consumer provides all CSS styling. The component renders with a `.dont-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `dont-list-item`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep each item to a single, clear sentence. Use consistent visual markers (e.g., cross marks) across all dont-list items.
- **Developers**: Always place DontListItem inside a DontList component for valid HTML structure. Use `restProps` to add custom data attributes or event handlers.

## References

- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
