# Hint

## Metadata

- Component: hint
- PascalCase: Hint
- Description: hint text providing guidance for a form field
- HTML tag: <span>
- CSS class: .hint
- Interactive: no

## Key Behaviors

- Renders a `<p>` element containing the children slot
- Accepts an optional `id` prop for `aria-describedby` linking with form controls
- Spreads `restProps` onto the `<p>` for consumer customization
- The consumer is responsible for adding `aria-describedby` to the associated input

## ARIA

- `id={id}` -- provides a target for `aria-describedby` on the associated form control

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `id`: string (default: undefined) -- ID for linking via `aria-describedby` on the associated form control
- `children`: slot (required) -- hint text content

## Acceptance Criteria

- [ ] Renders <span> element with class="hint"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hint in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hint.html
- WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/
