# Select With Extras

SelectWithExtras is a headless enhanced select component that wraps a native `<select>` element with optional content areas before and after it. This allows consumers to place supplementary elements such as icons, flags, status indicators, or helper text alongside the select without breaking its accessibility.

Use SelectWithExtras when you need a native select dropdown with additional visual context. For example, displaying a country flag before a country selector, showing a unit label after a measurement selector, or adding an icon before a category picker. The component preserves full native select behavior including keyboard navigation, form submission, and screen reader support.

## Implementation Notes

- Renders a wrapper `<div>` containing optional `before` slot, a native `<select>`, and optional `after` slot
- The `<select>` element receives `aria-label` for accessibility, with two-way binding
- Supports `required` and `disabled` attributes on the native select
- Supports two-way binding for the `value` prop, enabling two-way `value` binding from the parent
- The `before` and `after` slots are conditionally rendered only when provided
- Spreads `restProps` onto the wrapper div for consumer customization

## Props

- `label`: string (required) -- accessible label for the select element, applied via `aria-label`
- `value`: string (default: `""`) -- the currently selected value; two-way bindable via `value`
- `required`: boolean (default: `false`) -- whether the select is required for form validation
- `disabled`: boolean (default: `false`) -- whether the select is disabled
- `children`: slot (required) -- `<option>` elements for the select
- `before`: slot (optional) -- content rendered before the select element
- `after`: slot (optional) -- content rendered after the select element
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>` element

## Usage

Country selector with a flag icon before the select:

```html
<SelectWithExtras label="Country" value={country}>
  {#snippet before()}<span class="flag-icon">🏳</span>{/snippet}
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="fr">France</option>
</SelectWithExtras>
```

Currency selector with symbol after the select:

```html
<SelectWithExtras label="Currency" value={currency}>
  <option value="GBP">British Pound</option>
  <option value="USD">US Dollar</option>
  <option value="EUR">Euro</option>
  {#snippet after()}<span class="currency-symbol">£</span>{/snippet}
</SelectWithExtras>
```

Unit selector with a label before:

```html
<SelectWithExtras label="Measurement unit" value={unit}>
  {#snippet before()}<span>Unit:</span>{/snippet}
  <option value="kg">Kilograms</option>
  <option value="lb">Pounds</option>
</SelectWithExtras>
```

## Keyboard Interactions

- Tab: Moves focus to the native select element
- Arrow Up / Arrow Down: Navigates between options (native select behavior)
- Space / Enter: Opens the select dropdown on some platforms (native select behavior)
- Escape: Closes the dropdown if open (native select behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the select element so screen readers announce its purpose

## When to Use

- Use SelectWithExtras when a native select dropdown needs supplementary visual context such as icons, flags, or unit labels alongside the options.
- Use SelectWithExtras to preserve full native select behavior (keyboard navigation, form submission, screen reader support) while adding decorative elements.
- Use SelectWithExtras for country selectors with flag icons, currency selectors with symbols, or unit selectors with labels.
- Use SelectWithExtras when the before/after content is purely decorative or informational.

## When Not to Use

- Do not use SelectWithExtras when a native Select without extra visual context is sufficient.
- Do not use SelectWithExtras for free-text search or filterable dropdowns -- use Combobox instead.
- Do not use SelectWithExtras when the before/after content is interactive -- interactive elements in these slots can confuse keyboard navigation.

## Headless

This headless component provides the semantic structure of a native `<select>` element wrapped in a container with optional before/after slots, along with proper `aria-label` for accessibility. The consumer provides all visual styling for the wrapper, the select element, and any supplementary content placed in the before/after slots.


## Styles

The consumer provides all CSS styling. The component renders with a `.select-with-extras` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `select-with-extras`
- Verify aria-label={label}` -- provides an accessible name for the select element so screen readers announce its purpose
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep before/after content compact so it does not visually overwhelm the select control. Use consistent icon sizes and spacing across all SelectWithExtras instances.
- **Developers**: Ensure the `before` and `after` slot content is decorative or supplementary only; interactive elements in these slots can confuse keyboard navigation. Use the `aria-label` prop rather than relying on before/after content for accessible naming.

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- HTML `<select>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
