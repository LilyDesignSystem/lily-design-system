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

```svelte
<Emoji emoji="👍" label="Thumbs up" />
```

```svelte
<Emoji emoji="⚠️" label="Warning" />
```

## Keyboard Interactions

None -- this component is a passive inline display element.

## ARIA

- `role="img"` -- identifies the emoji as an image for assistive technologies
- `aria-label` -- provides a textual description of the emoji character for screen readers
