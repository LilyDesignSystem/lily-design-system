# Framer

## Metadata

- Component: framer
- PascalCase: Framer
- Description: a container for framed content display with decorative border
- HTML tag: <div>
- CSS class: .framer
- Interactive: no

## Key Behaviors

- Wraps content in a decorative frame container
- Consumer provides frame styling (border, shadow, background)
- Can be used for screenshots, artwork, embedded content

## ARIA

- Optional `aria-label` when frame has semantic meaning; otherwise presentational

## Keyboard

- None

## Props

- `label`: string (optional) -- accessible label for the framed content
- `children`: slot (required) -- framed content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="framer"
- [ ] Supports optional aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .framer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/framer.html
- Reuters Graphics Framer component
