# PostalCodeView

## Metadata

- Component: postal-code-view
- PascalCase: PostalCodeView
- Description: a read-only display of a postal or ZIP code
- HTML tag: <div>
- CSS class: .postal-code-view
- Interactive: no

## Companion

- postal-code-input

## Key Behaviors

- Renders a `<span>` element containing the postal code text
- Text content is provided via the `text` prop (not via children)
- Defaults to an empty string if no text is provided
- Spreads `restProps` on the `<span>` for consumer customization (e.g., `class`, `data-*` attributes)
- No ARIA attributes needed; the text content is directly readable by assistive technology

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `text`: string (default: `""`) -- the postal code string to display
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## ARIA

- Renders a `<span>` that displays the postal/ZIP code as text content
- No specific ARIA needed — the visible text provides the accessible name
- Consumers may add `aria-label` for additional context (e.g. "Postal code: SW1A 1AA")

## Acceptance Criteria

- [ ] Renders <div> element with class="postal-code-view"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .postal-code-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/postal-code-view.html
- MDN span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
