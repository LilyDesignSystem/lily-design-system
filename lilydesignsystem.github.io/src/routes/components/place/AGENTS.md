# Place

## Metadata

- Component: place
- PascalCase: Place
- Description: a place component that contains other place-related information
- HTML tag: <article>
- CSS class: .place
- Interactive: no

## Key Behaviors

- Uses `<article>` element for self-contained place semantics
- `aria-label` describes the place for screen readers

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the place for screen readers

## Keyboard

- None -- place components are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the place
- `children`: slot (required) -- place content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="place"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .place in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/place.html
