# Option

## Metadata

- Component: option
- PascalCase: Option
- Description: an option element within a select dropdown
- HTML tag: <option>
- CSS class: .option
- Interactive: no

## Key Behaviors

- Wraps native `<option>` element with runes
- Uses `children` slot for label text content
- Supports `selected` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<option>` element
- All text content comes through children and props for internationalization

## ARIA

- Native `<option>` provides built-in accessibility via the parent `<select>` element
- Screen readers announce the option text and selected state automatically

## Keyboard

- Native `<option>` keyboard behavior (managed by parent `<select>`)

## Props

- `value`: string (required) -- the option value submitted with the form
- `selected`: boolean (default: false) -- whether this option is pre-selected
- `disabled`: boolean (default: false) -- whether this option is disabled
- `children`: slot (required) -- option label text
- `...restProps`: Any additional HTML attributes passed to the `<option>` element

## Acceptance Criteria

- [ ] Renders <option> element with class="option"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .option in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/option.html
- HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
