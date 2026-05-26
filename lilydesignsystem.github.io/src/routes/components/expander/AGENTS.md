# Expander

## Metadata

- Component: expander
- PascalCase: Expander
- Description: a control that expands to reveal more content
- HTML tag: <div>
- CSS class: .expander
- Interactive: yes

## Key Behaviors

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional content region
- The button uses `aria-expanded` and `aria-controls` to communicate state to assistive technologies
- The content region uses `role="region"` with `aria-label` matching the button label
- A unique `contentId` is generated using `Math.random()` for the `aria-controls`/`id` link
- Supports two-way binding on the `expanded` prop
- Content is conditionally rendered with conditional rendering, removing it from the DOM when collapsed
- Uses slot for the `children` prop

## ARIA

- `aria-expanded={expanded}` -- on the button, indicates whether the controlled content is currently visible
- `aria-controls={contentId}` -- on the button, references the id of the expandable content region
- `role="region"` -- on the content container, identifies the expandable area as a landmark region
- `aria-label={label}` -- on the content region, provides an accessible name for the region

## Keyboard

- Enter: Toggles the expander open/closed when the button has focus (native button behavior)
- Space: Toggles the expander open/closed when the button has focus (native button behavior)
- Tab: Moves focus to/from the toggle button

## Props

- `label`: string (required) -- button text and accessible name for both the button and the content region
- `expanded`: boolean (default: false) -- bindable boolean controlling whether the content is visible
- `children`: slot (required) -- expandable content rendered when expanded is true
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Acceptance Criteria

- [ ] Renders <div> element with class="expander"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .expander in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/expander.html
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
