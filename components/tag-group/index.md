# Tag Group

TagGroup is a headless container for a collection of related tags. It uses the ARIA `group` role with an accessible label to semantically associate tag elements, making the collection understandable to screen readers and other assistive technologies.

This component is useful for displaying categories, skills, technologies, or any set of labels that belong together. Consumers provide the individual tag elements as children and bring their own styling.

## Implementation Notes

- Renders a `<div>` with `role="group"` to semantically group child tag elements
- Uses `aria-label` for an accessible name describing the group
- Accepts a `children` slot for rendering tag elements inside the group
- Spreads `restProps` onto the container for consumer customization
- pattern: standard props destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the group via `aria-label`
- `children`: slot (required) -- tag elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

```html
<TagGroup label="Patient statuses">
  <Tag label="Status: Verified">Verified</Tag>
  <Tag label="Status: NHS patient">NHS patient</Tag>
  <Tag label="Status: Review due">Review due</Tag>
</TagGroup>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard behavior depends on the child tag elements provided by the consumer.

## ARIA

- `role="group"` -- identifies the container as a semantic grouping of related elements
- `aria-label={label}` -- provides an accessible name describing the purpose of the tag collection

## When to Use

- Use to display multiple tags together, such as statuses or categories applied to a single item
- Use within cards, table rows, or list items where an item has several attributes to show
- Use to visually group related status indicators with consistent spacing

## When Not to Use

- Do not use for a single tag -- render the Tag component directly
- Do not use for interactive chip or filter patterns -- use ToggleGroup or SegmentGroup instead
- Do not use for tag creation and removal -- use TagInput for editable tag lists

## Headless

This headless component renders a `<div>` with `role="group"` and `aria-label` to semantically associate child tag elements. It provides grouping semantics for assistive technologies. The consumer provides all visual styling including layout (flex, grid, wrap), spacing, and gap between tags.


## Styles

The consumer provides all CSS styling. The component renders with a `.tag-group` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `tag-group`
- Verify role="group"` -- identifies the container as a semantic grouping of related elements
- Verify aria-label={label}` -- provides an accessible name describing the purpose of the tag collection
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a horizontal flex-wrap layout with consistent gaps between tags. Consider a label or heading above the group to visually identify the tag category.
- **Developers**: Use a descriptive `label` prop that names the collection (e.g., "Technologies", "Skills"). Pair TagGroup with Tag children for proper semantic structure.

## Composition

TagGroup uses the Group/Item composition pattern. Place Tag components as children inside TagGroup. The TagGroup provides the `role="group"` container with an accessible label, while each Tag provides an individual labeled element within the group.

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
