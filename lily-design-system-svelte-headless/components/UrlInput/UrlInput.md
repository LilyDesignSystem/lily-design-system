# UrlInput

A URL input is a UI/UX component that provides a text field specifically for entering web addresses. It uses the native HTML `<input type="url">` element, which provides built-in URL validation and may trigger URL-specific keyboard layouts on mobile devices. The component includes aria-label for accessibility and supports bindable value for two-way data binding, along with standard form attributes like required and disabled.

URL inputs are commonly used in profile forms, link submission pages, and any context where users need to enter a valid web address. The browser's built-in validation ensures the entered value matches URL format before form submission.

## Implementation Notes

- Renders a single `<input type="url">` element for semantic URL input with built-in validation
- Uses `$bindable()` for the `value` prop enabling two-way data binding with `bind:value`
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `placeholder`, `pattern`, `class`)
- Browser-native validation requires a valid URL format (including protocol) on form submission when `required` is set

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current URL value, bindable with `bind:value`
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

```svelte
<UrlInput label="Website URL" bind:value />
```

```svelte
<UrlInput label="Portfolio link" bind:value={portfolioUrl} required />
```

## Keyboard Interactions

None beyond native text input behavior. The `<input type="url">` element supports standard text editing keys (typing, selection, clipboard-copy-button operations) natively.

## ARIA

- `aria-label={label}` -- provides the accessible name for the URL input since no visible label element is associated

## References

- MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url
