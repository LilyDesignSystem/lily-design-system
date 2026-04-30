# Input

## Metadata

- Component: input
- PascalCase: Input
- Description: a generic HTML input element
- HTML tag: <input>
- CSS class: .input
- Interactive: no

## Key Behaviors

- Renders a single `<input>` element with the specified `type` attribute.
- Uses `aria-label` for accessible naming since there is no built-in visible `<label>` element.
- The `value` prop uses two-way binding of the input text.
- The `type` prop defaults to `"text"` but accepts any valid HTML input type string.
- Supports native `required` and `disabled` attributes.
- Spreads `restProps` onto the `<input>` for consumer customization (e.g., `placeholder`, `maxlength`, `pattern`).

## ARIA

- `aria-label` -- provides an accessible name for the input when no visible label is present.

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `value`: string (default: `""`) -- bindable current input value.
- `type`: string (default: `"text"`) -- HTML input type attribute (e.g., `"text"`, `"email"`, `"password"`, `"number"`).
- `required`: boolean (default: `false`) -- whether the input is required for form submission.
- `disabled`: boolean (default: `false`) -- whether the input is disabled.
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element.

## Acceptance Criteria

- [ ] Renders <input> element with class="input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/input.html
- MDN Input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
- WAI-ARIA Forms: https://www.w3.org/WAI/tutorials/forms/
