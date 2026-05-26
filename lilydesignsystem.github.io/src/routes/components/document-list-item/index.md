# DocumentListItem

One document entry in a document list.

## Implementation Notes

- Renders an `<li>` containing the document title (as a link), file type, file size, and optional last-modified date
- Title is rendered as an `<a download>` so browsers offer a download dialog
- Metadata (type, size, modified) is rendered in `<span>` elements
- Spreads `restProps` onto the root `<li>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | string (required) | — | Document title (link text) |
| `href` | string (required) | — | Document URL |
| `type` | string | — | File type label, e.g. `"PDF"`, `"DOCX"` |
| `size` | string | — | File size, e.g. `"1.2 MB"` |
| `modified` | string | — | Last-modified date string |
| `...restProps` | HTML attributes | — | Spread onto the root `<li>` |

## Usage

```html
<DocumentListItem title="Annual report" href="/annual.pdf" type="PDF" size="1.2 MB" modified="14 January 2026" />
```

## Keyboard Interactions

- Tab moves focus onto the document link
- Enter activates the link to download the document (native browser behaviour)

## ARIA

- Native anchor and list-item semantics
- The link's accessible name combines the title and the file type/size when announced by screen readers

## When to Use

- As a child of `DocumentList`

## When Not to Use

- Use `DownloadButton` for a single, prominent download action

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.document-list-item` as the root class. No default styles are included.

## Related components

- `document-list` — parent list
- `download-button` — single download link styled as a button

## References

- [MDN download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
