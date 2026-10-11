# Tag

## Metadata

- Component: tag
- PascalCase: Tag
- Description: a keyword label for categorizing content
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <span>
- CSS class: .tag
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element; not a live region by default (decided 2026-10-11: a page of static tags should not be a page of live regions)
- `aria-label` is not allowed on a plain `<span>`, so by default the `label` is screen-reader text (`<span class="screen-reader-span">`, which the themes hide) appended after the content; the content is never hidden, since it may hold a control such as a remove button
- `live`: renders `role="status"` with `aria-label`, for a tag whose text changes in place (a job's status)

- All visible content is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- Default: no role; the `label` is screen-reader text after the content, for context the visible text lacks (visible "High", label "priority": read as "High priority")
- With `live`: `role="status"` (a polite live region) and `aria-label` from the `label` prop

## Keyboard

- None -- tags are informational, not interactive

## Props

- `label`: string (required) -- accessible label for screen readers: screen-reader text by default, `aria-label` when `live`
- `live`: boolean (default false) -- render a `role="status"` live region
- `children`: slot (required) -- the tag's visible content (text, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="tag"
- [ ] Not a live region by default; `label` rendered as screen-reader text after the content, nothing aria-hidden
- [ ] With `live`: role="status" and aria-label
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tag in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tag.html
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
