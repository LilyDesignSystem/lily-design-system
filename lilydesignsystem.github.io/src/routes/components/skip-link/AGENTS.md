# SkipLink

## Metadata

- Component: skip-link
- PascalCase: SkipLink
- Description: a hidden link for keyboard users to skip to main content
- HTML tag: <a>
- CSS class: .skip-link
- Interactive: yes

## Key Behaviors

- Renders an `<a>` element with the `href` pointing to the target content anchor
- Default `href` is `"#content"` and default `label` is `"Skip to content"`, both configurable
- The label text is rendered as the link's text content (not via `aria-label`)
- Consumer is responsible for styling the link (typically visually hidden until `:focus`)
- Consumer must ensure the target element exists with a matching `id` attribute
- Spreads `restProps` onto the anchor for consumer customization
- No slot import needed since this component does not use children

## ARIA

- No explicit ARIA roles or attributes are needed; the `<a>` element with an `href` is natively accessible as a link
- The link text content (`label` prop) serves as the accessible name

## Keyboard

- Tab: Moves focus to the skip link (should be the first focusable element on the page)
- Enter: Activates the link, moving focus to the target anchor element

## Props

- `href`: string (default: `"#content"`) -- the anchor target that the link navigates to
- `label`: string (default: `"Skip to content"`) -- the visible link text
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Acceptance Criteria

- [ ] Renders <a> element with class="skip-link"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .skip-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/skip-link.html
- WCAG 2.1 Bypass Blocks: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
- WAI-ARIA Authoring Practices - Skip Navigation: https://www.w3.org/WAI/ARIA/apg/practices/skip-nav/
- WebAIM Skip Navigation Links: https://webaim.org/techniques/skipnav/
