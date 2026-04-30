# Separator

## Metadata

- Component: separator
- PascalCase: Separator
- Description: a horizontal or vertical divider between content sections
- HTML tag: <hr>
- CSS class: .separator
- Interactive: no

## Key Behaviors

- Renders a single `<hr>` element with explicit `role="separator"`
- The `<hr>` element is a void element (no children or closing tag)
- Optional `aria-label` provides descriptive context for screen readers
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)
- The explicit `role="separator"` reinforces the semantic meaning beyond the native `<hr>` role

## ARIA

- `role="separator"` -- explicitly identifies the element as a separator between sections of content
- `aria-label={label}` -- optional descriptive label for the separator, announced by screen readers when present

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: undefined) -- optional accessible label describing the separation, applied via `aria-label`
- `...restProps`: spread onto the `<hr>` element

## Acceptance Criteria

- [ ] Renders <hr> element with class="separator"
- [ ] Has aria-label attribute
- [ ] Has role="separator"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .separator in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/separator.html
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
- MDN hr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
