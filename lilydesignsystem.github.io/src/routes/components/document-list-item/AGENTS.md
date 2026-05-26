# DocumentListItem

## Metadata

- Component: document-list-item
- PascalCase: DocumentListItem
- Description: one document entry in a document list
- HTML tag: <li>
- CSS class: .document-list-item
- Interactive: yes

## Key Behaviors

- Renders an `<li>` containing the document title (as a link), file type, file size, and optional last-modified date
- Title is rendered as an `<a download>` so browsers offer a download dialog
- Metadata (type, size, modified) is rendered in `<span>` elements
- Spreads `restProps` onto the root `<li>`

## ARIA

- Native anchor and list-item semantics
- The link's accessible name combines the title and the file type/size when announced by screen readers

## Keyboard

- Tab moves focus onto the document link
- Enter activates the link to download the document (native browser behaviour)

## Props

- `title`: string (required) (default: —) — Document title (link text)
- `href`: string (required) (default: —) — Document URL
- `type`: string (default: —) — File type label, e.g. `"PDF"`, `"DOCX"`
- `size`: string (default: —) — File size, e.g. `"1.2 MB"`
- `modified`: string (default: —) — Last-modified date string
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="document-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.document-list-item` in css-style-sheet-template.css
- [MDN download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
