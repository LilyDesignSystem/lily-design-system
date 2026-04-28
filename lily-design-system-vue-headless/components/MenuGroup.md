# MenuGroup

A labeled section of menu items within a menu.

## Implementation Notes

- Headless: no CSS
- `role="group"` with required `aria-label`
- Visible heading is `aria-hidden="true"` to avoid duplicate announcement

## Props

- `label`: string (**required**) — section heading text (also used as `aria-label`)
- default slot — `MenuItem` children

## Usage

```vue
<MenuGroup label="View">
    <MenuItem>Zoom in</MenuItem>
    <MenuItem>Zoom out</MenuItem>
</MenuGroup>
```

## ARIA

- Container: `role="group"`, `aria-label`
- Visible heading: `aria-hidden="true"`

## When to Use

- For grouping related menu items within a larger `Menu` or `DropdownMenu`

## When Not to Use

- For top-level navigation — use `NavigationMenu`
- For ungrouped item lists — use `Menu` directly

## Headless

Semantic HTML and ARIA only. Consumers supply CSS.

## Testing

- Verify root `menu-group` class and `role="group"`
- Verify the visible heading is rendered with `aria-hidden="true"`
- Verify default slot renders children
- Verify `aria-label` matches the label prop

## References

- [Adobe Spectrum — Menu](https://spectrum.adobe.com/page/menu/)
- [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
