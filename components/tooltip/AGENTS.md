# Tooltip

## Metadata

- Component: tooltip
- PascalCase: Tooltip
- Description: a small popup showing descriptive text on hover or focus
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .tooltip
- Interactive: yes

## Key Behaviors

- Renders a `<div popover="manual">` with `role="tooltip"`, always in the DOM; `display: none` while not visible
- Shown and hidden with the Popover API (the `hidden` attribute where it is missing)
- Supports two-way binding on the `visible` prop
- The consumer is responsible for managing visibility (e.g., on hover/focus of a trigger element)
- The `id` prop enables linking the tooltip to its trigger element via `aria-describedby`
- Spreads `restProps` onto the div element for consumer extensibility

## ARIA

- `role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- `id={id}` -- used with `aria-describedby` on the trigger element to create an accessible association between the trigger and the tooltip

## Keyboard

- Escape: The consumer should hide the tooltip when Escape is pressed (not built into the component; must be handled by the consumer)
- The tooltip itself does not receive focus; it is a supplementary description for another element

## Props

- `label`: string (required) -- the tooltip text content
- `visible`: boolean (default: false) -- bindable boolean controlling whether the tooltip is shown
- `id`: string (default: undefined) -- optional id for linking to a trigger element via `aria-describedby`
- `...restProps`: unknown -- additional attributes spread onto the tooltip div

## Native platform

- Decision: native
- Uses: div role="tooltip" popover="manual" shown from the visible state
- Could use: CSS anchor positioning (consumer sets position-anchor); popover="hint" and interestfor later
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor where the component has the state (Angular: combobox, mentions-input, popconfirm-dialog, tree-select; Blazor: combobox, popconfirm-dialog; the rest are static stubs), always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. interestfor is Chromium-only (Chrome 142; Firefox and Safari none in MDN BCD 2026-10-29) and popover="hint" is not Baseline, so hover and focus stay hand-rolled for now (WCAG 1.4.13 hoverable/dismissable).
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="tooltip"
- [ ] Has role="tooltip"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tooltip in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tooltip.html
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby
