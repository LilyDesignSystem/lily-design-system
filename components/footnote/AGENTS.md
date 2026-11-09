# Footnote

## Metadata

- Component: footnote
- PascalCase: Footnote
- Description: a footnote reference and content element
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <span>
- CSS class: .footnote
- Interactive: no

## Key Behaviors

- Renders a `<span role="note">`, not an `<aside>`, so each footnote is not its own landmark
- The `id` prop identifies the element for in-page linking (the reference links to `#id`); it is not used as a name, since an identifier such as `fn-1` is not one
- Accepts a `children` slot for flexible footnote content (text, links, citations)
- Spreads `restProps` onto the `<span>` element for consumer customization

## ARIA

- `role="note"` -- indicates supplementary content that is related to the main content

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `id`: string (required) -- unique footnote identifier, used for the element id
- `children`: slot (required) -- footnote content to render inside the span

## Acceptance Criteria

- [ ] Renders <span> element with class="footnote"
- [ ] Has aria-label attribute
- [ ] Has role="note"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .footnote in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/footnote.html
- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- MDN aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
