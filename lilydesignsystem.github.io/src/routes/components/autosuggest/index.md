# Autosuggest

A text input that proposes matching options as users type, helping people find an item from a long list without browsing the whole list.

The component implements the WAI-ARIA Combobox pattern: a single-line `<input>` is paired with a popup `<ul role="listbox">` that appears when there are suggestions and disappears when the user picks one or dismisses it. The consumer owns the matching logic — Autosuggest emits the typed query, the consumer returns a fresh list of suggestions, and the component handles focus, keyboard navigation, and ARIA wiring.

Use it for searches over large or remote datasets (countries, services, contacts, products) where typing should narrow the field, but where the user is also free to enter free-form text that may not appear in the suggestion list.

## Implementation Notes

- Implements the WAI-ARIA Combobox pattern (combobox + listbox + option) atop a text `<input>`
- Suggestions are produced by the consumer via the `onInput` callback (which receives the typed query and returns a list of options)
- Selecting a suggestion sets the input value and closes the listbox
- Supports two-way binding on the `value` prop
- Listbox is rendered only when there are suggestions and the input is focused
- Closing happens on Escape, click outside, blur, or successful selection

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible name for the input |
| `value` | string | "" | Bindable input value |
| `suggestions` | array of `{ value: string; label: string }` | [] | Current suggestions to show |
| `onInput` | (query: string) => void | — | Fired when the typed value changes; consumer recomputes suggestions |
| `onSelect` | (value: string) => void | — | Fired when the user selects a suggestion |
| `placeholder` | string | — | Placeholder text |
| `...restProps` | HTML attributes | — | Spread onto the wrapper `<div>` |

## Usage

```html
<Autosuggest label="Find a service" suggestions={current} onInput={handleQuery} onSelect={handleSelect} />
```

## Keyboard Interactions

- Down arrow: open the listbox / move highlight to the next option
- Up arrow: move highlight to the previous option
- Enter: select the highlighted option
- Escape: close the listbox without selecting
- Home / End: jump to the first / last option (when listbox is open)

## ARIA

- `role="combobox"` on the wrapper, `aria-expanded` toggled to reflect listbox visibility
- `aria-controls` on the input references the listbox id
- `aria-activedescendant` on the input references the currently highlighted option
- `role="listbox"` on the suggestion list, `role="option"` on each suggestion
- Selected option has `aria-selected="true"`

## When to Use

- Searching long lists of options where typing narrows the choices (e.g. countries, services, contacts)
- Implementing search-as-you-type with server-driven results

## When Not to Use

- Use `Combobox` when you want a permanent dropdown that may also accept typed values
- Use `Select` for short, fixed lists of options
- Use `MentionsInput` for at-mentions inside a textarea

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.autosuggest` as the root class. No default styles are included.

## Related components

- `combobox` — input with a permanent dropdown filter
- `select` — native select dropdown
- `mentions-input` — at-mention autocomplete inside a textarea

## References

- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
