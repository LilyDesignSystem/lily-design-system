# WheelPicker

A vertical single-select listbox where the selection follows the cursor.

Full documentation: [components/wheel-picker/index.md](../../../components/wheel-picker/index.md).

## Server rendering

The macro renders the markup contract only. A server cannot handle keys, so the behaviour is the browser's: include the script from `html-headless`'s `wheel-picker.html` (it reads this markup, including `data-loop` and `data-page-size`) or use the Web Components element. Without either the list is static.

## Params

- `label` (required), `options` (required, `[{ value, label, disabled? }]`), `value`, `loop`, `pageSize`, `disabled`, `name`, `id`, `classes`, `attributes`

## Usage

```njk
{% from "components/wheel-picker/macro.njk" import wheelPicker %}
{{ wheelPicker({ label: "Month", options: months, value: "2", name: "month" }) }}
```
