# BackLink

## Metadata

- Component: back-link
- PascalCase: BackLink
- Description: a navigation link to return to a previous page
- Purpose: Takes people back to the page or step they came from. Use breadcrumbs to show the whole path.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <a>
- CSS class: .back-link
- Interactive: yes

## Key Behaviors

- Renders as a semantic `<a>` element for backward navigation
- Same HTML pattern as a standard link but semantically represents "going back"
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children slot
- Spreads `...restProps` onto the `<a>` element

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop

## Keyboard

- Tab: Focus the link
- Enter: Activate the link (browser default)

## Props

- `href`: string (required) -- the URL to navigate back to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: slot (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

## Acceptance Criteria

- [ ] Renders <a> element with class="back-link"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

### Disabled links and link look-alikes

A link has no disabled state: the `disabled` attribute has no effect. Prefer not rendering an unavailable link. When the unavailable item must remain visible, set `aria-disabled="true"`, omit `href` (or guard every pointer and keyboard activation if the URL must remain), and use `tabindex="-1"` so it is not a misleading tab stop. Add `role="link"` when an anchor without `href` must retain link semantics.

Use a native `<button>` for an action. Styling an anchor as a button does not give it button keyboard or disabled behavior.

## References

- Documentation: index.md
- CSS class: .back-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/back-link.html
