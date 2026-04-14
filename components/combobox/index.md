# Combobox

A combobox combines a text input with a dropdown listbox of suggestions, providing an autocomplete or type-ahead search experience. Users type into the input to filter suggestions, then select from matching options in the dropdown. This pattern is commonly used for search fields, address inputs, tag selectors, and any scenario where users choose from a large set of options.

The component manages the input value and dropdown open state as bindable props, so consumers can reactively filter options and control visibility. It supports full ARIA combobox semantics including `aria-expanded`, `aria-controls`, and `aria-autocomplete` for screen reader accessibility.

## Implementation Notes

- Renders a wrapper `<div>` containing an `<input>` with `role="combobox"` and a conditionally rendered `<div>` with `role="listbox"`.
- Generates a unique `listboxId` using random string for the `aria-controls` relationship between input and listbox.
- The `value` prop uses two-way binding of the input text.
- The `open` prop uses two-way binding of dropdown visibility.
- The listbox is conditionally rendered with conditional rendering to hide it from the DOM when closed.
- Escape key closes the dropdown via an `onkeydown` handler on the input.
- Spreads `restProps` onto the outer wrapper `<div>`.

## Props

- `label`: string (required) -- accessible name applied via `aria-label` on both the input and listbox.
- `value`: string (default: `""`) -- bindable current text input value.
- `open`: boolean (default: `false`) -- bindable dropdown visibility state.
- `children`: slot (required) -- option elements rendered inside the listbox dropdown.
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`.

## Usage

Country selector with type-ahead filtering:

```html
<Combobox label="Select country" value={country} open={countryOpen}>
    <div role="option" tabindex="-1" onclick={() => { country = 'United Kingdom'; countryOpen = false; }}>United Kingdom</div>
    <div role="option" tabindex="-1" onclick={() => { country = 'United States'; countryOpen = false; }}>United States</div>
    <div role="option" tabindex="-1" onclick={() => { country = 'France'; countryOpen = false; }}>France</div>
</Combobox>
```

Medication picker with dynamic filtering:

```html
<Combobox label="Search medications" value={medQuery} open={medOpen}>
    {#each filteredMedications as med}
        <div role="option" tabindex="-1" onclick={() => { medQuery = med.name; medOpen = false; }}>
            {med.name} ({med.dosage})
        </div>
    {/each}
</Combobox>
```

## Keyboard Interactions

- Escape: Closes the dropdown listbox.

## ARIA

- `role="combobox"` -- on the `<input>`, identifies it as a combobox widget.
- `aria-label` -- provides an accessible name for both the input and the listbox.
- `aria-expanded` -- reflects the `open` state, telling screen readers whether the dropdown is visible.
- `aria-controls` -- links the input to its associated listbox by ID.
- `aria-autocomplete="list"` -- indicates the input provides autocomplete suggestions via a list.
- `role="listbox"` -- on the dropdown container, identifies it as a list of selectable options.

## When to Use

- Use Combobox when users need to filter and select from a large set of options by typing, such as search fields, address inputs, or tag selectors.
- Use Combobox when the option list is too long for a standard select dropdown and users benefit from type-ahead filtering.
- Use Combobox for autocomplete fields where the user types partial text and selects from matching suggestions.
- Use Combobox for medication or diagnosis pickers in healthcare applications where the option list may contain hundreds of entries.

## When Not to Use

- Do not use Combobox for short option lists (under 7 items) -- use RadioGroup or Select instead.
- Do not use Combobox for free-text entry without a predefined list of options -- use TextInput instead.
- Do not use Combobox for command palettes or action launchers -- use Command instead.
- Do not use Combobox for visible option lists that do not need a text filter -- use Listbox instead.

## Headless

This headless Combobox component provides an `<input>` with `role="combobox"`, `aria-expanded`, `aria-controls`, and `aria-autocomplete="list"`, paired with a conditionally rendered `role="listbox"` dropdown. The consumer provides all visual styling including input appearance, dropdown positioning, option highlighting, loading indicators, and animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.combobox` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `combobox`
- Verify role="combobox"` -- on the `<input>`, identifies it as a combobox widget.
- Verify aria-label` -- provides an accessible name for both the input and the listbox.
- Verify role="listbox"` -- on the dropdown container, identifies it as a list of selectable options.
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Show a clear visual distinction between the input field and the dropdown list. Highlight the currently focused option and provide feedback when no results match.
- **Developers**: Implement your own filtering logic by reacting to the bindable `value` prop. Provide `role="option"` elements as children and manage selection state externally.

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/combobox/
