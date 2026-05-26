# Skeleton

## Metadata

- Component: skeleton
- PascalCase: Skeleton
- Description: a placeholder loading animation for content
- HTML tag: <div>
- CSS class: .skeleton
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `aria-hidden="true"` so screen readers completely skip the placeholder
- Uses `aria-busy="true"` to signal to assistive technology that the region is loading
- Accepts an optional `children` slot for placeholder shapes (e.g., lines, circles, rectangles)
- Spreads `restProps` for consumer customization (e.g., sizing, data attributes)

## ARIA

- `aria-hidden="true"` -- hides the placeholder entirely from screen readers
- `aria-busy="true"` -- signals that this region is in a loading state and content will be replaced

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (default: `undefined`) -- optional placeholder content (e.g., skeleton line shapes)
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="skeleton"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .skeleton in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/skeleton.html
- WAI-ARIA `aria-busy`: https://www.w3.org/WAI/ARIA/apd/states/aria-busy/
- MDN `aria-hidden`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
