# ActionGroup

A group of action buttons that can collapse to an overflow menu when space is constrained.

## Implementation Notes

- Headless: no CSS
- `role="group"` with required `aria-label`
- The overflow trigger renders only when the `overflow` slot is provided
- Overflow content panel is hidden when `overflowOpen` is `false`

## Props

- `label`: string (**required**) — aria-label for the group
- `overflowOpen`: boolean (default `false`) — whether the overflow menu is open
- `overflowLabel`: string (optional) — aria-label for the overflow trigger
- default slot — visible action buttons
- `overflow` slot (optional) — content for the overflow menu

## Events

- `overflowToggle(event: MouseEvent)`

## Usage

```vue
<ActionGroup
    label="Toolbar"
    :overflow-open="open"
    overflow-label="More actions"
    @overflow-toggle="open = !open"
>
    <Button>One</Button>
    <Button>Two</Button>
    <template #overflow>
        <Menu>
            <MenuItem>Three</MenuItem>
            <MenuItem>Four</MenuItem>
        </Menu>
    </template>
</ActionGroup>
```

## ARIA

- `role="group"` with `aria-label`
- Overflow trigger has `aria-haspopup="menu"` and `aria-expanded`
- Overflow panel uses the native `hidden` attribute when closed

## When to Use

- Toolbars where the available space may be too small for all actions
- Action sets that need a "more" overflow

## When Not to Use

- For mutually exclusive choices — use `SegmentGroup` or a radio set instead

## Headless

Renders semantic HTML and ARIA only. Consumers supply visual styling and the overflow menu component.

## Testing

- Verify root `action-group` class and `role="group"`
- Verify the overflow trigger only renders when an `overflow` slot is supplied
- Verify `aria-expanded` reflects `overflowOpen`
- Verify `overflowToggle` fires on trigger click

## References

- [Adobe Spectrum — Action Group](https://spectrum.adobe.com/page/action-group/)
- [WAI-ARIA Authoring Practices — Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
