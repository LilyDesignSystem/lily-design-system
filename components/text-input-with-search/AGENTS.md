# TextInputWithSearch

## Metadata

- Component: text-input-with-search
- PascalCase: TextInputWithSearch
- Description: a single-line text input field <input type="text"> with search capability
- HTML tag: <div>
- CSS class: .text-input-with-search
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing a text input and a search button
- The text input is `<input type="text">` for entering a search query
- The search button is `<button type="button">` that triggers the search callback
- Uses `aria-label` for accessible naming on the input and the button
- Supports two-way binding on the `value` prop
- The search callback receives the current input value
- Pressing Enter in the input also triggers the search callback
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## ARIA

- `role="search"` -- on the wrapper `<div>` to establish a search landmark
- `aria-label={label}` -- provides an accessible name for the search region
- `aria-label={inputLabel}` -- provides an accessible name for the text input
- `aria-label={searchLabel}` -- provides an accessible name for the search button

## Keyboard

- Tab: Moves focus between the text input and search button
- Enter in the text input: Triggers the search callback
- Enter/Space on the search button: Triggers the search callback

## Props

- `label`: string (required) -- accessible name for the search region via `aria-label`
- `inputLabel`: string (default: "Search") -- accessible name for the text input via `aria-label`
- `searchLabel`: string (default: "Search") -- accessible label and text for the search button
- `value`: string (default: "") -- bindable text input value
- `placeholder`: string (optional) -- placeholder text for the input
- `onsearch`: `(value: string) => void` (optional) -- callback when search is triggered
- `required`: boolean (default: false) -- whether the input is required
- `disabled`: boolean (default: false) -- whether the input and button are disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="text-input-with-search"
- [ ] Has role="search" and aria-label
- [ ] Contains <input type="text"> with aria-label
- [ ] Contains <button type="button"> with aria-label
- [ ] Enter in input triggers search
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .text-input-with-search in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/text-input-with-search.html
- MDN text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- WAI-ARIA search role: https://www.w3.org/TR/wai-aria-1.2/#search
