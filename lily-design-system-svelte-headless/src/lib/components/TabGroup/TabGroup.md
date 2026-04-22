# TabBar

TabBar is a headless tab list container that provides the ARIA `tablist` role and built-in keyboard navigation for tab interfaces. It manages arrow key navigation between tab elements, allowing users to cycle through tabs with Left/Right arrow keys, and jump to the first or last tab with Home/End keys.

Use TabBar when building a tabbed interface where users switch between different views or content panels. The component wraps tab buttons in a `<div>` with `role="tablist"` and handles keyboard interactions automatically. Consumer provides tab buttons as children (each with `role="tab"` and `aria-selected`) and is responsible for managing selection state and associating tab panels.

## Implementation Notes

- Renders a `<div>` element with `role="tablist"` for ARIA semantics
- Uses `bind:this` to capture a reference to the tablist element for DOM queries
- Queries all child elements with `[role='tab']` to build the list of navigable tabs
- Implements keyboard navigation via an `onkeydown` handler:
  - ArrowRight moves focus to the next tab (wraps to first)
  - ArrowLeft moves focus to the previous tab (wraps to last)
  - Home moves focus to the first tab
  - End moves focus to the last tab
- Uses Svelte 5 `$state()` for the internal DOM reference (`tablistRef`)
- Consumer is responsible for managing `aria-selected` state on tab buttons and displaying corresponding tab panels
- Spreads `restProps` onto the div for consumer customization

## Props

- `label`: string (required) -- accessible label for the tab list, applied via `aria-label`
- `children`: Snippet (required) -- tab button elements to render inside the tablist
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<TabBar label="Settings">
  <button role="tab" aria-selected="true">General</button>
  <button role="tab" aria-selected="false">Advanced</button>
</TabBar>
```

## Keyboard Interactions

- Arrow Right: Moves focus to the next tab; wraps from the last tab to the first
- Arrow Left: Moves focus to the previous tab; wraps from the first tab to the last
- Home: Moves focus to the first tab
- End: Moves focus to the last tab
- Tab: Moves focus into and out of the tab list (only one tab in the list is in the tab order at a time)

## ARIA

- `role="tablist"` -- identifies the container as a list of tabs
- `aria-label={label}` -- provides an accessible name for the tab list so screen readers announce its purpose
- Child tabs should have `role="tab"` and `aria-selected` attributes (managed by consumer)
- Associated tab panels should have `role="tabpanel"` with `aria-labelledby` pointing to the corresponding tab (managed by consumer)

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA Authoring Practices - Tabs Example: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
