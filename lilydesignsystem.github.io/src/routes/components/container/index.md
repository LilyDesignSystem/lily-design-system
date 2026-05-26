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

## When to Use

- As a neutral wrapper around a section of related content where you want a single styling hook but no semantic meaning.
- When you need a hook for consumer CSS (margins, padding, background) without committing to a fixed or fluid layout policy.
- As the building block other layout components are composed from.

## When Not to Use

- Do not use when a fixed reading width is required — use `container-with-fixed-width` instead.
- Do not use when full-bleed horizontal padding is required — use `container-with-fluid-width` instead.
- Do not use as a substitute for a semantic landmark — use `<header>`, `<main>`, `<nav>`, `<footer>`, or `<section>` (or the corresponding Lily components) when the content has a clear role.

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.

## Styles

The component renders with `.container` as the root class. No default styles are included.

## Related components

- `container-with-fixed-width` — a centered content wrapper with a fixed max-width breakpoint
- `container-with-fluid-width` — a full-width content wrapper with horizontal padding

## References

- Documentation: index.md
- CSS class: `.container` in css-style-sheet-template.css
