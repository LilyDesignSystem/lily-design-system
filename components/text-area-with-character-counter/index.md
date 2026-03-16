# Text Area With Character Counter

TextAreaWithCharacterCounter is a headless component that wraps a native `<textarea>` and a character counter caption inside a `<div>`. The counter displays "[number] of [maximum] characters" below the textarea and updates reactively as the user types.

This component is useful for feedback forms, comment fields, bio inputs, and any interface where users need to know how many characters they have used relative to a maximum limit.

## Implementation Notes

- Renders a wrapper `<div>` containing a `<textarea>` and a character counter caption
- The character counter displays "[number] of [maximum] characters" below the textarea
- The counter updates reactively as the user types
- Uses `aria-describedby` to link the textarea to the counter for screen readers
- The counter uses `aria-live="polite"` so screen readers announce changes
- Supports two-way binding on the `value` prop
- The `counterTemplate` prop allows customization of the counter text for internationalization
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## Props

- `label`: string (required) -- accessible name for the textarea via `aria-label`
- `value`: string (default: "") -- bindable textarea value
- `maxLength`: number (required) -- maximum number of characters allowed
- `counterTemplate`: string (default: "{count} of {max} characters") -- template for the counter text
- `rows`: number (optional) -- number of visible text rows
- `placeholder`: string (optional) -- placeholder text for the textarea
- `required`: boolean (default: false) -- whether the textarea is required
- `disabled`: boolean (default: false) -- whether the textarea is disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Usage

```html
<TextAreaWithCharacterCounter label="Feedback" maxLength={500} />
```

```html
<TextAreaWithCharacterCounter label="Bio" value={bio} maxLength={200} rows={4} placeholder="Tell us about yourself" />
```

```html
<TextAreaWithCharacterCounter label="Commentaire" maxLength={300} counterTemplate="{count} sur {max} caractères" />
```

## Keyboard Interactions

- Tab: Moves focus to and from the textarea (native browser behavior)
- Standard textarea keyboard interactions (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the textarea
- `aria-describedby` -- links the textarea to the character counter
- `aria-live="polite"` -- on the counter so screen readers announce updates

## When to Use

- Use when a text area has a character limit and users need to see how many characters they have used.
- Avoid when there is no character limit; use Textarea instead.
- Consider CharacterCounter as a standalone component when the counter needs to be positioned independently.

## Headless

This headless component provides a `<div>` wrapping a native `<textarea>` and a character counter `<span>` with `aria-describedby` linking, `aria-live="polite"` for announcements, and a configurable counter template. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.text-area-with-character-counter` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a wrapper `<div>` with class `text-area-with-character-counter`
- Verify it contains a `<textarea>` with `aria-label` and `aria-describedby`
- Verify it contains a counter element with `aria-live="polite"`
- Verify the counter displays the correct character count
- Verify the counter updates as the user types
- Verify `maxLength` is applied to the textarea
- Verify `disabled` and `required` attributes propagate correctly
- Verify the `counterTemplate` prop customizes the counter text

## Advice

- **Designers**: Position the counter below the textarea. Consider visual feedback when nearing the limit (the consumer can style based on character count).
- **Developers**: The `counterTemplate` prop uses `{count}` and `{max}` placeholders. Override for internationalization.

## References

- MDN textarea: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
- WAI-ARIA aria-describedby: https://www.w3.org/TR/wai-aria-1.2/#aria-describedby
