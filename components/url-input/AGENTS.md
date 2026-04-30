# UrlInput

## Metadata

- Component: url-input
- PascalCase: UrlInput
- Description: an input for entering a URL <input type="url">
- HTML tag: <input>
- CSS class: .url-input
- Interactive: no

## Key Behaviors

- Renders a single `<input type="url">` element for semantic URL input with built-in validation
- Supports two-way binding for the `value` prop enabling two-way data binding with two-way `value` binding
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `placeholder`, `pattern`, `class`)
- Browser-native validation requires a valid URL format (including protocol) on form submission when `required` is set

## ARIA

- `aria-label={label}` -- provides the accessible name for the URL input since no visible label element is associated

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current URL value, bindable with two-way `value` binding
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="url-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .url-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/url-input.html
- MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url
