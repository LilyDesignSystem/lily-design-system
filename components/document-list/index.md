# DocumentList

A list displaying documents with titles and metadata.

## Implementation Notes

- Renders an `<ol>` of `DocumentListItem` children
- Used to list downloadable or related documents (PDFs, attachments, references)
- Spreads `restProps` onto the root `<ol>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | slot (required) | — | `DocumentListItem` children |
| `...restProps` | HTML attributes | — | Spread onto the root `<ol>` |

## Usage

```html
<DocumentList>
  <DocumentListItem title="Annual report 2025" href="/docs/annual-2025.pdf" type="PDF" size="1.2 MB" />
  <DocumentListItem title="Statement of accounts" href="/docs/accounts-2025.pdf" type="PDF" size="540 KB" />
</DocumentList>
```

## Keyboard Interactions

- No keyboard interactions on the list itself

## ARIA

- Native ordered list semantics

## When to Use

- Displaying a list of attachments, downloads, or related documents on a page

## When Not to Use

- Use `CollectionList` for general content collections (articles, products)
- Use `DataTable` when document metadata needs sortable columns

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.document-list` as the root class. No default styles are included.

## Related components

- `document-list-item` — child item
- `collection-list` — generic content collection
- `download-button` — single download link styled as a button

## References

- [MDN ol element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)

---

Lily™ and Lily Design System™ are trademarks.
