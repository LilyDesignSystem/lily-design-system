# Character Counter

A character counter displays the number of characters a user has typed into an input field, providing real-time feedback to help users stay within constraints. It is commonly used alongside text inputs with character limits such as tweets, SMS messages, form fields, or bios. The counter shows "count / max" when a maximum is provided, or just the count otherwise.

The component uses `role="status"` with `aria-live="polite"` so screen readers announce updates without interrupting the user, and exposes data attributes for consumer CSS styling based on count state.

## Implementation Notes

- Renders as a `<span>` element with `role="status"` and `aria-live="polite"` for non-intrusive screen reader announcements
- Uses derived value to compute `remaining` count and `overLimit` boolean from `count` and `max` props
- Displays "count / max" when `max` is provided, otherwise displays just the count
- Exposes data attributes for consumer CSS: `data-count`, `data-max`, `data-remaining`, `data-over-limit`
- The `data-over-limit` attribute is only present when the count exceeds the max, enabling conditional styling
- Spreads `...restProps` on the root `<span>` element for consumer customization

## Props

- `count`: number (default: 0) -- current character count
- `max`: number (optional) -- maximum allowed characters; when provided, enables remaining/over-limit tracking
- `label`: string (optional) -- accessible label for the counter via aria-label

## Usage

Basic counter linked to a textarea:

```html
<CharacterCounter count={text.length} max={280} label="Characters remaining" />
```

Counter with threshold display (consumer shows/hides based on data attributes):

```html
<CharacterCounter count={referralNotes.length} max={500} label="Referral note characters" />
```

Counter without a maximum, showing only the current count:

```html
<CharacterCounter count={message.length} label="Message length" />
```

## Keyboard Interactions

None -- this component is a passive status display.

## ARIA

- `role="status"` -- identifies the element as a live region that presents advisory information
- `aria-live="polite"` -- screen readers announce updates at the next convenient pause, without interrupting the user
- `aria-label` -- set from the `label` prop to provide context for what the counter represents

## When to Use

- Use when there is a clear reason for limiting the number of characters, such as a database field constraint or regulatory requirement.
- Use when evidence shows users regularly enter more text than needed for the purpose of the field.
- Use to help users understand how much text they can still enter, with a dynamic count that updates as they type.
- Use with a threshold setting so the counter only appears after users have entered a significant portion of the limit, reducing visual noise.
- Use alongside text inputs that have a maximum length, such as referral notes, feedback fields, SMS messages, or bio descriptions.

## When Not to Use

- Do not use if the character limit could be increased or removed — relax backend constraints instead of restricting users.
- Do not use without first testing whether your service works without a character limit.
- Do not use for short fields like names or postcodes — use TextInput with an appropriate width instead.
- Do not use as a standalone component — pair it with Textarea inside TextAreaWithCharacterCounter for a complete user experience.

## Headless

This headless CharacterCounter component provides `role="status"` with `aria-live="polite"` for non-intrusive screen reader announcements, and exposes `data-count`, `data-max`, `data-remaining`, and `data-over-limit` attributes for styling hooks. The consumer provides all visual styling including typography, colors, positioning relative to the input, and over-limit warning styles.


## Styles

The consumer provides all CSS styling. The component renders with a `.character-counter` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `character-counter`
- Verify role="status"` -- identifies the element as a live region that presents advisory information
- Verify aria-label` -- set from the `label` prop to provide context for what the counter represents
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position the counter near the associated input field, typically below or to the right. Use a warning color when the user approaches or exceeds the limit.
- **Developers**: Bind the `count` prop to your input's character length. Use the `data-over-limit` attribute in CSS to trigger visual warnings when the maximum is exceeded.
