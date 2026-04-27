# InputGroup

a group wrapping an input with prefix and suffix addons

## Description

InputGroup is an ARIA group wrapper that places optional prefix and
suffix addons around an input element. The input itself is supplied
by the consumer (typically via the caller block) so the group does
not assume any particular input type.

## HTML tag

`<div>` with `role="group"`

## CSS class

`input-group` (with `input-group-prefix` / `input-group-suffix` on
addon spans)

## Params

- `text` — string. Plain text body (rare; prefer caller).
- `html` — string. Raw HTML body (the input markup).
- `prefix` — string (raw HTML). Optional addon before the input.
- `suffix` — string (raw HTML). Optional addon after the input.
- `label` — string. Optional `aria-label` for the group.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/input-group/macro.njk" import inputGroup %}

{% call inputGroup({
  label: "Price",
  prefix: "$",
  suffix: ".00"
}) %}
  <input type="number" id="price" name="price" value="0">
{% endcall %}
```

## Accessibility

- `role="group"` and `aria-label` provide a programmatic group name.
- The wrapped input keeps its own label association — typically a
  `<label for="…">` outside the group, or `aria-label` on the input
  itself.
- Prefix / suffix addons are decorative containers — make sure any
  text inside them either repeats redundant info or is exposed via
  the input's accessible description if it is meaningful.

## When to use

- Currency inputs (`$` prefix, `.00` suffix).
- URL inputs (`https://` prefix).
- Username inputs (`@` prefix).

## When not to use

- For freeform compound forms, use `Field`.

## Headless

No CSS shipped. The consumer styles the group, prefix, and suffix
using the `input-group`, `input-group-prefix`, and
`input-group-suffix` classes.

## Testing

`components/input-group/macro.test.js` verifies the base class,
`role="group"`, `aria-label`, prefix and suffix rendering, and order.
