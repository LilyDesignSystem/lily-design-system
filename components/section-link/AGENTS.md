# SectionLink

## Metadata

- Component: section-link
- PascalCase: SectionLink
- Description: one section link in the navigation
- Purpose: Links to one section in a section navigation.
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <a>
- CSS class: .section-link
- Interactive: yes

## Key Behaviors

- Renders an `<a>` linking to a section page
- When `current` is true, sets `aria-current="page"` to mark the active section
- Spreads `restProps` onto the root `<a>`

## ARIA

- Native anchor accessibility
- `aria-current="page"` when `current` is true

## Keyboard

- Tab moves focus onto the link
- Enter activates the link (native browser behaviour)

## Props

- `href`: string (required) (default: —) — Link target
- `current`: boolean (default: false) — Whether this link represents the current page
- `children`: slot (required) (default: —) — Link text
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<a>`

## Acceptance Criteria

- [ ] Renders <a> element with class="section-link"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

### Disabled links and link look-alikes

A link has no disabled state: the `disabled` attribute has no effect. Prefer not rendering an unavailable link. When the unavailable item must remain visible, set `aria-disabled="true"`, omit `href` (or guard every pointer and keyboard activation if the URL must remain), and use `tabindex="-1"` so it is not a misleading tab stop. Add `role="link"` when an anchor without `href` must retain link semantics.

Use a native `<button>` for an action. Styling an anchor as a button does not give it button keyboard or disabled behavior.

## References

- Documentation: index.md
- CSS class: `.section-link` in css-style-sheet-template.css
- [MDN aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
