# Text Input With Search

TextInputWithSearch is a headless component that wraps a native `<input type="text">` and a `<button type="button">` inside a `<div role="search">`. The search button triggers a callback with the current input value, and pressing Enter in the input also triggers the search.

This component is useful for search bars, filter inputs, lookup fields, and any interface where users type a query and explicitly trigger a search action.

## Implementation Notes

- Renders a wrapper `<div role="search">` containing a text input and a search button
- The text input is `<input type="text">` for entering a search query
- The search button is `<button type="button">` that triggers the search callback
- Pressing Enter in the input also triggers the search callback
- Uses `aria-label` for accessible naming on the region, input, and button
- Supports two-way binding on the `value` prop
- Spreads `restProps` onto the wrapper `<div>` for consumer extensibility

## Props

- `label`: string (required) -- accessible name for the search region via `aria-label`
- `inputLabel`: string (default: "Search") -- accessible name for the text input via `aria-label`
- `searchLabel`: string (default: "Search") -- accessible label and text for the search button
- `value`: string (default: "") -- bindable text input value
- `placeholder`: string (optional) -- placeholder text for the input
- `onsearch`: `(value: string) => void` (optional) -- callback when search is triggered
- `required`: boolean (default: false) -- whether the input is required
- `disabled`: boolean (default: false) -- whether the input and button are disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Usage

Patient lookup with custom labels:

```html
<TextInputWithSearch
  label="Patient lookup"
  inputLabel="Patient name"
  searchLabel="Find"
  value={query}
  onsearch={handlePatientSearch}
  placeholder="Enter patient name or ID"
/>
```

Address lookup triggering an external API:

```html
<TextInputWithSearch
  label="Address search"
  inputLabel="Postcode or street"
  searchLabel="Look up"
  value={address}
  onsearch={handleAddressLookup}
  placeholder="e.g. SW1A 1AA"
/>
```

Site-wide search bar with button:

```html
<TextInputWithSearch label="Site search" onsearch={handleSiteSearch} placeholder="Search..." />
```

## Keyboard Interactions

- Tab: Moves focus between the text input and search button
- Enter in the text input: Triggers the search callback
- Enter/Space on the search button: Triggers the search callback

## ARIA

- `role="search"` -- on the wrapper `<div>` to establish a search landmark
- `aria-label={label}` -- provides an accessible name for the search region
- `aria-label={inputLabel}` -- provides an accessible name for the text input
- `aria-label={searchLabel}` -- provides an accessible name for the search button

## When to Use

- Use TextInputWithSearch for a text input with an integrated search action button, such as address lookup or patient search.
- Use TextInputWithSearch for search bars where users explicitly trigger a query by clicking a button or pressing Enter.
- Use TextInputWithSearch for lookup fields where the search action calls an external service.
- Use TextInputWithSearch when the search action has visible side effects, such as navigating to a results page.

## When Not to Use

- Do not use TextInputWithSearch for simple search fields without a button -- use SearchInput instead.
- Do not use TextInputWithSearch for filtering within a fixed list of options -- use Combobox instead.
- Do not use TextInputWithSearch for general text entry without search functionality -- use TextInput instead.

## Headless

This headless component provides a `<div role="search">` wrapping a native `<input type="text">` and `<button type="button">` with accessible labeling via `aria-label`, two-way value binding, Enter key support, and a search callback. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.text-input-with-search` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a wrapper `<div>` with class `text-input-with-search` and `role="search"`
- Verify it contains an `<input type="text">` with `aria-label`
- Verify it contains a `<button type="button">` with `aria-label`
- Verify clicking the search button calls the `onsearch` callback with the input value
- Verify pressing Enter in the input calls the `onsearch` callback
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied to the wrapper `<div>`

## Advice

- **Designers**: Position the search button adjacent to the input. Use a recognizable search icon or text label.
- **Developers**: The `onsearch` callback receives the current input value as a string. Handle empty string searches as appropriate for your use case.

## References

- MDN text input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- WAI-ARIA search role: https://www.w3.org/TR/wai-aria-1.2/#search
