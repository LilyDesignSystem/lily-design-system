# Framer

## Metadata

- Component: framer
- PascalCase: Framer
- Description: a container for framed content display with decorative border
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .framer
- Interactive: no

## Key Behaviors

- Wraps content in a decorative frame container
- Consumer provides frame styling (border, shadow, background)
- Can be used for screenshots, artwork, embedded content

## ARIA

- With `label`: `role="group"` and `aria-label`, because a plain `<div>` cannot be named. A consumer who names it with `aria-label` directly passes `role` too. Without `label`: no role, presentational

## Keyboard

- None

## Props

- `label`: string (optional) -- accessible label for the framed content
- `children`: slot (required) -- framed content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="framer"
- [ ] Has role="group" and aria-label with a label, and no role without one
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .framer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/framer.html
- Reuters Graphics Framer component
