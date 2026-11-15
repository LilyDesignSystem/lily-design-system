# Emoji Character Radio Group

EmojiCharacterRadioGroup is a headless `<fieldset role="radiogroup">` for choosing an emoji character, holding the `EmojiCharacterRadioInput` radios the consumer composes, with whatever labels and layout the consumer writes. It replaces the earlier `emoji-character-picker` (removed 2026-11-15).

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` and `aria-label`
- The consumer supplies one `EmojiCharacterRadioInput` per value (any emoji character); the group renders no option text of its own
- Selection, the arrow keys, form submission and form reset are native radio behaviour, so the group keeps no state
- Spreads `restProps` onto the fieldset, so `disabled`, `id` or `data-*` pass through

## Props

- `label`: string (required) -- accessible name for the group
- `children`: slot (required) -- the `EmojiCharacterRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

## Usage

```svelte
<EmojiCharacterRadioGroup label="Your reaction">
  <EmojiCharacterRadioInput
    value="😀"
    label="Grinning face"
    name="reaction"
  />
  <EmojiCharacterRadioInput
    value="🙂"
    label="Slightly smiling face"
    name="reaction"
    checked
  />
  <EmojiCharacterRadioInput
    value="😐"
    label="Neutral face"
    name="reaction"
  />
</EmojiCharacterRadioGroup>
```

It renders:

```html
<fieldset
  class="emoji-character-radio-group"
  role="radiogroup"
  aria-label="Your reaction"
>
  <input
    class="emoji-character-radio-input"
    type="radio"
    aria-label="Grinning face"
    name="reaction"
    value="😀"
    data-value="😀"
  />
  …
</fieldset>
```

## Keyboard Interactions

- Tab: focus the checked radio, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## ARIA

- `role="radiogroup"` on the `<fieldset>`, named by `aria-label`
- Each radio is named by its own `label`, so a status or rating is never shown by colour alone (WCAG 1.4.1)

## When to Use

- Use when the consumer wants to lay out, order or label the options themselves, for example with a visible `<label>` beside each radio.
- Use inside a form, where the native radios submit the chosen value under one `name`.
- Use when a form reset must restore the starting choice without any script.
- Use when the options need extra content between them, such as a description under each one.

## When Not to Use

- Do not use when more than one option may be chosen -- use [CheckboxGroup](checkbox-group.md) instead.
- Do not use for a read-only display -- use [Emoji](emoji.md) instead.
- Do not use for a plain set of choices with no status or rating meaning -- use [RadioGroup](radio-group.md) instead.

## Headless

The EmojiCharacterRadioGroup headless component provides a `<fieldset>` with `role="radiogroup"` and `aria-label`. It relies on native radio behaviour for selection and the keyboard. The consumer provides all visual styling, including any colour coding.

## Styles

The consumer provides all CSS styling. The component renders with a `.emoji-character-radio-group` class for targeting; each radio carries `.emoji-character-radio-input` and `data-value`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `emoji-character-radio-group` and `role="radiogroup"`
- Verify the group is named by `aria-label`
- Verify the consumer's radios render inside it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give every option visible text as well as its colour or icon; colour alone fails people with colour vision deficiencies.
- **Developers**: Give every `EmojiCharacterRadioInput` the same `name`, so the browser treats them as one group for the arrow keys and form submission.

## Related components

- `emoji-character-radio-input` — a radio input for one choice of an emoji character <input type="radio">
- `emoji` — the read-only display
- `radio-group` — the general radio group

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Unicode emoji: https://unicode.org/emoji/

---

Lily™ and Lily Design System™ are trademarks.
