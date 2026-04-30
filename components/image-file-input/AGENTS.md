# ImageFileInput

## Metadata

- Component: image-file-input
- PascalCase: ImageFileInput
- Description: an input for selecting image files with preview
- HTML tag: <input>
- CSS class: .image-file-input
- Interactive: no

## Key Behaviors

- Renders a single `<input type="file">` element with `accept="image/*"` by default.
- Uses `aria-label` for accessible naming since there is no visible `<label>` element.
- Supports `required` and `disabled` native input attributes.
- The `accept` prop defaults to `"image/*"` but can be narrowed (e.g., `"image/png, image/jpeg"`).
- Spreads `restProps` onto the `<input>` for consumer customization.

## ARIA

- `aria-label` -- provides an accessible name for the file input when no visible label is present.

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `accept`: string (default: `"image/*"`) -- MIME type filter for the file picker dialog.
- `required`: boolean (default: `false`) -- whether the input is required for form submission.
- `disabled`: boolean (default: `false`) -- whether the input is disabled.
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element.

## Acceptance Criteria

- [ ] Renders <input> element with class="image-file-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .image-file-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/image-file-input.html
- MDN Input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
