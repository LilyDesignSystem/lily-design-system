# DownloadButton

A download link styled as a button, with optional file size and format metadata. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no styles
- Renders an `<a>` element so consumers can right-click and save
- `href` and `label` are **required** and non-optional in the TypeScript interface
- Pre-formatted file size and format are exposed as data attributes for styling and progressive enhancement

## Props

- `href`: string (**required**) — file URL
- `label`: string (**required**) — accessible label (rendered as `aria-label`)
- `fileSize`: string (optional) — pre-formatted file size text (e.g., `"2.4 MB"`), exposed as `data-file-size`
- `fileFormat`: string (optional) — file format text (e.g., `"PDF"`), exposed as `data-file-format`
- `download`: string | boolean (optional) — native `download` attribute. `true` enables download with no filename; a string sets the suggested filename
- default slot — button content; defaults to `label` text if omitted

## Usage

```vue
<DownloadButton
    href="/files/report.pdf"
    label="Download annual report PDF, 2.4 megabytes"
    file-size="2.4 MB"
    file-format="PDF"
    download
>
    Download annual report
</DownloadButton>
```

## ARIA

- Implicit link semantics
- `aria-label` provides a descriptive accessible name including download intent

## When to Use

- Offering downloadable assets such as PDFs, ZIPs, installers, or media files
- Anywhere consumers need right-click "save as" support

## When Not to Use

- For in-page actions that do not download — use `Button`
- For navigation between pages — use a regular link

## Headless

The component renders a native `<a>` and applies the `href`, `aria-label`, and `download` attributes. Consumers supply all visual styling.

## Testing

- Verify the root `download-button` class and `aria-label`
- Verify `href` pass-through
- Verify `data-file-size` and `data-file-format` pass-through
- Verify the `download` attribute is applied for both string and boolean values

## References

- [MDN - a download attribute](https://developer.mozilla.org/docs/Web/HTML/Element/a#download)
- [Mozilla Protocol Design System](https://protocol.mozilla.org)
