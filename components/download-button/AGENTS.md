# DownloadButton

## Metadata

- Component: download-button
- PascalCase: DownloadButton
- Description: a download link styled as a button, with optional file size and format metadata
- HTML tag: <a>
- CSS class: .download-button
- Interactive: yes

## Key Behaviors

- Uses <a> (not <button>) so right-click "Save link as" works and download attribute applies
- href is REQUIRED — the URL of the file
- label is REQUIRED — sets aria-label so the accessible name reflects download intent
- fileSize surfaces as data-file-size for consumer styling
- fileFormat surfaces as data-file-format for consumer styling
- download=true renders bare download attribute; download="name.ext" sets suggested filename
- Children default to label when omitted

## ARIA

- Implicit `link` role from <a> element
- aria-label provides descriptive accessible name (required)
- data-file-size and data-file-format are non-ARIA styling hooks

## Keyboard

- Tab: Focus the link
- Enter: Activate the link (download or navigate)
- (All handled natively by <a> element)

## Props

- `href`: string (REQUIRED) -- file URL
- `label`: string (REQUIRED) -- aria-label and default visible text
- `fileSize`: string (optional) -- pre-formatted size text
- `fileFormat`: string (optional) -- file format text
- `download`: string | boolean (optional) -- native download attribute
- `children`: slot (optional) -- defaults to label
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <a> element with class="download-button"
- [ ] href present and equals href prop
- [ ] aria-label present and equals label prop
- [ ] data-file-size rendered when fileSize provided
- [ ] data-file-format rendered when fileFormat provided
- [ ] download rendered as bare attribute when download=true
- [ ] download rendered as filename when download is a string
- [ ] Children default to label when omitted
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .download-button in css-style-sheet-template.css
- MDN <a> download attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download
- Mozilla Protocol Design System: https://protocol.mozilla.org/
