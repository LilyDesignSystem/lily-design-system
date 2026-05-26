# TelLink

## Metadata

- Component: tel-link
- PascalCase: TelLink
- Description: a tel hyperlink for a telephone number
- HTML tag: <a>
- CSS class: .tel-link
- Interactive: no

## Companion

- tel-input

## Key Behaviors

- Renders an `<a>` element with an `href="tel:{phone}"` attribute for native phone dialing.
- The phone number text is displayed as the link content.
- An optional `label` prop provides an accessible name via `aria-label` when the phone number alone is not descriptive enough (e.g., "Call customer support at +1-555-0100").
- Spreads `restProps` onto the `<a>` element for consumer customization.
- No internal state management; this is a purely presentational component.

## ARIA

- `aria-label` -- when provided, gives an accessible name that provides more context than the phone number alone (e.g., describing who the number belongs to or its purpose).

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `phone`: string (required) -- the phone number to display and link to (should include country code, e.g., `"+1-555-0100"`).
- `label`: string (default: `undefined`) -- optional accessible name applied via `aria-label` for additional context.
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element.

## Acceptance Criteria

- [ ] Renders <a> element with class="tel-link"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tel-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tel-link.html
- MDN tel: links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_telephone_numbers
- WAI-ARIA Link Role: https://www.w3.org/TR/wai-aria-1.2/#link
