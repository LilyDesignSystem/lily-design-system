# Drawer

## Metadata

- Component: drawer
- PascalCase: Drawer
- Description: a panel that slides in from the edge of the screen
- HTML tag: <div>
- CSS class: .drawer
- Interactive: yes

## Key Behaviors

- Conditionally renders a `<div>` with `role="dialog"` only when `open` is true
- Supports two-way binding on the `open` prop for two-way state binding
- Sets `aria-modal="true"` to indicate the drawer is a modal dialog
- Exposes `data-side` attribute for consumer CSS positioning (left, right, top, bottom)
- Sets `tabindex="-1"` to allow the drawer to receive focus programmatically
- Escape key handler sets `open` to `false`

## ARIA

- `role="dialog"` -- identifies the drawer as a dialog for assistive technology
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- indicates the drawer is modal, restricting interaction to its contents
- `data-side={side}` -- data attribute for consumer CSS styling based on drawer position

## Keyboard

- Escape: closes the drawer by setting `open` to `false`

## Props

- `open`: boolean (default: false) -- whether the drawer is visible, two-way bindable via `open`
- `label`: string (required) -- accessible name for the drawer
- `side`: "left" | "right" | "top" | "bottom" (default: "left") -- which edge the drawer enters from
- `children`: slot (required) -- drawer content

## Acceptance Criteria

- [ ] Renders <div> element with class="drawer"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .drawer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/drawer.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
