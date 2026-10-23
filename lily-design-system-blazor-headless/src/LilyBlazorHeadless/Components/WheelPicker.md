# WheelPicker

A vertical single-select listbox where the selection follows the cursor, for choosing one of a short list by typing, the arrow keys or a click.

Full documentation: [components/wheel-picker/index.md](../../../../components/wheel-picker/index.md).

## Parameters

- `Label` (required), `Options` (required, `WheelPickerOption(Value, Label, Disabled)`), `Value` / `ValueChanged` (`@bind-Value`), `Loop`, `PageSize` (default 5), `Disabled`, `Name`, `CssClass`
- Unmatched attributes spread onto the root `<div>`; the key model is `WheelPickerKeys`

## Deviations from the Svelte canonical (no JS interop)

- A handler cannot call `preventDefault` for only some keys, so the arrow and page keys also scroll the list; give `.wheel-picker-list` `overflow: hidden` to prevent that.
- The selected option is not re-centred by script; use CSS scroll-snap or scroll the option into view from your own code.

## Usage

```razor
<WheelPicker Label="Month" Options="months" @bind-Value="month" />
```
