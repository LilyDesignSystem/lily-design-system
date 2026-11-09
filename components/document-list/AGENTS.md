# DocumentList

## Metadata

- Component: document-list
- PascalCase: DocumentList
- Description: a list displaying documents with titles and metadata
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <ul>
- CSS class: .document-list
- Interactive: no

## Key Behaviors

- Renders an `<ul>` of `DocumentListItem` children
- Used to list downloadable or related documents (PDFs, attachments, references)
- Spreads `restProps` onto the root `<ul>`

## ARIA

- Native ordered list semantics

## Keyboard

- No keyboard interactions on the list itself

## Props

- `children`: slot (required) (default: —) — `DocumentListItem` children
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<ul>`

## Acceptance Criteria

- [ ] Renders <ul> element with class="document-list"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.document-list` in css-style-sheet-template.css
- [MDN ol element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
