# Command

A command palette provides a searchable list of actions or items. Users type into a search input to filter and select commands via keyboard or mouse. This pattern is commonly used for quick-access command palettes (e.g., Ctrl+K interfaces), searchable menus, and action launchers.

The component renders a search region containing a text input and a listbox for results. The search value is bindable, allowing consumers to implement their own filtering logic and dynamically update the listbox content.

## Implementation Notes

- Wraps content in a `<div>` with `role="search"` and `aria-label` for semantic search region
- Contains an `<input type="search">` with `autocomplete="off"` to prevent browser autocomplete interference
- Contains a `<div>` with `role="listbox"` for displaying filtered results
- Uses `$bindable()` for the `value` prop, enabling two-way binding with the parent component
- Children snippet is rendered inside the listbox for consumer-controlled list items
- Spreads `restProps` on the outer search container

## Props

- `label`: string (required) -- accessible name for both the search region and the input
- `placeholder`: string (default: `undefined`) -- placeholder text for the search input
- `value`: string (default: `""`, bindable) -- current search text, supports two-way binding via `bind:value`
- `children`: Snippet (required) -- listbox content, typically option or command items
- `...restProps`: any additional HTML attributes spread onto the outer `<div>`

## Usage

```svelte
<Command label="Command palette" placeholder="Search commands..." bind:value={query}>
    {#each filteredCommands as cmd}
        <div role="option">{cmd.name}</div>
    {/each}
</Command>
```

## Keyboard Interactions

- **Tab**: Moves focus into and out of the search input
- Additional keyboard navigation (arrow keys within the listbox) should be implemented by the consumer

## ARIA

- `role="search"` -- identifies the outer container as a search landmark region
- `aria-label={label}` -- provides accessible name for the search region and input
- `role="listbox"` -- identifies the results container as a listbox for selectable options
- `aria-label={label}` -- provides accessible name for the listbox

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/listbox/
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/combobox/
