# Details

## Metadata

- Component: details
- PascalCase: Details
- Description: a disclosure widget that shows and hides content
- HTML tag: <details>
- CSS class: .details
- Interactive: yes

## Key Behaviors

- Renders native `<details>` and `<summary>` HTML elements for built-in browser accessibility
- Supports two-way binding on the `open` prop for two-way state synchronization on the `open` prop
- The `summary` prop provides the clickable toggle text
- Accepts a `children` slot for the expandable content area
- Spreads `restProps` onto the `<details>` element for consumer customization
- Similar to Collapsible but uses a more generic, standards-based API

## ARIA

- Native `<details>` and `<summary>` elements provide built-in ARIA semantics
- The browser automatically exposes the expanded/collapsed state to assistive technology
- No additional ARIA attributes are needed because the native elements handle accessibility

## Keyboard

- Enter or Space: toggles the disclosure open/closed when the `<summary>` element is focused (native browser behavior)

## Props

- `summary`: string (required) -- text displayed in the summary toggle
- `open`: boolean (default: false) -- whether the details section is expanded; bindable
- `children`: slot (required) -- content revealed when expanded

## Acceptance Criteria

- [ ] Renders <details> element with class="details"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .details in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/details.html
- MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
