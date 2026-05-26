# Card

## Metadata

- Component: card
- PascalCase: Card
- Description: a grouped content container with header, body, and footer areas
- HTML tag: <div>
- CSS class: .card
- Interactive: yes

## Key Behaviors

- Uses `<article>` for semantic standalone content grouping
- Heading level is configurable (2-6) for proper document outline structure
- When `href` is provided, the heading text wraps in an `<a>` element for navigation
- Optional `aria-label` for named landmark identification
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`

## ARIA

- Implicit `article` role from the `<article>` element
- Optional `aria-label` -- identifies the card as a named landmark for screen readers

## Keyboard

- Tab: Focus the heading link when `href` is provided
- Enter: Activate the heading link (browser default)

## Props

- `heading`: string (optional) -- heading text for the card
- `headingLevel`: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level
- `href`: string (optional) -- makes the heading a link
- `label`: string (optional) -- `aria-label` for the article
- `children`: slot (required) -- card body content
- `...restProps`: Any additional HTML attributes passed to the `<article>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="card"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .card in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/card.html
