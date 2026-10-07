# Accessibility — `<link-picker>`

WCAG 2.2 AAA is the target; the contract is the Svelte package's, ported unchanged.

- The icon is `aria-hidden`; the name is the consumer's `label` (button, list and tooltip).
- `aria-expanded` / `aria-controls` on the button; the list is named.
- Real `<a href>` links, not `role="menuitem"`: middle-click, open-in-new-tab and copy-link-address keep working.
- `aria-current="page"` on the link marked `current`.
- Keyboard: Enter/Space toggle; ArrowDown/ArrowUp open and move (clamped); Home/End jump; Escape closes and returns focus; Tab
  closes with focus on the button first.
- Opening focuses a link with `preventScroll`.
- Tooltip: hoverable, dismissable with Escape, never shown while the list is open.

**Cost:** the name rests on `label`; and navigation behind an icon is for a few header links, not primary navigation.
