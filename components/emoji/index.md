# Emoji

An emoji component wraps an emoji character with proper accessibility semantics so that screen readers announce a meaningful description instead of attempting to read the raw Unicode character. This ensures emoji usage in interfaces is accessible to all users.

The component renders a `<span>` with `role="img"` and a required `aria-label`, treating the emoji as an image with an accessible name. This approach is recommended for any emoji that conveys meaning, as opposed to purely decorative emoji which should be hidden from assistive technology.

## Implementation Notes

- Renders a `<span>` with `role="img"` to treat the emoji as an image element
- Requires an `aria-label` describing the emoji meaning for screen readers
- Displays the emoji character as text content inside the span
- Spreads `restProps` onto the `<span>` element for consumer customization

## Props

- `emoji`: string (required) -- the emoji character(s) to display
- `label`: string (required) -- accessible name describing the emoji for screen readers

## Usage

Status indicator with meaningful emoji:

```html
<Emoji emoji="✅" label="Approved" />
```

Warning emoji alongside alert text:

```html
<Emoji emoji="⚠️" label="Warning" /> This action cannot be undone.
```

Reaction emoji in a message:

```html
<Emoji emoji="👍" label="Thumbs up" />
<Emoji emoji="❤️" label="Love" />
```

## Keyboard Interactions

None -- this component is a passive inline display element.

## ARIA

- `role="img"` -- identifies the emoji as an image for assistive technologies
- `aria-label` -- provides a textual description of the emoji character for screen readers

## When to Use

- Use to display a single emoji character with an accessible name for screen readers.
- Use when the emoji conveys meaning and needs to be announced with a descriptive label.
- Use in interfaces where emoji supplement text content, such as status indicators, reactions, or labels.

## When Not to Use

- Do not use for selecting emojis -- use EmojiCharacterPicker instead.
- Do not use for decorative icons -- use Icon instead.
- Do not use for purely decorative emoji that add no informational value; hide those with `aria-hidden="true"` instead.

## Headless

This headless component provides a `<span>` with `role="img"` and a required `aria-label` to ensure emoji are announced meaningfully by screen readers. The consumer provides all visual styling such as font size, spacing, and color adjustments.


## Styles

The consumer provides all CSS styling. The component renders with a `.emoji` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `emoji`
- Verify role="img"` -- identifies the emoji as an image for assistive technologies
- Verify aria-label` -- provides a textual description of the emoji character for screen readers
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure emoji are large enough to be recognizable and are not the sole means of conveying information. Pair emoji with text labels when clarity is important.
- **Developers**: Always provide a descriptive `label` that conveys the emoji's meaning in context, not just its Unicode name (e.g., "Approved" rather than "Check mark").
