# Character Counter

A character counter displays the number of characters a user has typed into an input field, providing real-time feedback to help users stay within constraints. It is commonly used alongside text inputs with character limits such as tweets, SMS messages, form fields, or bios. The counter shows "count / max" when a maximum is provided, or just the count otherwise.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

The component announces the count once typing pauses, not on every keystroke: the visible count is `aria-hidden`, and a visually hidden `role="status"` (`.character-counter-status`, also `.screen-reader-span`) takes the same text once typing pauses (`announceDelay`, default 1000 ms), so a run of keystrokes is announced once, as GOV.UK's character count does. It exposes data attributes for consumer CSS styling based on count state.

## Implementation Notes

- Renders as a `<span>` holding `.character-counter-text` (the visible count, `aria-hidden="true"`) and `.character-counter-status` (a visually hidden `role="status"`, named by `label`), which takes the same text once the count has stopped changing for `announceDelay` ms (default 1000)
- Uses derived value to compute `remaining` count and `overLimit` boolean from `count` and `max` props
- Displays "count / max" when `max` is provided, otherwise displays just the count
- Exposes data attributes for consumer CSS: `data-count`, `data-max`, `data-remaining`, `data-over-limit`
- The `data-over-limit` attribute is only present when the count exceeds the max, enabling conditional styling
- Spreads `...restProps` on the root `<span>` element for consumer customization

## Props

- `count`: number (default: 0) -- current character count
- `max`: number (optional) -- maximum allowed characters; when provided, enables remaining/over-limit tracking
- `label`: string (optional) -- names the status, via `aria-label`
- `announceDelay`: number (default: 1000) -- milliseconds of quiet before the status takes the new count

## Usage

Basic counter linked to a text-area-input:

```html
<CharacterCounter
  count="{text.length}"
  max="{280}"
  label="Characters remaining"
/>
```

Counter with threshold display (consumer shows/hides based on data attributes):

```html
<CharacterCounter
  count="{referralNotes.length}"
  max="{500}"
  label="Referral note characters"
/>
```

Counter without a maximum, showing only the current count:

```html
<CharacterCounter
  count="{message.length}"
  label="Message length"
/>
```

## Keyboard Interactions

None -- this component is a passive status display.

## ARIA

- `role="status"` on `.character-counter-status`, updated only after a pause in typing, so a run of keystrokes is one announcement
- `aria-hidden="true"` on the visible count, so it is not read twice
- `aria-label` (from `label`) names the status
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
- Do not use as a standalone component — pair it with TextAreaInput inside TextAreaInputWithCharacterCounter for a complete user experience.

## Headless

This headless CharacterCounter component provides a visible, `aria-hidden` count and a hidden `role="status"` announced once typing pauses, and exposes `data-count`, `data-max`, `data-remaining`, and `data-over-limit` attributes for styling hooks. The consumer provides all visual styling including typography, colors, positioning relative to the input, and over-limit warning styles.

## Styles

The consumer provides all CSS styling. The component renders with a `.character-counter` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<span>` element with class `character-counter`
- Verify a run of count changes gives one change to the `role="status"`, after `announceDelay`
- Verify aria-label`-- set from the`label` prop to provide context for what the counter represents
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position the counter near the associated input field, typically below or to the right. Use a warning color when the user approaches or exceeds the limit.
- **Developers**: Bind the `count` prop to your input's character length. Use the `data-over-limit` attribute in CSS to trigger visual warnings when the maximum is exceeded.

## Related components

- `text-area-input-with-character-counter` — a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"
- `character` — a single character display element

## References

- [MDN span element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span)

---

Lily™ and Lily Design System™ are trademarks.
