# IconButton

A button containing only an icon glyph. Because icon-only buttons have no implicit accessible name, the `label` prop is **required** and is rendered as `aria-label`.

## Implementation Notes

- Headless: no CSS, no icons supplied — consumer provides the icon via the default slot
- `label` is **required** and non-optional in the TypeScript interface
- Defaults to `type="button"` to avoid accidental form submissions
- Supports `aria-pressed` toggle pattern via the `pressed` prop

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `type`: `"button" | "submit" | "reset"` (default `"button"`)
- `disabled`: boolean (default `false`)
- `pressed`: boolean | undefined (default `undefined`) — toggle state
- default slot — icon content
- `...$attrs` — additional HTML attributes

## Events

- `click(event: MouseEvent)`

## Usage

```vue
<IconButton label="Close dialog" @click="closeDialog">
    <svg>...</svg>
</IconButton>

<IconButton label="Bold" :pressed="isBold" @click="toggleBold">
    B
</IconButton>
```

## Keyboard Interactions

- `Tab` — focus the button
- `Enter` / `Space` — activate the button

## ARIA

- `aria-label` is the entire accessible name (required)
- `aria-pressed` only when `pressed` is provided

## When to Use

- Toolbar actions, close buttons, formatting toggles
- Any compact action where an icon alone communicates intent

## When Not to Use

- When a visible label improves discoverability — use `Button` instead

## Headless

The component renders a native `<button>` and applies the required ARIA attributes. Consumers supply the icon and all visual styling.

## Testing

- Verify the root `icon-button` class and `aria-label`
- Verify default `type="button"`
- Verify disabled state
- Verify `aria-pressed` when `pressed` is provided
- Verify the click event is emitted

## References

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
