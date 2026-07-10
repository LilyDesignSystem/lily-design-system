# Status Light

A status light is a small colored dot status indicator paired with a status
label.

Use it to communicate the state of a record, system, user, or process —
"Active", "Offline", "Error", "Pending" — at a glance, without relying on
color alone because the label is always present.

## Implementation Notes

- Uses a `<span>` with class `status-light` and `role="status"`
- `data-variant` exposes the chosen variant for consumer CSS
- The colored dot is `<span class="status-light-dot" aria-hidden="true">` because the text label conveys meaning to assistive tech
- The text label is `<span class="status-light-label">{label}</span>`
- Variants are: `neutral`, `informative`, `positive`, `notice`, `negative`, `active`, `inactive`
- `variant` defaults to `"neutral"`

## Props

- `variant`: `"neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive"` (default `"neutral"`) -- status variant; rendered as `data-variant`
- `label`: string (**required**) -- the status text (e.g., "Active", "Offline")
- `...restProps`: any additional HTML attributes

## Usage

```html
<StatusLight variant="positive" label="Active" />
<StatusLight variant="negative" label="Offline" />
<StatusLight variant="notice" label="Pending review" />
```

## Keyboard Interactions

None — `status-light` is a passive indicator, not interactive.

## ARIA

- `role="status"` on the container, so updates can be announced as appropriate
- The dot has `aria-hidden="true"` because color alone is not the accessible indicator
- The text label is the accessible content

## When to Use

- Use to indicate the current state of an item or system
- Use whenever color is not sufficient on its own — pair the dot with a label
- Use in tables, cards, lists, and headers to summarize status

## When Not to Use

- Do not use as an interactive control — use `Button`, `ToggleButton`, or `SwitchButton`
- Do not use for transient feedback — use `Toast` or `Notification`
- Do not omit the label — color alone fails accessibility (WCAG 1.4.1 Use of Color)

## Headless

Renders a `<span role="status">` containing a hidden dot and a visible
label. Visual color and shape are entirely the consumer's responsibility,
typically driven by the `data-variant` attribute.

## Styles

Consumer CSS targets the `status-light` class and uses `data-variant` to
choose dot colors. Sub-elements expose `status-light-dot` and
`status-light-label` for fine-grained styling. Always provide visible text
in addition to color.

## Testing

- Verify the component renders a `<span>` with class `status-light`
- Verify `role="status"` is present
- Verify `data-variant` equals the `variant` prop (defaulting to `"neutral"`)
- Verify the dot is rendered inside `<span class="status-light-dot">` with `aria-hidden="true"`
- Verify the label is rendered inside `<span class="status-light-label">`
- Verify the label text equals the `label` prop

## Advice

- **Designers**: Pair every color with a textual label and an icon shape if possible; never communicate state by color alone.
- **Developers**: Localize the `label` prop. If multiple status lights update at once, consider de-duplicating announcements at the page level.

## Related components

- `status-tag` — a tag showing the current status of a task
- `badge` — a small label for counts, statuses, or categories

## References

- WAI-ARIA `status` role: https://www.w3.org/TR/wai-aria-1.2/#status
- WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
- Adobe Spectrum Status Light: https://spectrum.adobe.com/page/status-light/

---

Lily™ and Lily Design System™ are trademarks.
