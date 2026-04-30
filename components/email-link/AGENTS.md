# EmailLink

## Metadata

- Component: email-link
- PascalCase: EmailLink
- Description: a mailto hyperlink for an email address
- HTML tag: <a>
- CSS class: .email-link
- Interactive: no

## Companion

- email-input

## Key Behaviors

- Renders an `<a>` element with `href="mailto:{email}"` for native email client integration
- Displays the email address as visible link text
- Supports an optional `aria-label` override for cases where additional context is needed
- Spreads `restProps` for consumer customization

## ARIA

- `aria-label="..."` -- optional override for the accessible name when the visible email text alone is insufficient context

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `email`: string (required) -- the email address to display and link to
- `label`: string (default: `undefined`) -- optional accessible label override via `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Acceptance Criteria

- [ ] Renders <a> element with class="email-link"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .email-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/email-link.html
- MDN `mailto:` links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address
