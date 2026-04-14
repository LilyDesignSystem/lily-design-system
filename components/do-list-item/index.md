# Do List Item

A single item within a DoList. Renders a semantic `<li>` element representing one recommended action or best practice. This component is designed to be placed inside a DoList `<ul>`, providing proper list item semantics for do/don't guidance patterns.

The consumer provides the content through the children slot. The component is intentionally minimal, serving as a semantic wrapper that can be styled by the consumer.

## Implementation Notes

- Renders as a semantic `<li>` element for use within a DoList `<ul>`
- All content is provided through the children slot
- Spreads `...restProps` onto the `<li>` element for consumer customization
- Should be placed inside a DoList component for valid HTML

## Props

- `children`: slot (required) -- list item content describing a recommended action
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Usage

```html
<DoList heading="Do">
  <DoListItem>cover blisters that are likely to burst with a soft plaster or dressing</DoListItem>
  <DoListItem>wash your hands before touching a burst blister</DoListItem>
  <DoListItem>allow the fluid in a burst blister to drain before covering it with a plaster or dressing</DoListItem>
</DoList>
```

## Keyboard Interactions

- None directly -- standard list item with no interactive behavior

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Inherits list context from the parent DoList `<ul>`

## When to Use

- Use inside DoList to represent one encouraged action or best practice.
- Use with lowercase text that describes the action directly, without prefixing with "do".
- Use when each guidance item needs individual styling or interactive behavior.

## When Not to Use

- Do not use outside of DoList -- it has no standalone meaning and requires a parent `<ul>` container.
- Do not use for discouraged actions -- use DontListItem inside DontList instead.

## Headless

This headless component provides a semantic `<li>` element that inherits list context from its parent DoList. It handles proper list item semantics. The consumer provides all visual styling, icons, and content for the individual item.


## Styles

The consumer provides all CSS styling. The component renders with a `.do-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `do-list-item`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep each item to a single, clear sentence. Use consistent visual markers (e.g., check marks) across all do-list items.
- **Developers**: Always place DoListItem inside a DoList component for valid HTML structure. Use `restProps` to add custom data attributes or event handlers.

## References

- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
