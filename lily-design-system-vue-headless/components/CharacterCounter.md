# CharacterCounter

A character counter displays the number of characters a user has typed into an input field, providing real-time feedback to help users stay within constraints. It is commonly used alongside text inputs with character limits such as tweets, SMS messages, form fields, or bios. The counter shows "count / max" when a maximum is provided, or just the count otherwise.

The component renders a visible count that is `aria-hidden` and a visually hidden `role="status"` that takes the same text once typing pauses (`announceDelay`, default 1000 ms), so a run of keystrokes is announced once. It exposes data attributes for consumer CSS styling based on count state.

## Implementation Notes

- Renders as a `<span>` holding `.character-counter-text` (`aria-hidden`) and `.character-counter-status` (a hidden `role="status"`, named by `label`, updated after `announceDelay` ms of quiet)
- Uses `$derived()` to compute `remaining` count and `overLimit` boolean from `count` and `max` props
- Displays "count / max" when `max` is provided, otherwise displays just the count
- Exposes data attributes for consumer CSS: `data-count`, `data-max`, `data-remaining`, `data-over-limit`
- The `data-over-limit` attribute is only present when the count exceeds the max, enabling conditional styling
- Spreads `...restProps` on the root `<span>` element for consumer customization

## Props

- `count`: number (default: 0) -- current character count
- `max`: number (optional) -- maximum allowed characters; when provided, enables remaining/over-limit tracking
- `label`: string (optional) -- accessible label for the counter via aria-label

## Usage

```svelte
<CharacterCounter
  count={text.length}
  max={280}
  label="Characters"
/>
```

## Keyboard Interactions

None -- this component is a passive status display.

## ARIA

- `role="status"` -- identifies the element as a live region that presents advisory information
- The status changes once per pause in typing, not per keystroke; the visible count is `aria-hidden`
- `aria-label` -- set from the `label` prop to provide context for what the counter represents
