# DownloadButton

A download link styled as a button, with optional file size and format metadata. Implemented as an `<a>` so users can right-click and save the file, with the native `download` attribute applied.

## Implementation Notes

- `href` is **required** — every download must point to a target file
- `label` is **required** and is set as `aria-label` and as the default visible text
- The `download` prop maps to the native HTML `download` attribute (boolean `true` sets it with no filename; a string sets the filename)
- `fileSize` and `fileFormat` are exposed as `data-file-size` and `data-file-format` for consumer styling

## Props

- `href`: string (**required**) -- file URL
- `label`: string (**required**) -- accessible label and default text
- `fileSize`: string (optional) -- e.g. `"2.4 MB"`
- `fileFormat`: string (optional) -- e.g. `"PDF"`
- `download`: string | boolean (default `true`) -- native download attribute
- `className`: string (optional)
- `children`: ReactNode (optional) -- visible content; falls back to `label`
- `...restProps`: any additional HTML attributes passed to the `<a>`

## Usage

```tsx
<DownloadButton
  href="/files/report.pdf"
  label="Download annual report (PDF, 2.4 MB)"
  fileSize="2.4 MB"
  fileFormat="PDF"
  download="annual-report.pdf"
>
  Download report
</DownloadButton>
```

## ARIA

- Implicit link semantics
- `aria-label` provides a descriptive name including download intent
