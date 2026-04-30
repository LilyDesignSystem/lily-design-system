# Split Button

A split button is a paired control composed of a primary action button and a
secondary dropdown trigger, both contained inside a single ARIA group. The
primary button performs the most common action; the dropdown reveals a menu
of related secondary actions.

Use it where one default action is dominant but related variants must remain
discoverable — for example "Save / Save as…", "Send / Schedule send", or
"Export / Export as PDF / Export as CSV".

## Implementation Notes

- Renders a `<div>` with `role="group"` and `class="split-button"`
- The group's `aria-label` is set from the `label` prop
- The primary button: `<button class="split-button-primary" type="button">{primaryLabel}</button>`
- The menu trigger: `<button class="split-button-menu-trigger" type="button" aria-haspopup="menu" aria-expanded={menuOpen} aria-label={menuLabel}></button>`
- The menu container: `<div class="split-button-menu" hidden={!menuOpen}>{children}</div>`
- The headless component renders no visual chevron — consumers may slot/style their own
- Keeps the primary action and dropdown as separate buttons so each has its own focus and click target

## Props

- `label`: string (required) -- aria-label for the group
- `primaryLabel`: string (required) -- text for the primary action button
- `menuLabel`: string (required) -- aria-label for the dropdown trigger
- `menuOpen`: boolean (default: false) -- whether the dropdown menu is open
- `disabled`: boolean (default: false)
- `onPrimaryClick` / `onprimaryclick`: callback -- primary action handler
- `onMenuToggle` / `onmenutoggle`: callback -- menu toggle handler
- `children`: slot -- the menu content (typically a `Menu` component)
- `...restProps`: any additional HTML attributes

## Usage

Save with related actions:

```html
<SplitButton
  label="Save options"
  primaryLabel="Save"
  menuLabel="More save options"
  menuOpen={isMenuOpen}
  onPrimaryClick={handleSave}
  onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
>
  <Menu label="More save options">
    <MenuItem onclick={handleSaveAs}>Save as…</MenuItem>
    <MenuItem onclick={handleSaveAndClose}>Save and close</MenuItem>
  </Menu>
</SplitButton>
```

Disabled split button:

```html
<SplitButton
  label="Send options"
  primaryLabel="Send"
  menuLabel="More send options"
  disabled
>
  <Menu label="More send options">
    <MenuItem>Schedule send</MenuItem>
  </Menu>
</SplitButton>
```

## Keyboard Interactions

- Tab: Move focus through the primary button, then the menu trigger
- Enter / Space on the primary button: Fire `onPrimaryClick`
- Enter / Space on the menu trigger: Toggle `onMenuToggle`
- Escape: The consumer's menu component handles closing

## ARIA

- `role="group"` on the wrapping `<div>` so assistive technology treats both buttons as one composite control
- `aria-label` on the group from the `label` prop
- `aria-haspopup="menu"` on the menu trigger
- `aria-expanded={menuOpen}` on the menu trigger
- `aria-label={menuLabel}` on the menu trigger because it has no text content

## When to Use

- Use when one primary action is dominant but secondary related actions must remain one click away.
- Use to keep the primary action a single click — split buttons preserve "default" speed while exposing alternates.
- Use for save, send, export, deploy, and similar action families.

## When Not to Use

- Do not use when there is no clear primary action — use a Menu or DropdownMenu instead.
- Do not use as the only navigation pattern (use NavigationMenu, MenuBar).
- Do not use when the actions are not related — secondary items should be variants of the primary.

## Headless

Provides only the structural composition (group, two buttons, hidden menu
container) and the ARIA wiring. The dropdown chevron, menu positioning,
focus management inside the menu, and any visual treatment are the
consumer's responsibility.

## Styles

Consumer CSS targets `.split-button`, `.split-button-primary`,
`.split-button-menu-trigger`, and `.split-button-menu` for visual styling and
positioning.

## Testing

- Verify the component renders a `<div>` with class `split-button` and `role="group"`
- Verify the group's `aria-label` equals the `label` prop
- Verify the primary button renders with class `split-button-primary` and text from `primaryLabel`
- Verify the menu trigger renders with class `split-button-menu-trigger` and `aria-label` from `menuLabel`
- Verify `aria-haspopup="menu"` and `aria-expanded={menuOpen}` on the menu trigger
- Verify the menu container has the `hidden` attribute when `menuOpen` is false
- Verify `onPrimaryClick` fires when the primary button is clicked
- Verify `onMenuToggle` fires when the menu trigger is clicked
- Verify `disabled` propagates to both buttons

## Advice

- **Designers**: Make the primary action visually dominant and the dropdown trigger a smaller adjacent affordance. Keep menu items to a short list of related variants.
- **Developers**: The component does not manage menu state — the consumer owns `menuOpen` and decides when to close (Escape, outside click, item selection). Pair with the Menu component for built-in keyboard navigation inside the menu.

## Related components

- `button` — a generic clickable button element
- `dropdown-menu` — a menu that opens below a trigger button
- `menu-bar-button` — one item in a menu bar

## References

- WAI-ARIA Disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- WAI-ARIA Menu Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
