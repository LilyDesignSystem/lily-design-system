# Action Group

An action group is a row of related action buttons that can collapse to an
overflow menu when horizontal space is constrained.

Use it to surface a closely related set of bulk or context actions —
formatting controls, view toggles, or shortcut commands — where the
collection should be perceived as one logical unit. When space is tight,
overflow items move into a menu behind a single trigger.

## Implementation Notes

- Uses a `<div>` with `role="group"` and a required `aria-label`
- `overflow` is an optional slot/snippet/ReactNode for the overflow menu content (typically a `Menu` of hidden actions)
- The overflow trigger button renders only when `overflow` is provided
- The overflow trigger has `aria-haspopup="menu"` and reflects open state via `aria-expanded`
- The overflow menu container uses the `hidden` attribute when closed
- Visible action buttons are children — typically `Button`, `ActionBarButton`, or `ToggleButton` components

## Props

- `label`: string (**required**) -- aria-label for the group
- `overflowOpen`: boolean (default `false`) -- whether the overflow menu is open
- `overflowLabel`: string (optional) -- aria-label for the overflow button (e.g., "More actions")
- `onOverflowToggle` / `onoverflowtoggle`: callback (optional) -- overflow trigger click handler
- `children`: slot -- the visible action buttons
- `overflow`: slot/snippet/ReactNode (optional) -- content for the overflow menu
- `...restProps`: any additional HTML attributes

## Usage

```html
<ActionGroup
  label="Text formatting"
  overflowOpen={open}
  overflowLabel="More actions"
  onOverflowToggle={handleToggle}
  overflow={<Menu>...</Menu>}
>
  <Button label="Bold">B</Button>
  <Button label="Italic">I</Button>
  <Button label="Underline">U</Button>
</ActionGroup>
```

## Keyboard Interactions

- Tab: Move focus into and out of the group
- Arrow keys: (Consumer-provided) roving tabindex among action buttons is recommended
- Enter / Space: Activate the focused action button or toggle the overflow menu
- Escape: (Consumer-provided) close the overflow menu when open

## ARIA

- `role="group"` on the container
- `aria-label` provides the accessible name (required)
- Overflow trigger has `aria-haspopup="menu"` and `aria-expanded`
- Overflow menu container is hidden via the `hidden` attribute when closed

## When to Use

- Use to group a small set of related actions that share context
- Use when overflow behavior is needed for narrow viewports
- Use to give a logical grouping its own accessible name

## When Not to Use

- Do not use for primary navigation — use a `NavigationMenu` or `TabBar`
- Do not use for unrelated actions — they belong in separate groups or in a `ToolBar`
- Do not use when only one or two actions are present and overflow is not needed

## Composition

Action groups commonly contain `Button`, `ToggleButton`, or `ActionBarButton`
children, and pair with a `Menu` for overflow content.

```html
<ActionGroup label="Alignment" overflow={<Menu>...</Menu>}>
  <ToggleButton label="Left">L</ToggleButton>
  <ToggleButton label="Center">C</ToggleButton>
  <ToggleButton label="Right">R</ToggleButton>
</ActionGroup>
```

## Headless

Renders a `<div role="group">` with `aria-label` and optional overflow
trigger plus overflow panel. Open/close state, positioning, animation, and
visual treatment are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `action-group` class. The overflow trigger uses
`action-group-overflow-trigger` and the overflow menu uses
`action-group-overflow-menu`. Provide a clear focus indicator on every
interactive descendant.

## Testing

- Verify the component renders a `<div>` with `role="group"` and class `action-group`
- Verify `aria-label` equals the `label` prop
- Verify visible children are rendered before any overflow trigger
- Verify the overflow trigger renders only when `overflow` is provided
- Verify `aria-expanded` on the overflow trigger reflects `overflowOpen`
- Verify the overflow panel uses `hidden` when `overflowOpen` is `false`
- Verify `onOverflowToggle` fires when the overflow trigger is activated

## Advice

- **Designers**: Establish a clear primary-to-secondary order; promote the most-used actions and demote infrequent actions to the overflow menu.
- **Developers**: Manage `overflowOpen` state in the consumer; close it on outside click and on Escape.

## Related components

- `button-group` — a wrapper that groups related buttons together
- `tool-bar` — a horizontal bar of tool actions

## References

- WAI-ARIA Group: https://www.w3.org/TR/wai-aria-1.2/#group
- Adobe Spectrum Action Group: https://spectrum.adobe.com/page/action-group/
- WCAG 4.1.2 Name, Role, Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value
