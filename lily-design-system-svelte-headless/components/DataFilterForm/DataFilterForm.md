# DataFilterForm

A data filter component allows users to narrow down a dataset by applying criteria. It wraps filter controls in a semantic `<form>` element with `role="search"` and accessible labelling via `aria-label`. Consumers provide their own filter inputs, submit buttons, and reset buttons as children.

The component prevents default form submission behavior, allowing the consumer's `onsubmit` callback to handle filter application programmatically. This makes it suitable for client-side filtering, AJAX-based search, or any scenario where a full page reload is undesirable.

## Implementation Notes

- Renders a `<form>` element with `role="search"` for assistive technology
- Calls `event.preventDefault()` on submit to allow consumer-controlled filter logic
- Passes `onreset` directly to the form for native reset behavior
- Spreads `restProps` onto the `<form>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the filter region, applied as `aria-label`
- `onsubmit`: (event: SubmitEvent) => void (default: undefined) -- callback when the filter form is submitted
- `onreset`: (event: Event) => void (default: undefined) -- callback when the filter form is reset
- `children`: Snippet (required) -- filter controls rendered inside the form

## Usage

```svelte
<DataFilterForm label="Filter results" onsubmit={applyFilters}>
  <label>Category <select>...</select></label>
  <button type="submit">Apply</button>
</DataFilterForm>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard behavior is determined by the consumer-provided form controls within the children.

## ARIA

- `role="search"` -- identifies the form as a search landmark for assistive technology
- `aria-label={label}` -- provides an accessible name for the search region

## References

- WAI-ARIA Landmark Roles: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role
