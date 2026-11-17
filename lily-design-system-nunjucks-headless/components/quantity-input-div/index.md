# QuantityInputDiv

A quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md P29-T8). The canonical contract is
`components/quantity-input-div/index.md`.

## Props

- `classes`: string (optional) -- CSS class appended to `quantity-input-div`
- `label`: string (required) -- the group's name
- `magnitudeLabel`: string (required) -- the number input's label
- `unitLabel`: string (required when there is more than one unit) -- the unit select's label
- `units`: units (required) -- `{ value, label, min?, max?, step? }`, the first the default; the number takes the chosen unit's limits
- `magnitude`, `unit`: string -- the number as typed and the unit chosen; two-way
- `name`: string (optional) -- base name for `-magnitude` and `-unit`

## Usage

```njk
{{ quantityInputDiv({ label: "Weight", magnitudeLabel: "Amount", unitLabel: "Unit", name: "weight", units: units }) }}
```
