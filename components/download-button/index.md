# Download Button

A download button is a hyperlink styled as a button that points to a
downloadable file. It uses an `<a>` element (not `<button>`) so that users
can right-click and "Save link as…", and so that the native `download`
attribute can suggest a filename.

Use it for prominent download calls-to-action such as installer downloads,
PDF reports, datasets, exported files, and signed asset bundles.

## Implementation Notes

- Uses an `<a>` element so right-click "Save link as" works and the `download` attribute can apply
- `href` is **required** — the URL of the file
- `label` is **required** — sets `aria-label` so the accessible name reflects the download intent
- `fileSize` and `fileFormat` are surfaced as `data-file-size` and `data-file-format` for consumer styling
- `download` boolean `true` renders bare `download` (browser-suggested filename); a string sets the suggested filename
- Children render the visible button content; defaults to `label` when omitted

## Props

- `href`: string (**required**) -- file URL
- `label`: string (**required**) -- aria-label and default visible text
- `fileSize`: string (optional) -- pre-formatted size text (e.g., "2.4 MB")
- `fileFormat`: string (optional) -- file format text (e.g., "PDF")
- `download`: string | boolean (optional) -- native download attribute
- `children`: slot (optional) -- visible button content; defaults to `label`
- `...restProps`: any additional HTML attributes

## Usage

Basic download link:

```html
<DownloadButton href="/files/report.pdf" label="Download annual report (PDF, 2.4 MB)">
  Download report
</DownloadButton>
```

With download attribute and metadata:

```html
<DownloadButton
  href="/files/report.pdf"
  label="Download annual report"
  fileSize="2.4 MB"
  fileFormat="PDF"
  download="annual-report-2025.pdf"
>
  Download report
</DownloadButton>
```

## Keyboard Interactions

- Tab: Focus the link
- Enter: Activate the link (download or navigate)
- (All handled natively by `<a>` element)

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` provides the descriptive accessible name including download intent (required)
- `data-file-size` and `data-file-format` are non-ARIA hooks for consumer styling

## When to Use

- Use for prominent file downloads (installers, PDFs, datasets) where the action is the primary call to action.
- Use when the user benefits from a suggested filename via the native `download` attribute.
- Use when right-click "Save link as" is desired behavior.

## When Not to Use

- Do not use for in-app actions that do not download a file — use Button instead.
- Do not use for cross-origin URLs where the `download` attribute will be ignored without proper headers.
- Do not omit `label` — the accessible name should describe what is being downloaded.

## Headless

Renders a native `<a>` element with `href`, `aria-label`, optional `download`,
and optional `data-*` attributes. Visual button styling, file-format icons,
and metadata layout are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `download-button` class. Style it as a button with
a clear focus indicator and hover/active feedback. Use the `data-file-size`
and `data-file-format` attributes to render badges or pseudo-element labels.

## Testing

- Verify the component renders an `<a>` element with class `download-button`
- Verify `href` is present and equals the `href` prop
- Verify `aria-label` is present and equals the `label` prop
- Verify `data-file-size` is rendered when `fileSize` is provided
- Verify `data-file-format` is rendered when `fileFormat` is provided
- Verify `download` is rendered as bare attribute when `download={true}` and as filename when a string

## Advice

- **Designers**: Make file format and size visible (PDF, 2.4 MB) so users know what they are downloading. Use the same focus and hover treatment as other primary buttons.
- **Developers**: Pre-format `fileSize` in the consumer's locale. Use the `download` attribute only for same-origin URLs or cross-origin URLs that send appropriate `Content-Disposition` headers.

## Related components

- `button` — a generic clickable button element
- `document-list-item` — one document entry in a document list
- `file-input` — an input for selecting files from the file system <input type="file">

## References

- MDN `<a>` download attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download
- WAI-ARIA Link Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/link/
- Mozilla Protocol Design System: https://protocol.mozilla.org/
