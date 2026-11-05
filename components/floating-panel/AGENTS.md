# FloatingPanel

## Metadata

- Component: floating-panel
- PascalCase: FloatingPanel
- Description: a panel that floats above page content
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .floating-panel
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="region"` only when the `open` prop is true
- Always rendered as `popover="manual"`; `display: none` while closed (the `hidden` attribute where the Popover API is missing)
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

## Native platform

- Decision: native
- Uses: div role="region" popover="manual" shown from the open state
- Could use: CSS anchor positioning (consumer sets position-anchor)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor where the component has the state (Angular: combobox, mentions-input, popconfirm-dialog, tree-select; Blazor: combobox, popconfirm-dialog; the rest are static stubs), always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. A generic container; the top layer removes the z-index and overflow-clipping problems consumers solve by hand.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

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
