# SelectWithExtras

SelectWithExtras is a headless enhanced select component that wraps a native `<select>` element with optional content areas before and after it. This allows consumers to place supplementary elements such as icons, flags, status indicators, or helper text alongside the select without breaking its accessibility.

Use SelectWithExtras when you need a native select dropdown with additional visual context. For example, displaying a country flag before a country selector, showing a unit label after a measurement selector, or adding an icon before a category picker. The component preserves full native select behavior including keyboard navigation, form submission, and screen reader support.

## Implementation Notes

- Renders a wrapper `<div>` containing optional `before` snippet, a native `<select>`, and optional `after` snippet
- The `<select>` element receives `aria-label` for accessibility, with `bind:value` for two-way binding
- Supports `required` and `disabled` attributes on the native select
- Uses Svelte 5 `$bindable()` for the `value` prop, enabling `bind:value` from the parent
- The `before` and `after` snippets are conditionally rendered only when provided
- Spreads `restProps` onto the wrapper div for consumer customization

## Props

- `label`: string (required) -- accessible label for the select element, applied via `aria-label`
- `value`: string (default: `""`) -- the currently selected value; bindable via `bind:value`
- `required`: boolean (default: `false`) -- whether the select is required for form validation
- `disabled`: boolean (default: `false`) -- whether the select is disabled
- `children`: Snippet (required) -- `<option>` elements for the select
- `before`: Snippet (optional) -- content rendered before the select element
- `after`: Snippet (optional) -- content rendered after the select element
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>` element

## Usage

```svelte
<SelectWithExtras label="Country" bind:value>
  {#snippet before()}<span>Flag:</span>{/snippet}
  <option value="us">USA</option>
  <option value="uk">United Kingdom</option>
</SelectWithExtras>
```

## Keyboard Interactions

- Tab: Moves focus to the native select element
- Arrow Up / Arrow Down: Navigates between options (native select behavior)
- Space / Enter: Opens the select dropdown on some platforms (native select behavior)
- Escape: Closes the dropdown if open (native select behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the select element so screen readers announce its purpose

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- HTML `<select>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
