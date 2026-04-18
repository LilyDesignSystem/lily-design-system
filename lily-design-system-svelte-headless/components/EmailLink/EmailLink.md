# EmailLink

An email address view displays an email as a clickable mailto link. When clicked, it opens the user's default email client with the address pre-filled. This is the read-only companion to EmailAddressInput, used for displaying email addresses in profiles, contact lists, or user cards.

## Implementation Notes

- Renders an `<a>` element with `href="mailto:{email}"` for native email client integration
- Displays the email address as visible link text
- Supports an optional `aria-label` override for cases where additional context is needed
- Spreads `restProps` for consumer customization

## Props

- `email`: string (required) -- the email address to display and link to
- `label`: string (default: `undefined`) -- optional accessible label override via `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Usage

```svelte
<EmailLink email="alice@example.com" />
```

## Keyboard Interactions

None -- this is a standard `<a>` link; keyboard behavior (Tab to focus, Enter to activate) is provided natively by the browser.

## ARIA

- `aria-label="..."` -- optional override for the accessible name when the visible email text alone is insufficient context

## References

- MDN `mailto:` links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address
