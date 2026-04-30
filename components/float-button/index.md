# Float Button

A float button is a floating action button anchored to a viewport
corner. It uses inline `position: fixed` as the documented headless
behavior and a required `aria-label` so screen readers announce its
purpose.

Use it for primary single-action shortcuts (compose, scroll-to-top,
new chat, contact support) that should remain reachable regardless of
scroll position.

## Implementation Notes

- Renders a native `<button>` element with class `float-button`
- Inline style applies `position: fixed` plus the corner offset for the chosen `position`
- `position` defaults to `"bottom-right"` and emits `data-position`
- Default offset is `1rem` from each edge
- `label` is **required** and sets `aria-label`
- Defaults to `type="button"` to prevent accidental form submissions
- Native `disabled` attribute prevents click events automatically
- Children render the icon content (decorative)

## Props

- `label`: string (**required**) -- aria-label
- `position`: "top-left" | "top-right" | "bottom-left" | "bottom-right" (default: "bottom-right")
- `disabled`: boolean (default: false)
- `type`: "button" | "submit" | "reset" (default: "button")
- `onclick` / `onClick`: callback (optional)
- `children`: slot -- icon content
- `...restProps`: any additional HTML attributes

## Usage

```html
<FloatButton label="Compose" position="bottom-right" onclick={openComposer}>
  <svg>...</svg>
</FloatButton>
```

```html
<FloatButton label="Scroll to top" position="bottom-left" onclick={scrollTop}>
  ↑
</FloatButton>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button
- (All handled natively by `<button>` element)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` is the entire accessible name (required)
- `aria-disabled` from native `disabled` attribute
- `data-position` exposes the corner anchor for CSS hooks

## When to Use

- Use for one or two persistent shortcuts that should always be reachable.
- Use for compose, contact, scroll-to-top, or other ever-available actions.

## When Not to Use

- Do not use for primary navigation — use a navigation menu or tab bar.
- Do not stack many float buttons — clutter and overlap reduce usability.
- Do not omit `label` — icon-only buttons without an accessible name fail WCAG.

## Headless

Renders a `<button>` with inline `position: fixed` style and the right
corner offset. The icon glyph, size, focus indicator, hover state, and
elevation/shadow are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `float-button` class. Use `data-position` to
pick the corner. Provide a minimum 44×44 px touch target, a clear focus
indicator, and elevation that matches the surrounding theme.

## Testing

- Verify the component renders a `<button>` with class `float-button`
- Verify `aria-label` is present and equals the `label` prop
- Verify `type` defaults to `"button"`
- Verify `position` defaults to `"bottom-right"` and emits `data-position`
- Verify inline style includes `position: fixed`
- Verify inline style includes the correct corner offset for each position
- Verify `disabled` attribute is applied when `disabled` is true
- Verify the click handler fires on Enter, Space, and click

## Advice

- **Designers**: Place the float button where it will not obscure key content. Maintain sufficient contrast against any underlying scroll surface.
- **Developers**: Always supply `label`. Avoid stacking multiple float buttons that overlap; group related actions inside a single trigger.

## Related components

- `button` — a generic clickable button element
- `icon-button` — a button containing only an icon with a required accessible label
- `affix` — a wrapper that pins its content to a viewport position while the page scrolls

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- WCAG 4.1.2 Name, Role, Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value
- Ant Design FloatButton: https://ant.design/components/float-button
