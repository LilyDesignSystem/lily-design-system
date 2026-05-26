# SlideOutDrawer

## Metadata

- Component: slide-out-drawer
- PascalCase: SlideOutDrawer
- Description: a drawer that slides out from the side of the page
- HTML tag: <div>
- CSS class: .slide-out-drawer
- Interactive: yes

## Key Behaviors

- Renders as `<div role="dialog" aria-label={label} aria-modal="true">` when open
- Conditionally rendered with conditional rendering -- not in the DOM when closed
- The `open` prop is two-way binding
- Escape key closes the drawer via a keydown handler
- `tabindex="-1"` allows the dialog div to receive focus programmatically

## ARIA

- `role="dialog"` for modal dialog semantics
- `aria-label` from the label prop provides the accessible name
- `aria-modal="true"` indicates modal behavior (content behind the drawer is inert)
- `tabindex="-1"` for programmatic focus management

## Keyboard

- Escape closes the drawer

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, bindable
- `children`: slot (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="slide-out-drawer"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slide-out-drawer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/slide-out-drawer.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
