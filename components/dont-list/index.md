# Don't List

A don't list presents discouraged actions or practices to avoid as a list of items. It is used in design system documentation, guidelines, and instructional content to clearly communicate what users or developers should not do. The list is paired with the DoList component to create do/don't guidance patterns.

This component renders a semantically labeled unordered list with `role="list"` to ensure assistive technology announces it as a list even when CSS may remove default list semantics. The default label is "Don't", making it immediately usable without configuration.

## Implementation Notes

- Renders a `<ul>` element with explicit `role="list"` to preserve list semantics
- Uses `aria-label` to provide an accessible name (defaults to "Don't")
- Children slot is rendered inside the list; each child should be an `<li>` element
- Label prop has a sensible default but can be overridden for internationalization
- Spreads `restProps` on the `<ul>` element

## Props

- `label`: string (default: `"Don't"`) -- accessible name for the list
- `children`: slot (required) -- list items, each should be an `<li>` element
- `...restProps`: any additional HTML attributes spread onto the `<ul>` element

## Usage

```html
<DontList heading="Don't">
  <DontListItem>do not burst a blister yourself</DontListItem>
  <DontListItem>do not peel the skin off a burst blister</DontListItem>
  <DontListItem>do not pick at the edges of the remaining skin</DontListItem>
</DontList>
```

```html
<DontList heading="Don't">
  <DontListItem>do not take aspirin for children under 16</DontListItem>
  <DontListItem>do not give more than the recommended dose</DontListItem>
</DontList>
```

```html
<DontList label="Avoid">
  <DontListItem>Hard-code user-facing strings</DontListItem>
  <DontListItem>Rely on placeholder text as labels</DontListItem>
  <DontListItem>Remove focus indicators</DontListItem>
</DontList>
```

## Keyboard Interactions

None -- this component is a passive container for list items.

## ARIA

- `role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- `aria-label={label}` -- provides an accessible name for the list (defaults to "Don't")

## When to Use

- Use to give users a clear list of discouraged actions or things to avoid.
- Use alongside DoList to present contrasting do and don't guidance on the same topic.
- Use when there are 2 or more actions to discourage -- the list format reinforces the warning.
- Use with text starting with "do not" to make each prohibition clear.
- Use after any corresponding DoList -- dos come before don'ts.

## When Not to Use

- Do not use with only 1 item -- use WarningCallout for a single important warning or InsetText for general guidance.
- Do not use for critical safety warnings that could impact health -- use WarningCallout or CareCard instead.
- Do not use inside other interactive patterns like CareCard -- keep don't lists in their own section.
- Do not use for general-purpose lists -- use a standard `<ul>` or CheckList instead.

## Headless

This headless component provides a `<ul>` with explicit `role="list"` to preserve list semantics even when CSS removes default markers, and `aria-label` for accessible naming. The consumer provides all visual styling, icons, and layout for the list and its items.


## Styles

The consumer provides all CSS styling. The component renders with a `.dont-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `dont-list`
- Verify role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- Verify aria-label={label}` -- provides an accessible name for the list (defaults to "Don't")
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a distinct visual treatment (such as a red cross or warning color) to differentiate dont-list items from do-list items. Keep items concise and specific.
- **Developers**: Place DontListItem components as children. Override the `label` prop for internationalization when the default "Don't" label is not appropriate.

## Composition

DontList composes with DontListItem using the List/ListItem pattern. DontList renders the `<ul>` container, and each DontListItem renders an `<li>` within it. Pair with DoList and DoListItem for complete do/don't guidance.

## References

- MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/
