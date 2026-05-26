# AccordionCheckbox

## Metadata

- Component: accordion-checkbox
- PascalCase: AccordionCheckbox
- Description: a checkbox option that reveals an accordion panel when checked
- HTML tag: <div>
- CSS class: .accordion-checkbox
- Interactive: yes

## Key Behaviors

- Renders a `<div class="accordion-checkbox">` containing a `<label>` + `<input type="checkbox">` + revealable panel `<div>`
- Auto-generates a unique id linking the checkbox and the panel so `aria-controls` and `<label for>` resolve correctly
- Toggles `aria-expanded` on the checkbox and the `hidden` attribute on the panel together when checked changes
- Panel uses `role="region"` + `aria-labelledby` so it is announced as a labeled region tied to the checkbox
- Supports two-way binding on the `checked` prop
- Spreads `restProps` onto the root `<div>` for consumer customization

## ARIA

- `aria-controls` on `<input>` references the panel id
- `aria-expanded` on `<input>` reflects the checked state ("true" when checked)
- `role="region"` and `aria-labelledby` on the panel
- `hidden` attribute on the panel when unchecked

## Keyboard

- Tab: moves focus onto the checkbox
- Space: toggles the checkbox checked state, revealing or hiding the panel (native checkbox behavior)

## Props

- `label`: string (required) — the checkbox label text
- `checked`: boolean (default: false) — whether the checkbox is checked and the panel is revealed; bindable
- `id`: string (optional) — base id for the checkbox/panel link; auto-generated if not provided
- `children`: slot (required) — content shown when the checkbox is checked

## Acceptance Criteria

- [ ] Renders a `<div>` element with class="accordion-checkbox"
- [ ] Contains an `<input type="checkbox">` with class="accordion-checkbox-input"
- [ ] Contains a `<label>` with class="accordion-checkbox-label" linked to the checkbox via `for`
- [ ] Contains a panel `<div>` with class="accordion-checkbox-panel"
- [ ] `aria-controls` on the checkbox matches the panel id
- [ ] `aria-expanded` on the checkbox reflects the checked state
- [ ] Panel has `role="region"` and `aria-labelledby` referencing the checkbox id
- [ ] Panel has the `hidden` attribute when unchecked, removed when checked
- [ ] Toggling the checkbox via Space toggles panel visibility
- [ ] Two-way binding on `checked` works
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .accordion-checkbox in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-checkbox.html
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- MDN input type=checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- MDN aria-controls: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls
- MDN hidden attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
