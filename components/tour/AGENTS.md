# Tour

## Metadata

- Component: tour
- PascalCase: Tour
- Description: a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .tour
- Interactive: no

## Composition

- Pattern: Tour/List/ListItem
- Children: tour-list, tour-list-item

## Key Behaviors

- Renders a `<div role="dialog">` as the tour container while `active` is true
- Is **non-modal**: no `aria-modal`, no focus trap, the page stays usable
- Uses `aria-label` for an accessible name describing the tour
- Escape ends the tour by setting `active` to `false`
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<div>` element for consumer customization
- Children slot contains TourList with TourListItem steps

## ARIA

- `role="dialog"` -- a non-modal dialog
- `aria-label={label}` -- provides an accessible name for the tour container
- no `aria-modal` -- the tour is non-modal (see Modality)

## Keyboard

- Escape: ends the tour by setting `active` to `false`
- Tab: moves normally between the tour's controls and the rest of the page; the tour does not trap focus

## Props

- `label`: string (required) -- accessible name for the tour via `aria-label`
- `className`: string (default: `""`) -- CSS class name for the container
- `children`: slot (required) -- tour content, typically a TourList
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Modality

- Decision (P18-T6): **non-modal**. A tour points at parts of the live page and often asks the user to try them ("click Save"), so the page behind it must stay usable and visible to assistive technology. Making it inert would block the very thing the step describes.
- It therefore drops `aria-modal="true"`, which claimed a modality nothing provided (no inert page, no Tab trap). It stays a `<div role="dialog">` with an accessible name; Escape still ends the tour.
- A consumer that wants a blocking walkthrough can put the tour content inside `dialog`, which is a real modal.

## Native platform

- Decision: hand-rolled because a tour points at the live page and often asks the user to try it, so it must stay non-modal; a <div role="dialog"> without aria-modal says that
- Uses: none (div role="dialog", non-modal, no aria-modal)
- Could use: <dialog> show() (non-modal)
- Notes: P18-T6: aria-modal="true" removed (it claimed a modality nothing provided: no inert page, no Tab trap). Escape still ends the tour. A consumer that wants a blocking tour can put it inside dialog. P18-T13: the Web Components and Alpine tours now render role="dialog" too (non-modal), as Svelte does.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="tour"
- [ ] Has aria-label attribute
- [ ] Has role="dialog" and no aria-modal (non-modal)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tour in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tour.html
- WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/
