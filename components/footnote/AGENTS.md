# Footnote

## Metadata

- Component: footnote
- PascalCase: Footnote
- Description: a footnote reference and content element
- HTML tag: <span>
- CSS class: .footnote
- Interactive: no

## Key Behaviors

- Renders as `<aside>` with `role="note"` for semantic supplementary content
- The `id` prop serves double duty: it identifies the element for in-page linking and provides the `aria-label` value
- Accepts a `children` slot for flexible footnote content (text, links, citations)
- Spreads `restProps` onto the `<aside>` element for consumer customization

## ARIA

- `role="note"` -- indicates supplementary content that is related to the main content
- `aria-label="{id}"` -- provides an accessible name derived from the footnote identifier

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `id`: string (required) -- unique footnote identifier, used for the element id and aria-label
- `children`: slot (required) -- footnote content to render inside the aside

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
