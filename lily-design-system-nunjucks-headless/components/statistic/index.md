# Statistic

a numeric value display with title, prefix, and suffix

## Description

Statistic renders a `<div role="group">` containing a title and a
formatted value. Optional prefix and suffix elements appear before
and after the value (typically a currency symbol, unit, or trend
icon).

The value is consumer-formatted as a string. The macro does not
format numbers, locales, or units.

## HTML tag

`<div>` with `role="group"`

## CSS class

`statistic`

## Params

- `title` — string. **Required.** Statistic label/heading.
- `value` — string. **Required.** Pre-formatted value text.
- `prefix` — string. Plain text rendered before the value (escaped).
- `prefixHtml` — string. Raw HTML rendered before the value (rendered
  via `| safe`). Takes precedence over `prefix`.
- `suffix` — string. Plain text rendered after the value (escaped).
- `suffixHtml` — string. Raw HTML rendered after the value (rendered
  via `| safe`). Takes precedence over `suffix`.
- `label` — string. Optional `aria-label` override (defaults to
  `"{title}: {value}"`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes on the root element.

## Usage

```njk
{% from "components/statistic/macro.njk" import statistic %}

{{ statistic({
  title: "Active users",
  value: "1,128"
}) }}
```

With prefix and suffix:

```njk
{{ statistic({
  title: "Revenue",
  value: "1,234.56",
  prefix: "$",
  suffix: " USD"
}) }}
```

With raw-HTML icon prefix:

```njk
{{ statistic({
  title: "Trending",
  value: "12.5",
  prefixHtml: '<svg viewBox="0 0 24 24" aria-hidden="true">…</svg>',
  suffix: "%"
}) }}
```

## Accessibility

- `role="group"` keeps the title and value together for screen
  readers.
- The default `aria-label` is `"{title}: {value}"`. Pass an explicit
  `label` to override (e.g., for localized punctuation).
- If the prefix/suffix are decorative icons, mark them with
  `aria-hidden="true"` inside the supplied HTML.

## Headless

No CSS or JavaScript is bundled.

## Testing

`components/statistic/macro.test.js` verifies the role, default and
overridden `aria-label`, title and value rendering, prefix/suffix
text and HTML, and pass-through.

## References

- [Ant Design: Statistic](https://ant.design/components/statistic)

---

Lily™ and Lily Design System™ are trademarks.
