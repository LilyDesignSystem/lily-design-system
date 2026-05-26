# CareCard

## Metadata

- Component: care-card
- PascalCase: CareCard
- Description: a medical care instruction card with urgency levels
- HTML tag: <div>
- CSS class: .care-card
- Interactive: no

## Key Behaviors

- NHS England inspired pattern for healthcare guidance
- Three urgency levels: non-urgent, urgent, immediate
- Renders as `<section role="region">` with heading for landmark navigation
- `aria-label` defaults to the heading text, overridable via the `label` prop
- Uses `<h2>` for the heading element
- `data-type` attribute exposes the urgency level for consumer CSS styling
- Content is provided through child elements

## ARIA

- `role="region"` -- identifies the card as a named landmark
- `aria-label` -- set from `label` prop or `heading` prop for screen reader identification
- `data-type` -- exposes urgency level for consumer styling hooks

## Keyboard

- None -- this component is a passive content container

## Props

- `type`: "non-urgent" | "urgent" | "immediate" (default: "non-urgent") -- urgency level
- `heading`: string (required) -- heading text for the care card
- `label`: string (optional) -- `aria-label` override; defaults to heading text
- `children`: slot (required) -- the care card body content
- `...restProps`: Any additional HTML attributes passed to the `<section>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="care-card"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .care-card in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/care-card.html
- NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards
