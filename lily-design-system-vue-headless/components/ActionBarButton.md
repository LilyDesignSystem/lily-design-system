# ActionBarButton

One action button intended for use inside an [`ActionBar`](./ActionBar.md).

## Implementation Notes

- Headless: no CSS
- Native `<button>` element
- `label` is required and rendered as `aria-label`
- Defaults to `type="button"` to avoid accidental form submissions

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `type`: `"button" | "submit" | "reset"` (default `"button"`)
- `disabled`: boolean (default `false`)
- default slot — button content (icon and/or text)

## Events

- `click(event: MouseEvent)`

## Usage

```vue
<ActionBarButton label="Delete" @click="onDelete">Delete</ActionBarButton>
<ActionBarButton label="Archive" @click="onArchive">
    <svg>...</svg>
    Archive
</ActionBarButton>
```

## Keyboard Interactions

- `Tab` — focus the button
- `Enter` / `Space` — activate the button

## ARIA

- `aria-label` provides the accessible name
- Standard `<button>` semantics

## When to Use

- Inside an `ActionBar` for selection-driven bulk actions

## When Not to Use

- For free-floating buttons not associated with selection — use `Button` or `IconButton`

## Headless

Native `<button>`. Consumers supply all visual styling.

## Testing

- Verify root `action-bar-button` class
- Verify `aria-label`
- Verify default `type="button"`
- Verify the `click` event fires

## References

- [Adobe Spectrum — Action Bar](https://spectrum.adobe.com/page/action-bar/)
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
