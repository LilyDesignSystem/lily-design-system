# Menu Group

A menu group is a labeled section of menu items within a menu. It groups
related actions and presents a visible heading that names the group.

Use it inside a `Menu`, `DropdownMenu`, or `ContextMenu` to organize items
into clear sections — for example, "File", "Edit", or "View" — making
longer menus easier to scan.

## Implementation Notes

- Uses a `<div>` with `role="group"` and a required `aria-label`
- Renders a visible heading element `<div class="menu-group-heading" aria-hidden="true">` containing the label text
- The heading is hidden from assistive technology because the `aria-label` already conveys the group name to AT
- Children are typically `MenuItem` components

## Props

- `label`: string (**required**) -- section heading text (also used as aria-label)
- `children`: slot -- `menu-item` children
- `...restProps`: any additional HTML attributes

## Usage

```html
<Menu label="File menu">
  <MenuGroup label="File">
    <MenuItem>New</MenuItem>
    <MenuItem>Open</MenuItem>
    <MenuItem>Save</MenuItem>
  </MenuGroup>
  <MenuGroup label="Edit">
    <MenuItem>Undo</MenuItem>
    <MenuItem>Redo</MenuItem>
  </MenuGroup>
</Menu>
```

## Keyboard Interactions

- (Provided by the parent menu) Arrow keys: Move focus between menu items, including across group boundaries
- (Provided by the parent menu) Enter / Space: Activate the focused menu item
- (Provided by the parent menu) Escape: Close the menu

## ARIA

- `role="group"` on the container
- `aria-label` provides the accessible name (required)
- The visible heading uses `aria-hidden="true"` to avoid double-announcement

## When to Use

- Use to divide a menu into clearly labeled sections
- Use when item categories help users scan and find actions
- Use within a parent `Menu`, `DropdownMenu`, or `ContextMenu`

## When Not to Use

- Do not use for unrelated, ungrouped menu items
- Do not nest groups inside groups — flatten the structure or use a submenu
- Do not use as a standalone menu — pair with a parent menu

## Composition

Menu groups sit inside a parent menu and contain `MenuItem` children:

```html
<Menu label="Actions">
  <MenuGroup label="Recent files">
    <MenuItem>report.pdf</MenuItem>
    <MenuItem>notes.md</MenuItem>
  </MenuGroup>
</Menu>
```

## Headless

Renders a `<div role="group">` with `aria-label` plus a hidden-from-AT
heading and slotted `MenuItem` children. Spacing, dividers, and visual
treatment are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `menu-group` class and the inner
`menu-group-heading` class for the visible label. Provide visual separation
between groups (e.g., a top border or extra padding) without relying on
color alone.

## Testing

- Verify the component renders a `<div>` with `role="group"` and class `menu-group`
- Verify `aria-label` equals the `label` prop
- Verify the visible heading is rendered with class `menu-group-heading` and `aria-hidden="true"`
- Verify the heading text equals the `label` prop
- Verify children are rendered after the heading

## Advice

- **Designers**: Use group labels that describe the category, not the count or layout (e.g., "Edit", not "Three options").
- **Developers**: Localize the `label` prop; avoid translating it inside the component.

## Related components

- `menu-item` — one item in a menu

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- WAI-ARIA Group: https://www.w3.org/TR/wai-aria-1.2/#group
- Adobe Spectrum Menu: https://spectrum.adobe.com/page/menu/

---

Lily™ and Lily Design System™ are trademarks.
