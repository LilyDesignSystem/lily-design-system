# FileInput

## Metadata

- Component: file-input
- PascalCase: FileInput
- Description: an input for selecting files from the file system <input type="file">
- HTML tag: <input>
- CSS class: .file-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="file">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports `accept` attribute for restricting file types (e.g., `"image/*"`, `".pdf,.doc"`)
- Supports `multiple` attribute for allowing selection of more than one file
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `capture`, event handlers)

## ARIA

- `aria-label={label}` -- provides an accessible name for the file input since no visible `<label>` element is included

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `accept`: string (default: `undefined`) -- comma-separated list of accepted file types (MIME types or extensions)
- `multiple`: boolean (default: `false`) -- whether multiple files can be selected
- `required`: boolean (default: `false`) -- whether a file selection is required
- `disabled`: boolean (default: `false`) -- whether the file input is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input> element with class="file-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .file-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/file-input.html
- MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
