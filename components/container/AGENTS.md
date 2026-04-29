# Container

## Metadata

- Component: container
- PascalCase: Container
- Description: a generic block-level content container
- HTML tag: <div>
- CSS class: .container
- Interactive: no

## Key Behaviors

- Renders a `<div>` element with class `container`
- Accepts `className` for additional CSS classes
- Accepts a `children` slot for arbitrary content
- Spreads `restProps` onto the `<div>` for consumer customization

## ARIA

- No specific ARIA — this is a generic container with no implied role

## Keyboard

- No keyboard interactions — this is a passive container

## Props

- `className`: string (optional) — extra CSS classes appended to `container`
- `children`: slot — content rendered inside the container

## Acceptance Criteria

- [ ] Renders `<div>` element with class="container"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.container` in css-style-sheet-template.css
