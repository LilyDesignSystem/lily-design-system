# ActionBar

## Metadata

- Component: action-bar
- PascalCase: ActionBar
- Description: a contextual action bar that appears when items are selected, showing the selection count and bulk action buttons
- HTML tag: <div> with role="toolbar"
- CSS class: .action-bar
- Interactive: yes

## Key Behaviors

- Renders a <div role="toolbar"> with required aria-label
- Exposes `selectedCount` via `data-selected-count` for CSS and tests
- Renders consumer-supplied `selectedCountLabel` (pre-formatted, locale-aware)
- Renders a dismiss/clear button only when both `clearSelectionLabel` and `onClearSelection` are provided
- Children are typically `action-bar-button` components

## ARIA

- `role="toolbar"` on the container
- `aria-label` is the accessible name (required)
- Clear button has its own `aria-label` via `clearSelectionLabel`
- `data-selected-count` is non-ARIA metadata for consumer CSS

## Keyboard

- Tab: Move focus into and out of the toolbar
- Arrow keys: (Consumer-provided) recommended roving tabindex among buttons
- Enter / Space: Activate focused action button
- Escape: (Consumer-provided) dismiss or clear selection

## Props

- `label`: string (REQUIRED) -- aria-label for the toolbar
- `selectedCount`: number (REQUIRED) -- count of currently selected items
- `selectedCountLabel`: string (REQUIRED) -- pre-formatted count text
- `clearSelectionLabel`: string (optional)
- `onClearSelection` / `onclearselection`: callback (optional)
- `children`: slot -- bulk action buttons
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with role="toolbar" and class="action-bar"
- [ ] aria-label is present and equals the label prop
- [ ] data-selected-count equals the selectedCount prop
- [ ] selectedCountLabel text is rendered inside the toolbar
- [ ] Clear button renders only when clearSelectionLabel AND onClearSelection are provided
- [ ] onClearSelection fires when the clear button is activated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .action-bar in css-style-sheet-template.css
- Adobe Spectrum Action Bar: https://spectrum.adobe.com/page/action-bar/
- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
