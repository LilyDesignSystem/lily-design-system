# URL Input

A URL input is a UI/UX component that provides a text field specifically for entering web addresses. It uses the native HTML `<input type="url">` element, which provides built-in URL validation and may trigger URL-specific keyboard layouts on mobile devices. The component includes aria-label for accessibility and supports bindable value for two-way data binding, along with standard form attributes like required and disabled.

URL inputs are commonly used in profile forms, link submission pages, and any context where users need to enter a valid web address. The browser's built-in validation ensures the entered value matches URL format before form submission.

## Implementation Notes

- Renders a single `<input type="url">` element for semantic URL input with built-in validation
- Supports two-way binding for the `value` prop enabling two-way data binding with two-way `value` binding
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `placeholder`, `pattern`, `class`)
- Browser-native validation requires a valid URL format (including protocol) on form submission when `required` is set

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current URL value, bindable with two-way `value` binding
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

Basic website URL input:

```html
<UrlInput label="Website URL" value={websiteUrl} placeholder="https://example.com" />
```

Required portfolio link in a profile form:

```html
<UrlInput label="Portfolio link" value={portfolioUrl} required />
```

Webhook URL configuration field:

```html
<Field label="Webhook URL" required>
  <UrlInput label="Webhook URL" value={webhookUrl} required placeholder="https://api.example.com/webhook" />
  <Hint>We will send POST requests to this URL when events occur.</Hint>
</Field>
```

Social media link in a user profile form:

```html
<Form label="Social links" onsubmit={saveProfile}>
  <Field label="Personal website">
    <UrlInput label="Personal website" value={website} placeholder="https://yoursite.com" />
  </Field>
  <Field label="LinkedIn profile">
    <UrlInput label="LinkedIn profile URL" value={linkedin} placeholder="https://linkedin.com/in/username" />
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

## Keyboard Interactions

None beyond native text input behavior. The `<input type="url">` element supports standard text editing keys (typing, selection, clipboard operations) natively.

## ARIA

- `aria-label={label}` -- provides the accessible name for the URL input since no visible label element is associated

## When to Use

- Use when users need to enter a web address, such as in profile forms, link submission pages, or configuration settings.
- Use when built-in browser URL validation requiring a protocol like `https://` is appropriate.
- Use for webhook URL configuration, callback URLs, or API endpoint settings.
- Use for social media profile link fields in user settings.

## When Not to Use

- Do not use for general text that may contain URLs mixed with other content -- use TextInput instead.
- Do not use for email addresses -- use EmailInput instead.
- Do not use when you need to accept URLs without a protocol prefix -- use TextInput with a custom pattern instead.

## Headless

This headless component provides a native `<input type="url">` element with `aria-label`, two-way value binding, and support for `required` and `disabled` states. Built-in browser validation ensures URL format compliance. The consumer provides all visual styling and any surrounding labels or hints.


## Styles

The consumer provides all CSS styling. The component renders with a `.url-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `url-input`
- Verify aria-label={label}` -- provides the accessible name for the URL input since no visible label element is associated
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a placeholder (e.g., "https://example.com") to clarify the expected format. Show validation errors inline near the input.
- **Developers**: The browser requires a valid URL with a protocol (e.g., `https://`) for validation. Pass `placeholder` and `pattern` via restProps to customize behavior.

## References

- MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url
