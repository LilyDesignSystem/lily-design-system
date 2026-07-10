# ActionGroup

a group of action buttons that can collapse to an overflow menu
when space is constrained

## Description

ActionGroup wraps related action buttons inside a single labelled
group. When space is constrained, additional actions can be moved
into an overflow menu controlled by an extra trigger button.

The overflow trigger and panel are rendered only when
`overflowHtml` is supplied. The trigger advertises itself with
`aria-haspopup="menu"` and `aria-expanded`. The overflow panel is
hidden via the `hidden` attribute when `overflowOpen` is false.

The Nunjucks macro does not generate ids dynamically; if the
consumer wants to wire the trigger to the panel via
`aria-controls`, pass `overflowId` and the same id will be applied
to the panel's `id`.

## HTML tag

`<div role="group">`

## CSS class

`action-group`

## Params

- `label` — string. **Required.** `aria-label` for the group.
- `overflowOpen` — boolean. Default `false`. Whether the overflow
  menu is open.
- `overflowLabel` — string. Optional `aria-label` for the overflow
  trigger button (e.g. `"More actions"`).
- `overflowHtml` — string. Raw HTML content for the overflow menu
  (rendered via `| safe`). When provided, the overflow trigger
  button and the overflow panel are both rendered.
- `overflowId` — string. Optional id applied to the overflow panel
  and referenced by the trigger via `aria-controls`.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`),
  typically the visible action buttons.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/action-group/macro.njk" import actionGroup %}

{{ actionGroup({
  label: "Document actions",
  html: '<button type="button">Save</button>'
       + '<button type="button">Print</button>',
  overflowLabel: "More actions",
  overflowOpen: false,
  overflowId: "doc-overflow",
  overflowHtml: '<button type="button">Export</button>'
}) }}
```

## Accessibility

- `role="group"` plus `aria-label` describes the cluster.
- The overflow trigger has `aria-haspopup="menu"`, `aria-expanded`,
  and (optionally) `aria-controls`.
- The overflow panel uses the native `hidden` attribute when closed.

## Headless

No CSS or JavaScript is bundled. The consumer wires up click
handlers, focus management, and styling.

## Testing

`components/action-group/macro.test.js` verifies the base class,
group role and label, presence/absence of the overflow trigger,
`aria-expanded` and `hidden` toggling, and the `aria-controls`
linkage.

## References

- [WAI-ARIA: group role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/group_role)
- [Adobe Spectrum: Action group](https://spectrum.adobe.com/page/action-group/)

---

Lily™ and Lily Design System™ are trademarks.
