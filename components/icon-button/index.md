# Icon Button

An icon button is a native `<button>` containing only an icon glyph, image,
or SVG. Because icon-only buttons have no visible text, this component
**requires** an accessible label so that screen readers can announce the
purpose of the action.

Use it for compact, recognizable actions such as close, delete, edit, share,
favorite, and toolbar controls where a label would be visually redundant
once a user understands the icon.

## Implementation Notes

- Uses a native `<button>` element for inherent keyboard and accessibility support
- `label` prop is **required** — it sets `aria-label` so the button has an accessible name
- Defaults to `type="button"` to prevent accidental form submissions
- `aria-pressed` is rendered only when `pressed` is provided (toggle button pattern)
- Native `disabled` attribute prevents click events automatically
- Children render the icon content (svg, emoji, glyph) and are decorative

## Props

- `label`: string (**required**) -- aria-label
- `type`: "button" | "submit" | "reset" (default: "button")
- `disabled`: boolean (default: false)
- `pressed`: boolean | undefined (default: undefined) -- toggle button state
- `onclick` / `onClick`: callback (optional) -- click handler
- `children`: slot -- the icon content
- `...restProps`: any additional HTML attributes

## Usage

Close button with required label:

```html
<IconButton label="Close" onclick={handleDismiss}>
  <svg>...</svg>
</IconButton>
```

Toggle favorite:

```html
<IconButton label="Favorite" pressed={isFavorited} onclick={toggleFavorite}>
  ★
</IconButton>
```

Disabled icon action:

```html
<IconButton label="Delete" disabled>
  <svg>...</svg>
</IconButton>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button
- (All handled natively by `<button>` element)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` is the entire accessible name (required)
- `aria-pressed` for toggle button state (when provided)
- `aria-disabled` from native `disabled` attribute

## When to Use

- Use for compact actions where the icon meaning is universally recognized (close, search, edit, delete).
- Use in toolbars and tight UI regions where a labeled button would be too wide.
- Use the toggle pattern (with `pressed`) for binary state controls (mute/unmute, follow/unfollow).

## When Not to Use

- Do not use when the action is unfamiliar or ambiguous — use a labeled Button.
- Do not use as a primary call to action — use Button so users see the verb.
- Do not omit `label` — icon-only buttons without an accessible name fail WCAG.

## Headless

Renders a native `<button>` with the required `aria-label`. The icon glyph,
its size, focus indicator, hover state, and any visual treatment are entirely
the consumer's responsibility.

## Styles

Consumer CSS targets the `icon-button` class. Provide a minimum 44×44 px
touch target, a clear focus indicator, and hover/active visual feedback.

## Testing

- Verify the component renders a `<button>` element with class `icon-button`
- Verify `aria-label` is present and equals the `label` prop
- Verify `type` defaults to `"button"` when not provided
- Verify `aria-pressed` is rendered only when `pressed` is provided
- Verify `disabled` attribute is applied when `disabled` is true
- Verify the click handler fires on Enter, Space, and click

## Advice

- **Designers**: Use icons that are universally recognizable. Maintain a 44×44 px touch target and a high-contrast focus ring.
- **Developers**: Always supply a `label` prop. The `pressed` prop is for toggle semantics only — leave it `undefined` for ordinary action buttons.

## Related components

- `button` — a generic clickable button element
- `float-button` — a floating action button anchored to a viewport corner
- `tool-bar-button` — one action button in a tool bar

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- WCAG 4.1.2 Name, Role, Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value

---

Lily™ and Lily Design System™ are trademarks.
