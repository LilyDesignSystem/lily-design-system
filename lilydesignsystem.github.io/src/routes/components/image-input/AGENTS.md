# ImageInput

## Metadata

- Component: image-input
- PascalCase: ImageInput
- Description: a graphical submit button that displays an image <input type="image">
- HTML tag: <input>
- CSS class: .image-input
- Interactive: yes

## Key Behaviors

- Renders a native `<input type="image">` element for graphical form submission
- The browser automatically triggers the containing form's `submit` event when clicked
- Submits the click coordinates (x, y) as part of the form data
- The `src` prop specifies the image URL to display
- The `alt` prop provides alternative text when the image cannot be displayed and serves as the accessible name
- Supports `width` and `height` props for image dimensions
- Supports `disabled` to prevent interaction
- Spreads `restProps` onto the input for consumer customization
- No additional ARIA attributes needed beyond the native semantics of `<input type="image">`

## Keyboard

- Enter: activates the image button and submits the form
- Space: activates the image button and submits the form

## Props

- `src`: string (required) -- URL of the image to display
- `alt`: string (required) -- alternative text for the image; serves as accessible name
- `width`: number | undefined (default: `undefined`) -- width of the image in pixels
- `height`: number | undefined (default: `undefined`) -- height of the image in pixels
- `disabled`: boolean (default: `false`) -- whether the button is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## ARIA

- Native `<input type="image">` exposes itself as a `button` to assistive technology
- `alt` (set from `label`) provides the accessible name — required

## Acceptance Criteria

- [ ] Renders <input> element with class="image-input"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .image-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/image-input.html
- MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image
- HTML spec input type="image": https://html.spec.whatwg.org/multipage/input.html#image-button-state-(type=image)
