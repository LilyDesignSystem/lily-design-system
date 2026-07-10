# OverlayContainer

a full-viewport overlay backdrop for modals and sheets

## Description

OverlayContainer renders a `role="presentation"` `<div>` intended to
sit behind modal content (a dialog, sheet, or drawer). It tracks an
`open` flag with `data-open`, `aria-hidden`, and the native `hidden`
attribute so consumers can rely on standard semantics. The overlay
itself is not styled — consumers position and color the backdrop.

## HTML tag

`<div>` with `role="presentation"`

## CSS class

`overlay-container`

## Params

- `open` — boolean. Whether the overlay is visible. Default `false`.
- `text` — string. Plain text content.
- `html` — string. Raw HTML content (rendered via `| safe`).
- `label` — string. Optional `aria-label`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Behavior

| `open` | `data-open` | `aria-hidden` | `hidden` |
| ------ | ----------- | ------------- | -------- |
| true   | "true"      | "false"       | absent   |
| false  | "false"     | "true"        | present  |

## Usage

```njk
{% from "components/overlay-container/macro.njk" import overlayContainer %}

{% call overlayContainer({ open: true, label: "Modal backdrop" }) %}
  <div role="dialog" aria-modal="true">
    <h2>Title</h2>
    <p>Body</p>
  </div>
{% endcall %}
```

## Accessibility

- `role="presentation"` keeps the overlay out of the accessibility
  tree as a landmark — the actual modal child carries `role="dialog"`
  and `aria-modal="true"`.
- The `hidden` attribute removes the overlay from the accessibility
  tree and tab order when closed.

## When to use

- Backdrop behind a `Dialog`, `Drawer`, or `Sheet`.

## When not to use

- For inline floating content, prefer `Popover` or `Tooltip`.

## Headless

No CSS or JavaScript shipped. Consumers handle:

- Backdrop color / opacity / blur
- Click-to-dismiss handlers
- Focus trapping inside the modal child
- Body scroll locking

## Testing

`components/overlay-container/macro.test.js` verifies the base class,
`role="presentation"`, and the open/closed state attributes
(`data-open`, `aria-hidden`, `hidden`).

---

Lily™ and Lily Design System™ are trademarks.
