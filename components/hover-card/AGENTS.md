# HoverCard

## Metadata

- Component: hover-card
- PascalCase: HoverCard
- Description: a card that appears on hover over a trigger element
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .hover-card
- Interactive: no

## Key Behaviors

- Conditionally renders a `<div>` with `role="tooltip"` when `open` is true
- Uses `aria-label` for an accessible name describing the card content
- Supports two-way binding on the `open` prop
- Accepts a `children` slot for flexible card content
- Spreads `restProps` onto the container for consumer customization
- The consumer is responsible for managing hover/focus events on the trigger element to toggle `open`

## ARIA

- `role="tooltip"` -- identifies the hover card as supplementary descriptive content
- `aria-label={label}` -- provides an accessible name describing the hover card content

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the hover card via `aria-label`
- `open`: boolean (default: `false`) -- whether the hover card is currently visible; bindable with two-way `open` binding
- `children`: slot (required) -- content to display inside the hover card
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Native platform

- Decision: native
- Uses: div role="tooltip" popover="manual" shown from the open state
- Could use: CSS anchor positioning (consumer sets position-anchor)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor, always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. role="tooltip" with rich content and its own aria-label is questionable; APG tooltips hold plain text. Review the role in the same change.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="hover-card"
- [ ] Has aria-label attribute
- [ ] Has role="tooltip"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hover-card in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hover-card.html
- WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
