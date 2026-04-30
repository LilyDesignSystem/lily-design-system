# FloatingPanel

## Metadata

- Component: floating-panel
- PascalCase: FloatingPanel
- Description: a panel that floats above page content
- HTML tag: <div>
- CSS class: .floating-panel
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="region"` only when the `open` prop is true
- Uses conditional rendering (fully removed from DOM when closed)
- Accepts a `children` slot for panel content
- Provides `aria-label` for accessible naming of the panel region
- Spreads `restProps` for consumer customization (e.g., positioning attributes)

## ARIA

- `role="region"` -- identifies the panel as a landmark region
- `aria-label="..."` -- provides an accessible name for the region

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `open`: boolean (default: `false`) -- whether the panel is visible
- `label`: string (required) -- accessible name for the panel region via `aria-label`
- `children`: slot (required) -- panel content to render inside
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="floating-panel"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .floating-panel in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/floating-panel.html
- WAI-ARIA Practices - Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
