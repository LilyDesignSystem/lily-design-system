# Citation

## Metadata

- Component: citation
- PascalCase: Citation
- Description: a citation acknowledges the relevance of a work of another to the topic of discussion
- HTML tag: <cite>
- CSS class: .citation
- Interactive: no

## Key Behaviors

- Renders a `<cite>` element for citation semantics
- Consumer provides the citation text as children
- The `<cite>` element should contain the title of the referenced work
- Spreads `restProps` onto the `<cite>` for consumer customization

## ARIA

- Implicit semantics from the `<cite>` element
- No additional ARIA attributes required for standard usage

## Keyboard

- None (passive inline element)

## Props

- `children`: slot (required) -- citation text, typically the title of the referenced work
- `...restProps`: unknown -- additional attributes spread onto the `<cite>` element

## Acceptance Criteria

- [ ] Renders <cite> element with class="citation"
- [ ] Implicit citation semantics from <cite> element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .citation in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/citation.html
- MDN HTML cite element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite
