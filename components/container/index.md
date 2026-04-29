# Container

A generic block-level content container.

## Implementation Notes

- Renders a `<div>` element with class `container`
- Accepts `className` for additional CSS classes
- Accepts a `children` slot for arbitrary content
- Spreads `restProps` onto the `<div>` for consumer customization

## Props

- `className`: string (optional) — extra CSS classes appended to `container`
- `children`: slot — content rendered inside the container

## Usage

```html
<Container>
  <p>Content</p>
</Container>
```

## Keyboard Interactions

- No keyboard interactions — this is a passive container

## ARIA

- No specific ARIA — this is a generic container with no implied role

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.container` as the root class. No default styles are included.

## References

- Documentation: index.md
- CSS class: `.container` in css-style-sheet-template.css
