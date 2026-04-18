# TagGroup

TagGroup is a headless container for a collection of related tags. It uses the ARIA `group` role with an accessible label to semantically associate tag elements, making the collection understandable to screen readers and other assistive technologies.

This component is useful for displaying categories, skills, technologies, or any set of labels that belong together. Consumers provide the individual tag elements as children and bring their own styling.

## Implementation Notes

- Renders a `<div>` with `role="group"` to semantically group child tag elements
- Uses `aria-label` for an accessible name describing the group
- Accepts a `children` Snippet for rendering tag elements inside the group
- Spreads `restProps` onto the container for consumer customization
- Svelte 5 pattern: standard `$props()` destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the group via `aria-label`
- `children`: Snippet (required) -- tag elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

```svelte
<TagGroup label="Technologies">
  <Tag>Svelte</Tag>
  <Tag>TypeScript</Tag>
</TagGroup>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard behavior depends on the child tag elements provided by the consumer.

## ARIA

- `role="group"` -- identifies the container as a semantic grouping of related elements
- `aria-label={label}` -- provides an accessible name describing the purpose of the tag collection

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
