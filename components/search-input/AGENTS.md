# SearchInput

## Metadata

- Component: search-input
- PascalCase: SearchInput
- Description: an input for entering a search query <input type="search">
- HTML tag: <input>
- CSS class: .search-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="search">` element for semantic search behavior
- Supports two-way binding for the `value` prop enabling two-way data binding with two-way `value` binding
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `placeholder`, `class`)
- The search type may trigger browser-native clear buttons and search-specific behaviors

## ARIA

- `aria-label={label}` -- provides the accessible name for the search field since no visible label element is associated

## Keyboard

- Escape: clears the search field (browser-native behavior for search inputs)
- Enter: submits the containing form (standard input behavior)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current search text, bindable with two-way `value` binding
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="search-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .search-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/search-input.html
- WAI-ARIA Search Role: https://www.w3.org/WAI/ARIA/apg/patterns/search/
- MDN input type="search": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
