# accordion list Item

An accordion list item is a single expandable section using native HTML `<details>` / `<summary>` elements, providing built-in keyboard accessibility and toggle behavior. It is designed to be used inside an AccordionList within an AccordionNav container.

The component leverages the browser's native disclosure widget to deliver accessible expand/collapse behavior without any custom JavaScript. The `open` prop is two-way bindable, allowing parent components to programmatically control and observe the expanded state.

## Help

Use AccordionListItem for each individual collapsible section within an AccordionList. Common scenarios include FAQ question/answer pairs, expandable settings groups, and collapsible content panels. For more granular control over the header and body, use AccordionSummary and AccordionDetails as children.

## Syntax

```html
<AccordionListItem summary="...">
  <!-- expandable content -->
</AccordionListItem>
```

## Usage

Simple with summary prop:

```html
<AccordionListItem summary="What is your return policy?">
  <p>You can return items within 30 days of purchase for a full refund.</p>
</AccordionListItem>
```

With explicit summary and details children:

```html
<AccordionListItem>
  <AccordionSummary>Shipping information</AccordionSummary>
  <AccordionDetails>
    <p>Free standard shipping on orders over $50. Express shipping available for $9.99.</p>
  </AccordionDetails>
</AccordionListItem>
```

With bindable open state:

```html
<AccordionListItem summary="Advanced options" open={showAdvanced}>
  <p>Configure advanced notification preferences, API access, and data export settings.</p>
</AccordionListItem>
```

## Props

| Prop           | Type            | Default    | Description                                                        |
| -------------- | --------------- | ---------- | ------------------------------------------------------------------ |
| `summary`      | `string`        | (required) | Text for the summary/header line                                   |
| `open`         | `boolean`       | `false`    | Whether the item is expanded; bindable with two-way `open` binding |
| `children`     | `slot`          | (required) | Detail content rendered when expanded                              |
| `...restProps` | HTML attributes |            | Additional attributes passed to the `<details>` element            |

## Examples

FAQ item:

```html
<AccordionList>
  <AccordionListItem summary="What is your return policy?">
    <p>You can return items within 30 days of purchase.</p>
  </AccordionListItem>
  <AccordionListItem summary="Do you offer free shipping?">
    <p>Free shipping on orders over $50.</p>
  </AccordionListItem>
</AccordionList>
```

## Keyboard Interactions

- Tab: Focus the summary element
- Enter / Space: Toggle open/close (browser default for `<details>`)

## ARIA

- Native `<details>` / `<summary>` provide implicit disclosure widget semantics
- Browser automatically manages expanded/collapsed state announcement

## When to Use

- Use inside AccordionList to represent one collapsible section with a heading and expandable content.
- Use when you need native disclosure behavior for individual sections without custom JavaScript.
- Use for FAQ question/answer pairs, expandable settings groups, or categorised navigation sections.

## When Not to Use

- Do not use outside AccordionList -- it is designed to work within the AccordionNav composition pattern.
- Do not use for non-collapsible list items -- use ContentsListItem or BreadcrumbListItem instead.
- Do not use for top-level page sections that should always be visible -- use headings or Panel instead.

## Headless

This component provides native `<details>` / `<summary>` disclosure semantics, two-way bindable open state, and keyboard toggle behavior with zero visual styling. The consumer is responsible for all CSS including summary appearance, expanded/collapsed indicators, content padding, borders, and transition animations.

## Styles

The consumer provides all CSS styling. The component renders with a `.accordion-list-item` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<li>` element with class `accordion-list-item`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide a clear expand/collapse indicator (chevron, plus/minus icon) next to the summary text so users understand the section is interactive.
- **Developers**: Use the two-way bindable `open` prop to synchronize state when you need programmatic control, such as "expand all" or "collapse all" functionality.

## Composition

AccordionListItem follows the Nav / List / ListItem composition pattern:

- **AccordionNav** -- outer `<nav>` container providing the landmark region.
- **AccordionList** -- `<ol>` list grouping the collapsible items.
- **AccordionListItem** -- individual `<details>` / `<summary>` sections for each expandable item.

```html
<AccordionNav label="FAQ">
  <AccordionList>
    <AccordionListItem summary="Question 1">Answer 1</AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## References

- HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/accordion/
