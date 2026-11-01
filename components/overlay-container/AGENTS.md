# OverlayContainer

## Metadata

- Component: overlay-container
- PascalCase: OverlayContainer
- Description: a full-viewport overlay backdrop for modals and sheets
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .overlay-container
- Interactive: yes (forwards backdrop-click)

## Key Behaviors

- Renders `<div role="presentation">`
- `data-open={open}` for consumer CSS hooks
- `aria-hidden={!open}` keeps closed backdrop out of accessibility tree
- Native `hidden` attribute applied when open is false
- Forwards click events via onclick/onClick for backdrop-close
- No visual styling — consumer provides scrim background, blur, transitions

## ARIA

- `role="presentation"`
- `aria-hidden={!open}`
- Modal child carries role="dialog" / aria-modal — not this container

## Keyboard

- None on backdrop itself
- Modal child manages focus trap and Escape

## Props

- `open`: boolean (default: false)
- `label`: string (optional) -- aria-label
- `onclick` / `onClick`: callback (optional)
- `children`: slot -- overlay content
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: hand-rolled because it is a generic backdrop wrapper for consumer content that is not itself a <dialog>
- Uses: none (div role="presentation" hidden)
- Could use: <dialog>::backdrop
- Notes: New modal code should prefer dialog, whose showModal() supplies ::backdrop and inertness natively.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="overlay-container"
- [ ] role="presentation" applied
- [ ] data-open matches open prop
- [ ] aria-hidden equals !open
- [ ] hidden attribute applied when open is false
- [ ] Click handler fires on click
- [ ] aria-label rendered when label provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .overlay-container in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/overlay-container.html
- WAI-ARIA dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
