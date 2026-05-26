# Flex Stack

A flex stack is a layout container that arranges its children in a single row
or column with a consistent gap, exposing flex direction, alignment, and
justification through props so that the consumer never needs to write
boilerplate flexbox CSS.

Use it any time you need to arrange a small set of children with predictable
spacing — toolbars, button groups, vertical form sections, navigation links.

## Implementation Notes

- Renders a `<div>` with `class="flex-stack"`
- Applies inline styles: `display: flex; flex-direction: {direction}; gap: {gap};` plus optional `align-items` and `justify-content`
- Sets `data-direction={direction}` for consumer CSS hooks
- Does not constrain width or apply any visual treatment

## Props

- `direction`: "row" | "column" (default: "column") -- flex direction
- `gap`: string (default: "1rem") -- gap CSS value
- `align`: string (optional) -- align-items value
- `justify`: string (optional) -- justify-content value
- `children`: slot -- the laid-out content
- `...restProps`: any additional HTML attributes

## Usage

Vertical stack with default 1rem gap:

```html
<FlexStack>
  <Card>One</Card>
  <Card>Two</Card>
</FlexStack>
```

Horizontal toolbar:

```html
<FlexStack direction="row" gap="0.5rem" align="center">
  <Button>Save</Button>
  <Button>Cancel</Button>
</FlexStack>
```

Horizontal row with space-between justification:

```html
<FlexStack direction="row" justify="space-between" align="center">
  <h2>Title</h2>
  <Button>Action</Button>
</FlexStack>
```

## Keyboard Interactions

- None -- this is a layout container; focusable children manage their own keyboard behavior.

## ARIA

- None — purely structural. Use a more specific landmark or role on a wrapping element if needed (e.g., wrap in `<nav>` for navigation lists).

## When to Use

- Use for one-dimensional layouts (a single row or single column).
- Use when you need consistent gap spacing without manual margins.
- Use as the layout primitive inside cards, headers, and form sections.

## When Not to Use

- Do not use for two-dimensional grids (use Grid).
- Do not use for masonry/variable-height column layouts (use Masonry).
- Do not use as a navigation landmark — wrap in semantic landmark elements as appropriate.

## Headless

Provides only the flexbox layout via inline styles. Sizing, padding, borders,
backgrounds, and item-level alignment overrides are the consumer's
responsibility.

## Styles

Consumers may target `.flex-stack` for global overrides or
`.flex-stack[data-direction="row"]` / `.flex-stack[data-direction="column"]`
for direction-specific styles.

## Testing

- Verify the component renders a `<div>` element with class `flex-stack`
- Verify inline style sets `display: flex` and `flex-direction` to the `direction` prop
- Verify inline style sets `gap` to the `gap` prop
- Verify `align-items` and `justify-content` are applied when `align` and `justify` props are provided
- Verify `data-direction` attribute matches the `direction` prop
- Verify children content is rendered

## Advice

- **Designers**: Specify gap in a consistent spacing scale. Use `align="center"` for icon-plus-text rows; `justify="space-between"` for headers with trailing actions.
- **Developers**: Reach for FlexStack first for small one-dimensional groups. Use Grid for two-dimensional layouts.

## Related components

- `grid` — a CSS grid layout container with configurable columns and gap
- `container` — a generic block-level content container

## References

- MDN flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
- MDN gap: https://developer.mozilla.org/en-US/docs/Web/CSS/gap
