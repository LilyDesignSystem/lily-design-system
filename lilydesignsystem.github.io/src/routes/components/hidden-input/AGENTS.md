# HiddenInput

## Metadata

- Component: hidden-input
- PascalCase: HiddenInput
- Description: a hidden input for including data in form submission <input type="hidden">
- HTML tag: <input>
- CSS class: .hidden-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="hidden">` element
- Requires a `name` prop for the form field name
- The `value` prop defaults to an empty string
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `data-*` attributes)
- No ARIA attributes needed because hidden inputs are not perceivable by any user

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `name`: string (required) -- the form field name attribute
- `value`: string (default: `""`) -- the hidden input value
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## ARIA

- Native `<input type="hidden">` is non-interactive and not announced to assistive technology
- No ARIA attributes are needed; the value is part of form submission only

## Acceptance Criteria

- [ ] Renders <input> element with class="hidden-input"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hidden-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hidden-input.html
- HTML hidden input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden
