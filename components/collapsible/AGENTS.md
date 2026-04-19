# Collapsible

## Metadata

- Component: collapsible
- PascalCase: Collapsible
- Description: a container that can be expanded or collapsed
- HTML tag: <div>
- CSS class: .collapsible
- Interactive: yes

## Key Behaviors

- Uses native `<details>` and `<summary>` elements for built-in accessibility support
- The `open` prop uses two-way binding
- No custom ARIA attributes needed because native elements handle all announcements
- Spreads `restProps` onto the `<details>` element for consumer customization

## ARIA

- No custom ARIA attributes required -- native `<details>`/`<summary>` elements provide built-in expanded/collapsed state announcements to screen readers

## Keyboard

- Enter/Space: Toggle the disclosure open/closed (handled natively by `<summary>`)

## Props

- `summary`: string (required) -- the clickable summary text shown as the toggle trigger
- `open`: boolean (default: false) -- whether the content is expanded; bindable for two-way control
- `children`: slot (required) -- the collapsible content revealed when expanded

## Acceptance Criteria

- [ ] Renders <div> element with class="collapsible"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .collapsible in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/collapsible.html
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
