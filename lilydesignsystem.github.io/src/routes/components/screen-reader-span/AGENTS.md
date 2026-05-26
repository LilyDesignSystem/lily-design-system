# ScreenReaderSpan

## Metadata

- Component: screen-reader-span
- PascalCase: ScreenReaderSpan
- Description: a visually hidden span of text intended for screen readers to provide more descriptive labels
- HTML tag: <span>
- CSS class: .screen-reader-span
- Interactive: no

## Key Behaviors

- Uses `<span>` element with visually-hidden CSS pattern
- Content is visible only to screen readers
- Remains in the accessibility tree

## ARIA

- No ARIA attributes needed -- the text content itself provides the accessible information

## Keyboard

- None -- screen reader spans are informational, not interactive

## Props

- `children`: slot (required) -- the text content for screen readers
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <span> element with class="screen-reader-span"
- [ ] Content is in the accessibility tree
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero visual presence

## References

- Documentation: index.md
- CSS class: .screen-reader-span in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/screen-reader-span.html
- WebAIM: https://webaim.org/techniques/css/invisiblecontent/
