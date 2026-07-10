# SplitButton

a button with a primary action and a dropdown for related actions

## Description

SplitButton renders a `role="group"` container with two `<button>`s:
a **primary** action button and a **menu trigger** button. The
trigger exposes `aria-haspopup="menu"` and `aria-expanded` so that
assistive technology can announce the dropdown state. The menu
container itself is rendered as a sibling `<div class="split-button-menu">`
that is hidden when `menuOpen` is false.

Click handlers and open/close behavior are the consumer's
responsibility — this is a server-side Nunjucks template and ships no
JavaScript.

## HTML tag

`<div>` with `role="group"`

## CSS class

`split-button` (with `split-button-primary`,
`split-button-menu-trigger`, and `split-button-menu` on inner
elements)

## Params

- `label` — string. **Required.** `aria-label` for the group.
- `primaryLabel` — string. **Required.** Text for the primary
  button.
- `primaryHtml` — string. Optional raw HTML override for the
  primary button content.
- `menuLabel` — string. **Required.** `aria-label` for the
  dropdown trigger button.
- `menuOpen` — boolean. Whether the dropdown menu is open.
  Default `false`.
- `disabled` — boolean. Disables both buttons.
- `triggerHtml` — string. Optional raw HTML for the trigger
  button content (e.g. a chevron icon).
- `primaryId` — string. id for the primary button.
- `triggerId` — string. id for the trigger button.
- `menuId` — string. id for the menu container; when supplied,
  the trigger receives `aria-controls`.
- `text` — string. Plain text body for the menu container.
- `html` — string. Raw HTML body for the menu container.
- `id` — string. id for the group root.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/split-button/macro.njk" import splitButton %}

{% call splitButton({
  label: "Save options",
  primaryLabel: "Save",
  menuLabel: "More save options",
  menuId: "save-menu",
  menuOpen: false,
  triggerHtml: '<span aria-hidden="true">▾</span>'
}) %}
  <ul role="menu">
    <li role="menuitem">Save as…</li>
    <li role="menuitem">Save and close</li>
  </ul>
{% endcall %}
```

## Keyboard

- Tab to focus either button.
- Enter / Space activates the focused button.
- Consumers should also wire ArrowDown on the trigger to open the
  menu and move focus to the first menu item, plus Escape to close.

## Accessibility

- `role="group"` on the wrapper groups the two buttons under one
  accessible name (`aria-label`).
- `aria-haspopup="menu"` and `aria-expanded` on the trigger reflect
  the dropdown state.
- `aria-controls` ties the trigger to the menu container when
  `menuId` is provided.
- Icon-only triggers must keep their `aria-label` (the macro
  enforces this via `menuLabel`).

## When to use

- A primary action that has closely related variants (Save / Save as
  / Save and close).

## When not to use

- For independent navigation, use `DropdownMenu` directly.
- For mutually exclusive options, use a `SegmentGroup`.

## Headless

No CSS or JavaScript shipped. The consumer must:

- Wire click handlers for the primary and trigger buttons.
- Toggle `menuOpen` (re-render or update the DOM) to open/close.
- Manage focus, Escape key, and outside-click dismissal.

## Testing

`components/split-button/macro.test.js` verifies the group role,
group `aria-label`, primary button text/HTML rendering, trigger
`aria-haspopup` / `aria-expanded` / `aria-label`, `aria-controls`
wiring, the `hidden` attribute on the menu, and the disabled state
on both buttons.

## References

- [WAI-ARIA: button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WAI-ARIA: menu button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/)

---

Lily™ and Lily Design System™ are trademarks.
