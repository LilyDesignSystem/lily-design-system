# StatusLight

a small colored dot status indicator paired with a status label

## Description

StatusLight is a `<span role="status">` containing two child
spans: a decorative dot (`aria-hidden="true"`) and the status
label text. The variant is exposed as `data-variant` so the
consumer's CSS can choose the dot color.

## HTML tag

`<span role="status">`

## CSS class

`status-light`

## Params

- `label` — string. **Required.** Status text (e.g. `"Active"`,
  `"Offline"`). Forms the accessible content of the indicator.
- `variant` — `"neutral" | "informative" | "positive" | "notice" |
  "negative" | "active" | "inactive"`. Default `"neutral"`.
  Rendered as `data-variant`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/status-light/macro.njk" import statusLight %}

{{ statusLight({ variant: "positive", label: "Active" }) }}
{{ statusLight({ variant: "negative", label: "Offline" }) }}
{{ statusLight({ variant: "notice",   label: "Pending" }) }}
```

## Accessibility

- `role="status"` on the container so assistive technology treats
  it as a live status region.
- The dot carries `aria-hidden="true"` so only the label text is
  announced.

## Headless

No CSS or JavaScript bundled. The consumer styles the dot per
variant via `[data-variant]` selectors.

## Testing

`components/status-light/macro.test.js` verifies the base class,
`role="status"`, default and custom `data-variant`, the
`aria-hidden` dot, the label text, classes, and attributes.

## References

- [Adobe Spectrum: Status light](https://spectrum.adobe.com/page/status-light/)
- [WAI-ARIA: status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role)

---

Lily™ and Lily Design System™ are trademarks.
