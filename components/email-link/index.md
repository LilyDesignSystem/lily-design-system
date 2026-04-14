# Email Link

An email link displays an email as a clickable mailto link. When clicked, it opens the user's default email client with the address pre-filled. This is the read-only companion to EmailAddressInput, used for displaying email addresses in profiles, contact lists, or user cards.

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

Email link on a contact page:

```html
<EmailLink email="support@example.com" label="Email our support team" />
```

Email link in a user profile card:

```html
<EmailLink email="alice@example.com" />
```

## Keyboard Interactions

None -- this is a standard `<a>` link; keyboard behavior (Tab to focus, Enter to activate) is provided natively by the browser.

## ARIA

- `aria-label="..."` -- optional override for the accessible name when the visible email text alone is insufficient context

## When to Use

- Use to display an email address as a mailto: hyperlink.
- Use when users should be able to click to open their email client.
- Use on contact pages, user profiles, business listings, and support sections.

## When Not to Use

- Do not use for entering an email address -- use EmailInput instead.
- Do not use for non-email links -- use ActionLink instead.
- Do not use when the email should be displayed as plain non-interactive text.

## Headless

This headless component provides an `<a>` element with `href="mailto:{email}"`, the email address as visible link text, and optional `aria-label` override for additional context. The consumer provides all visual styling for the link appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.email-link` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<a>` element with class `email-link`
- Verify aria-label="..."` -- optional override for the accessible name when the visible email text alone is insufficient context
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style the email link consistently with other hyperlinks in your design system. Consider adding an email icon to visually indicate the mailto behavior.
- **Developers**: Use the `label` prop to provide additional accessible context when the email address alone is ambiguous (e.g., when multiple email links appear on the same page).

## References

- MDN `mailto:` links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address
