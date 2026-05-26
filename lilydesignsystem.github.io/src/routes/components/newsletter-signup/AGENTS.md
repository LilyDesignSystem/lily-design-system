# NewsletterSignup

## Metadata

- Component: newsletter-signup
- PascalCase: NewsletterSignup
- Description: an email subscription form composition with idle, submitting, success, and error states
- HTML tag: <form>
- CSS class: .newsletter-signup
- Interactive: yes

## Key Behaviors

- Uses a native <form> element with aria-label
- state prop ("idle" | "submitting" | "success" | "error", default "idle") exposed as data-state
- Email input and submit button are disabled when state is "submitting"
- Success message uses role="status" + aria-live="polite" (non-disruptive)
- Error message uses role="alert" (immediately announced)
- Both messages conditionally hidden based on state
- All visible strings come from props for i18n
- Submit handling delegated to consumer via onSubmit / onsubmit

## ARIA

- aria-label on the <form> provides the form's accessible name (required)
- data-state reflects current state
- Success: role="status" + aria-live="polite"
- Error: role="alert"
- Hidden attribute toggles message visibility per state

## Keyboard

- Tab: Move focus through the email input and submit button
- Enter inside the email input: Submit the form
- (All handled natively by <form>, <input>, and <button>)

## Props

- `label`: string (REQUIRED) -- aria-label for the form
- `heading`: string (optional) -- visible heading
- `description`: string (optional) -- body text
- `emailLabel`: string (REQUIRED) -- visible label for email input
- `emailPlaceholder`: string (optional)
- `submitLabel`: string (REQUIRED) -- submit button text
- `state`: "idle" | "submitting" | "success" | "error" (default "idle")
- `successMessage`: string (optional)
- `errorMessage`: string (optional)
- `onSubmit` / `onsubmit`: callback (optional)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <form> element with class="newsletter-signup"
- [ ] aria-label present and equals label prop
- [ ] data-state reflects state prop
- [ ] Email input and submit button disabled when state="submitting"
- [ ] Success message renders with role="status" + aria-live="polite"
- [ ] Success message hidden unless state="success"
- [ ] Error message renders with role="alert"
- [ ] Error message hidden unless state="error"
- [ ] Submit handler fires on form submission
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .newsletter-signup in css-style-sheet-template.css
- WAI-ARIA role=status: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA role=alert: https://www.w3.org/TR/wai-aria-1.2/#alert
- Mozilla Protocol Design System: https://protocol.mozilla.org/
