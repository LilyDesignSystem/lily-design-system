# Command

A command palette provides a searchable list of actions or items. Users type into a search input to filter and select commands via keyboard or mouse. This pattern is commonly used for quick-access command palettes (e.g., Ctrl+K interfaces), searchable menus, and action launchers.

The component renders a search region containing a text input and a listbox for results. The search value is bindable, allowing consumers to implement their own filtering logic and dynamically update the listbox content.

## Implementation Notes

- Wraps content in a `<div>` with `role="search"` and `aria-label` for semantic search region
- Contains an `<input type="search">` with `autocomplete="off"` to prevent browser autocomplete interference
- Contains a `<div>` with `role="listbox"` for displaying filtered results
- Supports two-way binding on the `value` prop component
- Children slot is rendered inside the listbox for consumer-controlled list items
- Spreads `restProps` on the outer search container

## Props

- `label`: string (required) -- accessible name for both the search region and the input
- `placeholder`: string (default: `undefined`) -- placeholder text for the search input
- `value`: string (default: `""`, bindable) -- current search text, supports two-way binding via two-way `value` binding
- `children`: slot (required) -- listbox content, typically option or command items
- `...restProps`: any additional HTML attributes spread onto the outer `<div>`

## Usage

Application command palette triggered by Ctrl+K:

```html
<Command label="Command palette" placeholder="Type a command..." value={query}>
    <div role="option" tabindex="-1" onclick={() => navigate('/dashboard')}>Go to Dashboard</div>
    <div role="option" tabindex="-1" onclick={() => navigate('/settings')}>Open Settings</div>
    <div role="option" tabindex="-1" onclick={() => toggleTheme()}>Toggle Dark Mode</div>
</Command>
```

Admin panel action launcher with dynamic filtering:

```html
<Command label="Actions" placeholder="Search actions..." value={actionQuery}>
    {#each filteredActions as action}
        <div role="option" tabindex="-1" onclick={() => action.execute()}>
            {action.name} <kbd>{action.shortcut}</kbd>
        </div>
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

## When to Use

- Use Command for quick-access search interfaces such as Ctrl+K action launchers or searchable menus.
- Use Command when users need to search and execute actions from a large set without navigating through menus.
- Use Command for keyboard-driven navigation where users can jump to pages, run actions, or switch contexts.
- Use Command in developer tools, admin panels, or productivity applications where power users expect a command palette.

## When Not to Use

- Do not use Command for site search or content search -- use SearchInput instead.
- Do not use Command for form input with a dropdown list of options -- use Combobox instead.
- Do not use Command for navigation menus that should always be visible -- use NavigationMenu instead.

## Headless

This headless Command component provides a `<div>` with `role="search"` and `aria-label`, an `<input type="search">` with `autocomplete="off"`, and a `<div>` with `role="listbox"` for displaying results. The consumer provides all visual styling including modal/overlay presentation, result item layout, keyboard shortcut hints, grouping headers, and animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.command` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `command`
- Verify role="search"` -- identifies the outer container as a search landmark region
- Verify aria-label={label}` -- provides accessible name for the search region and input
- Verify role="listbox"` -- identifies the results container as a listbox for selectable options
- Verify aria-label={label}` -- provides accessible name for the listbox
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Present the command palette in a modal overlay centered on screen. Group related commands and show keyboard shortcut hints alongside each action.
- **Developers**: Implement filtering logic by reacting to the bindable `value` prop. Add arrow key navigation for the listbox items in your consumer code. Pair with a Dialog for modal presentation.

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/listbox/
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/combobox/
