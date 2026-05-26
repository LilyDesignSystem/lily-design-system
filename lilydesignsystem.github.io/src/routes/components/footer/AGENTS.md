# Footer

## Metadata

- Component: footer
- PascalCase: Footer
- Description: a page or section footer area
- HTML tag: <footer>
- CSS class: .footer
- Interactive: no

## Key Behaviors

- Renders a semantic `<footer>` element, which provides the `contentinfo` landmark role
- Supports an optional `aria-label` for distinguishing multiple footers on the same page
- Spreads `restProps` onto the `<footer>` element for consumer customization

## ARIA

- `contentinfo` landmark role -- provided natively by the `<footer>` element, allowing screen reader users to navigate directly to the footer
- `aria-label` -- optional accessible name to distinguish this footer from others on the page

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: undefined) -- optional accessible name via `aria-label`, useful when multiple footers exist
- `children`: slot (required) -- footer content

## Acceptance Criteria

- [ ] Renders <footer> element with class="footer"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .footer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/footer.html
