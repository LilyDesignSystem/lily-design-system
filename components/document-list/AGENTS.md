# DocumentList

## Metadata

- Component: document-list
- PascalCase: DocumentList
- Description: a list displaying documents with titles and metadata
- HTML tag: <ol>
- CSS class: .document-list
- Interactive: no

## Key Behaviors

- Renders an `<ol>` of `DocumentListItem` children
- Used to list downloadable or related documents (PDFs, attachments, references)
- Spreads `restProps` onto the root `<ol>`

## ARIA

- Native ordered list semantics

## Keyboard

- No keyboard interactions on the list itself

## Props

- `children`: slot (required) (default: —) — `DocumentListItem` children
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<ol>`

## Acceptance Criteria

- [ ] Renders <ol> element with class="document-list"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.document-list` in css-style-sheet-template.css
- [MDN ol element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
