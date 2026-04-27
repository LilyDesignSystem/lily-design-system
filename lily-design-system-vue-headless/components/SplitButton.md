# SplitButton

A button with a primary action and a dropdown trigger for related actions. Renders a `<div role="group" class="split-button">` containing a primary `<button class="split-button-primary">`, a menu-trigger `<button class="split-button-menu-trigger">` (with `aria-haspopup="menu"` and `aria-expanded`), and a `<div class="split-button-menu" hidden>` that holds consumer-supplied menu content.

## Implementation Notes

- Headless: no CSS or styles
- `role="group"` with `aria-label` clusters the two buttons
- The menu trigger renders no inner glyph; consumers style via the `split-button-menu-trigger` class
- The menu container's visibility is communicated via the `hidden` attribute and `aria-expanded`
- `data-menu-open` exposes the open state for CSS hooks

## Props

- `label`: string (**required**) — group `aria-label`
- `primaryLabel`: string (**required**) — primary button text
- `menuLabel`: string (**required**) — menu trigger `aria-label`
- `menuOpen`: boolean (default `false`)
- `disabled`: boolean (default `false`) — disables both buttons
- default slot — menu content
- `...$attrs` — additional HTML attributes

## Events

- `primaryClick(event: MouseEvent)`
- `menuToggle(event: MouseEvent)`

## Usage

```vue
<SplitButton
    label="Save options"
    primary-label="Save"
    menu-label="More save actions"
    :menu-open="open"
    @primary-click="onSave"
    @menu-toggle="onToggle"
>
    <Menu>
        <MenuItem>Save and close</MenuItem>
        <MenuItem>Save as draft</MenuItem>
    </Menu>
</SplitButton>
```

## Keyboard Interactions

- `Tab` moves focus between the primary button and the menu trigger
- `Enter` / `Space` activates each button
- Menu navigation is delegated to the consumer's menu content

## ARIA

- `role="group"` with `aria-label`
- `aria-haspopup="menu"` and `aria-expanded` on the trigger

## When to Use

- Save / Save-as combinations, primary action with related variants
- Toolbar primary actions with secondary options

## When Not to Use

- Single-action buttons — use `Button`
- Menus without a primary action — use `DropdownMenu`

## Headless

No styling is applied. The component supplies semantic structure, ARIA attributes, and event hooks; consumers style and supply menu content.

## Testing

- Verify root class and `role="group"` with `aria-label`
- Verify both buttons render with their labels and types
- Verify `aria-haspopup="menu"` and `aria-expanded` on the trigger
- Verify the menu container's `hidden` attribute reflects `menuOpen`
- Verify `primaryClick` and `menuToggle` events fire on activation

## References

- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
