# Combobox

A combobox combines a text input with a dropdown listbox of suggestions, providing an autocomplete or type-ahead search experience. Users type into the input to filter suggestions, then select from matching options in the dropdown. This pattern is commonly used for search fields, address inputs, tag selectors, and any scenario where users choose from a large set of options.

The component manages the input value and dropdown open state as controlled props, so consumers can reactively filter options and control visibility. It supports full ARIA combobox semantics including `aria-expanded`, `aria-controls`, and `aria-autocomplete` for screen reader accessibility.

## Implementation Notes

- Renders a wrapper `<div>` containing an `<input>` with `role="combobox"` and a conditionally rendered `<div>` with `role="listbox"`.
- Generates a unique `listboxId` using random string for the `aria-controls` relationship between input and listbox.
- The `value` prop supports controlled component usage for the input text.
- The `open` prop supports controlled component usage for dropdown visibility.
- The listbox is conditionally rendered to hide it from the DOM when closed.
- Escape key closes the dropdown via an `onKeyDown` handler on the input.
- Spreads `restProps` onto the outer wrapper `<div>`.

## Props

- `label`: string (required) -- accessible name applied via `aria-label` on both the input and listbox.
- `value`: string (default: `""`) -- controlled current text input value.
- `open`: boolean (default: `false`) -- controlled dropdown visibility state.
- `children`: ReactNode (required) -- option elements rendered inside the listbox dropdown.
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`.

## Usage

```tsx
<Combobox label="Search" value={value} onChange={setValue} open={open} onOpenChange={setOpen}>
    <div role="option" tabindex="-1">Option 1</div>
</Combobox>
```

```tsx
const [value, setValue] = useState("");
const [open, setOpen] = useState(false);
const options = ["Apple", "Banana", "Cherry"];
const filtered = useMemo(() => options.filter(o => o.toLowerCase().includes(value.toLowerCase())), [value]);

<Combobox label="Select a fruit" value={value} onChange={setValue} open={open} onOpenChange={setOpen}>
    {filtered.map(option => (
        <div role="option" tabindex="-1" onClick={() => { setValue(option); setOpen(false); }} key={option}>
            {option}
        </div>
    ))}
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

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
