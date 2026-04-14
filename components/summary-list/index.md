# Summary List

A summary list is a component that presents a concise overview of key information as key-value pairs, typically in a structured, easy-to-scan format. It is often used to summarize important details such as transaction history, order details, product features, account settings, or form review data in a description list layout.

This component renders as a semantic `<dl>` (description list) element with an accessible label. Each item in the summary list consists of a `<dt>` (term) and `<dd>` (description) pair, helping users quickly grasp essential information. A well-designed summary list focuses on clarity, using clear labels, concise text, and consistent formatting to enhance readability.

## Implementation Notes

- Renders as `<dl aria-label={label}>` (description list) with a `children` slot
- Children typically contain `<dt>` (term) and `<dd>` (description) element pairs
- Semantic `<dl>` element provides description list semantics for key-value pairs
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<dl>` element for consumer extensibility
- No hardcoded user-facing strings; all text comes through props and children

## Props

- `label`: string (required) -- accessible label for the description list via `aria-label`
- `children`: slot (required) -- list content, typically `<dt>`/`<dd>` pairs
- `...restProps`: any additional HTML attributes spread onto the `<dl>` element

## Usage

```html
<SummaryList label="Personal details">
  <SummaryListItem term="Name">Karen Francis</SummaryListItem>
  <SummaryListItem term="Date of birth">15 March 1984</SummaryListItem>
  <SummaryListItem term="Contact information">
    73 Roman Road<br />Leeds<br />LS2 5ZN
  </SummaryListItem>
  <SummaryListItem term="Email">karen.francis@example.com</SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

None -- this is a passive informational display, not an interactive element.

## ARIA

- `aria-label={label}` -- provides the accessible name for the description list, allowing screen readers to announce the context of the key-value pairs

## When to Use

- Use to display pairs of related information as key-value entries, such as a patient's name, date of birth, and contact details
- Use to summarise a user's answers at the end of a form in a "check your answers" pattern
- Use with action links (like "Change") that include visually hidden text for screen reader context
- Use when information is best presented as labeled terms with corresponding descriptions in a `<dl>` element

## When Not to Use

- Do not use for tabular data with multiple columns -- use Table or DataTable instead
- Do not use for simple lists without key-value pairs -- use a standard `<ul>` or `<ol>`
- Do not use for task tracking -- use TaskList instead

## Headless

This headless component renders a semantic `<dl>` element with `aria-label` for accessible naming. It provides description list semantics for key-value pairs. The consumer provides all visual styling including layout, spacing, typography, and row separation.


## Styles

The consumer provides all CSS styling. The component renders with a `.summary-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `summary-list`
- Verify aria-label={label}` -- provides the accessible name for the description list, allowing screen readers to announce the context of the key-value pairs
- Verify pass-through attributes are applied

## Advice

- **Designers**: Align terms and descriptions consistently, using either a side-by-side or stacked layout. Use subtle row separators or alternating backgrounds to improve scannability.
- **Developers**: Use SummaryListItem child components for structured `<dt>`/`<dd>` pairs, or provide raw `<dt>`/`<dd>` elements directly. Ensure the `label` prop accurately describes the summary context.

## Composition

SummaryList uses the List/ListItem composition pattern. Place SummaryListItem components as children inside SummaryList. Each SummaryListItem renders a `<dt>`/`<dd>` pair within a `<div>` wrapper, while SummaryList provides the outer `<dl>` container with accessible labeling.

## References

- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- WAI-ARIA landmark regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
