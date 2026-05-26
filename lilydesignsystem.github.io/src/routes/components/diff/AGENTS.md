# Diff

## Metadata

- Component: diff
- PascalCase: Diff
- Description: a side-by-side comparison of two items
- HTML tag: <div>
- CSS class: .diff
- Interactive: no

## Key Behaviors

- Renders a `<div>` element as the comparison container
- `role="group"` with `aria-label` identifies the comparison region
- Consumer provides two child elements representing the items to compare
- Supports labeling each side (e.g., "Before" and "After")
- Spreads `restProps` onto the `<div>` for consumer customization

## ARIA

- `role="group"` with `aria-label` identifies the comparison region
- Each side can use `aria-label` to describe its role

## Keyboard

- Tab: Focus moves between interactive elements within the comparison panels
- (Keyboard interactions depend on the content placed within the diff panels)

## Props

- `label`: string (required) -- accessible name describing the comparison
- `children`: slot (required) -- two child elements representing the items to compare
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="diff"
- [ ] Has role="group" with aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .diff in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/diff.html
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
