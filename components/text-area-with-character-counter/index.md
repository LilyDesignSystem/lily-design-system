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

Basic feedback field with a 500-character limit:

```html
<TextAreaWithCharacterCounter label="Feedback" maxLength={500} />
```

Referral notes with hint text, pre-filled value, and visible rows:

```html
<TextAreaWithCharacterCounter
  label="Additional notes for the referral"
  value={referralNotes}
  maxLength={500}
  rows={6}
  placeholder="Include any relevant medical history or current medications"
/>
```

User bio with two-way binding:

```html
<TextAreaWithCharacterCounter label="Bio" value={bio} maxLength={200} rows={4} placeholder="Tell us about yourself" />
```

Internationalized counter text (French):

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

- Use when you need a multi-line text input with a visible character limit indicator.
- Use for free-text fields where a maximum length is required, such as referral notes, feedback forms, or medical history descriptions.
- Use when the character count message "[number] of [maximum] characters" provides useful feedback during entry.
- Use when you want the textarea and counter linked automatically via `aria-describedby` without manual wiring.

## When Not to Use

- Do not use when no character limit is needed — use Textarea on its own.
- Do not use for single-line inputs — use TextInput instead.
- Do not use when a word count is more appropriate than a character count — adapt CharacterCounter with word counting logic.
- Do not use when the counter needs to be positioned independently from the textarea — use CharacterCounter as a standalone component.

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
