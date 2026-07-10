# Action Bar Button

An action bar button is a single bulk-action trigger inside an `action-bar`.
It uses a native `<button>` element and requires an accessible label so the
action is unambiguously announced to assistive technology.

Use it for each bulk operation surfaced in the action bar — for example,
delete, archive, move, share, or export — alongside other action bar
buttons.

## Implementation Notes

- Uses a native `<button>` element for inherent keyboard and accessibility support
- `label` prop is **required** and renders as `aria-label`
- Defaults to `type="button"` to prevent accidental form submissions
- Native `disabled` attribute prevents click events automatically
- Children render the visual content (icon and/or text) and are decorative for AT (the `aria-label` is the source of truth)

## Props

- `label`: string (**required**) -- aria-label
- `type`: "button" | "submit" | "reset" (default: "button")
- `disabled`: boolean (default: false)
- `onclick` / `onClick`: callback (optional) -- click handler
- `children`: slot -- the button content (icon and/or text)
- `...restProps`: any additional HTML attributes

## Usage

```html
<ActionBarButton label="Delete" onClick={handleDelete}>
  Delete
</ActionBarButton>
```

Disabled action:

```html
<ActionBarButton label="Move to folder" disabled>
  Move
</ActionBarButton>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button
- (All handled natively by `<button>` element)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` is the accessible name (required)
- `aria-disabled` from native `disabled` attribute

## When to Use

- Use inside an `action-bar` to surface a bulk operation
- Use when the operation acts on the currently selected items
- Use a clear, action-verb label (e.g., "Delete", "Archive")

## When Not to Use

- Do not use outside of an `action-bar` — use `Button` or `IconButton` instead
- Do not omit `label` — buttons without an accessible name fail WCAG

## Composition

The action bar button is a child of `action-bar`:

```html
<ActionBar label="Bulk actions" selectedCount={2} selectedCountLabel="2 selected">
  <ActionBarButton label="Delete">Delete</ActionBarButton>
  <ActionBarButton label="Archive">Archive</ActionBarButton>
</ActionBar>
```

## Headless

Renders a native `<button>` with the required `aria-label`. The icon, text,
focus indicator, hover state, and any visual treatment are entirely the
consumer's responsibility.

## Styles

Consumer CSS targets the `action-bar-button` class. Provide a clear focus
indicator and hover/active visual feedback. Maintain a 44×44 px touch target.

## Testing

- Verify the component renders a `<button>` element with class `action-bar-button`
- Verify `aria-label` equals the `label` prop
- Verify `type` defaults to `"button"`
- Verify `disabled` attribute is applied when `disabled` is true
- Verify the click handler fires on Enter, Space, and click

## Advice

- **Designers**: Use a consistent visual treatment across all action bar buttons in a single bar.
- **Developers**: Always supply a `label` prop. Include an icon plus visible text whenever space allows.

## Related components

- `action-bar` — a contextual action bar that appears when items are selected, showing the selection count and bulk action buttons

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Adobe Spectrum Action Bar: https://spectrum.adobe.com/page/action-bar/
- WCAG 4.1.2 Name, Role, Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value

---

Lily™ and Lily Design System™ are trademarks.
