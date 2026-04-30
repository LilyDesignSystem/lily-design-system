# Label

## Metadata

- Component: label
- PascalCase: Label
- Description: a label associated with a form input
- HTML tag: <label>
- CSS class: .label
- Interactive: no

## Key Behaviors

- Renders a native `<label>` HTML element
- Uses the `for` prop (mapped from the reserved keyword via `for: forProp`) to associate with a form control by ID
- Content is provided via the `children` slot
- Rest props are spread onto the `<label>` element for consumer customization
- The `for` prop is optional, allowing labels to wrap their associated control directly

## ARIA

- The native `<label>` element with `for` attribute provides an implicit accessible name for the linked form control
- No additional ARIA attributes are needed because the semantic HTML `<label>` element is fully recognized by assistive technology

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `for`: string (optional) -- the `id` of the associated form control, rendered as the HTML `for` attribute
- `children`: slot (required) -- the label text content
- `...restProps`: unknown -- additional attributes spread onto the `<label>` element

## Acceptance Criteria

- [ ] Renders <label> element with class="label"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .label in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/label.html
- WAI Forms Tutorial - Labels: https://www.w3.org/WAI/tutorials/forms/labels/
- HTML label element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
