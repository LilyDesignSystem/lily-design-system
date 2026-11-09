# DocumentListItem

One document entry in a document list.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders an `<li>` around the consumer's content: typically the document link, its file type and size, and an optional last-modified date
- The component builds no link or metadata; the consumer writes the `<a>` (with `download` when the browser should offer to save it) and any `<span>` details
- No `label`: an `aria-label` on the `<li>` would replace the link text a screen reader announces
- Spreads `restProps` onto the root `<li>`

## Props

| Prop           | Type            | Default | Description                       |
| -------------- | --------------- | ------- | --------------------------------- |
| `children`     | slot (required) | —       | The document link and its details |
| `...restProps` | HTML attributes | —       | Spread onto the root `<li>`       |

## Usage

```html
<DocumentListItem>
  <a
    href="/annual.pdf"
    download
    >Annual report</a
  >
  <span>PDF</span>
  <span>1.2 MB</span>
</DocumentListItem>
```

## Keyboard Interactions

- Tab moves focus onto the document link
- Enter activates the link (native browser behaviour)

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

---

Lily™ and Lily Design System™ are trademarks.
