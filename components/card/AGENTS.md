# Card

## Metadata

- Component: card
- PascalCase: Card
- Description: a grouped content container with header, body, and footer areas
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .card
- Interactive: yes

## Key Behaviors

- Renders a `<div>`: a card is not always a stand-alone item, and an `<article>` on every card in a list is noise for screen-reader users. Pass `role="article"` for a card that is one
- Heading level is configurable (2-6) for proper document outline structure
- When `href` is provided, the heading text wraps in an `<a>` element for navigation
- Optional `label` names the card, which then has `role="group"`; with no label the `<div>` is generic and unnamed
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`

## ARIA

- No role when unlabelled: a `<div>`
- `role="group"` and `aria-label` when `label` is given -- names the card as a group, not a landmark

## Keyboard

- Tab: Focus the heading link when `href` is provided
- Enter: Activate the heading link (browser default)

## Props

- `heading`: string (optional) -- heading text for the card
- `headingLevel`: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level
- `href`: string (optional) -- makes the heading a link
- `label`: string (optional) -- names the card (`aria-label`, with `role="group"`)
- `children`: slot (required) -- card body content
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

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
