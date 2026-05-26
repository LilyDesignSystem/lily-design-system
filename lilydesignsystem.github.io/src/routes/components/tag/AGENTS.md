# Tag

## Metadata

- Component: tag
- PascalCase: Tag
- Description: a keyword label for categorizing content
- HTML tag: <span>
- CSS class: .tag
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `role="status"` and `aria-label`
- `role="status"` creates an implicit live region, so screen readers announce content changes
- All visible content is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `role="status"` -- identifies this as a live region for screen reader announcements of content changes
- `aria-label` -- provides an accessible name from the `label` prop, giving expanded context beyond the visible tag text

## Keyboard

- None -- tags are informational, not interactive

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `children`: slot (required) -- the tag's visible content (text, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="tag"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tag in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tag.html
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
