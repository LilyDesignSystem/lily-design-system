# DownloadButton

a download link styled as a button, with optional file size and format
metadata

## Description

DownloadButton is a native `<a>` anchor with the `download` attribute,
not a `<button>`. Anchors let users right-click to "Save Link As…",
share, copy, or middle-click to open in a new tab — affordances that
disappear on `<button>` elements.

The component exposes file metadata (`fileSize`, `fileFormat`) as
`data-file-size` and `data-file-format` attributes so consumers can
style visible chips/badges from the same data.

## HTML tag

`<a>`

## CSS class

`download-button`

## Params

- `href` — string. **Required.** File URL.
- `label` — string. **Required.** `aria-label`. Should describe the
  download intent (e.g., `"Download annual report (PDF, 2.4 MB)"`).
- `text` — string. Plain text content (escaped). Defaults to `label`.
- `html` — string. Raw HTML content (rendered via `| safe`).
- `fileSize` — string. Pre-formatted file size (e.g., `"2.4 MB"`).
- `fileFormat` — string. File format text (e.g., `"PDF"`).
- `download` — string or boolean. Native `download` attribute. `true`
  renders the attribute with no filename; a string sets the filename.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/download-button/macro.njk" import downloadButton %}

{{ downloadButton({
  href: "/files/report.pdf",
  label: "Download annual report (PDF, 2.4 MB)",
  fileSize: "2.4 MB",
  fileFormat: "PDF",
  download: true
}) }}
```

With a custom filename:

```njk
{{ downloadButton({
  href: "/files/raw.pdf",
  label: "Download report",
  download: "annual-report-2025.pdf"
}) }}
```

## Accessibility

- The `aria-label` provides the entire accessible name. Include the
  word "Download" plus the file format and size so screen reader
  users know what will happen on activation.
- Anchors retain native keyboard behaviour (Enter activates).

## When to use

- Direct file downloads (PDFs, CSVs, images, archives).

## When not to use

- For in-page actions or AJAX submissions, use `Button` instead.

## Headless

No CSS or JavaScript bundled. Consumers provide all styling.

## Testing

`components/download-button/macro.test.js` verifies the base class,
`href`, `aria-label`, `data-file-size`, `data-file-format`, and the
boolean/string variants of the `download` attribute.

## References

- [MDN: `download` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
- [Mozilla Protocol: Download Button](https://protocol.mozilla.org/components/detail/download-button)

---

Lily™ and Lily Design System™ are trademarks.
