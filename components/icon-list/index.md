# Icon List

An icon list is a `<ul>` of items where each item begins with a leading
icon, suitable for short feature lists, benefit lists, or step-by-step
summaries.

Use it when a list of short statements would benefit from a visual marker
at the start of each line.

## Implementation Notes

- Renders a native `<ul>` element with class `icon-list`
- `label` prop is **optional** — when supplied it sets `aria-label` on the list
- Children are expected to be `icon-list-item` elements
- The `<ul>` semantics provide list count and item position to screen readers
- Pass-through attributes are forwarded to the root `<ul>`

## Composition

This component is part of the `*List` `*ListItem` composition pattern.
Pair it with `IconListItem` children to form a complete icon list.

## Props

- `label`: string (optional) -- aria-label for the list
- `children`: slot -- `icon-list-item` children
- `...restProps`: any additional HTML attributes

## Usage

Feature list with check-mark icons:

```html
<IconList label="Plan benefits">
  <IconListItem><CheckIcon /> Free shipping</IconListItem>
  <IconListItem><CheckIcon /> 24/7 support</IconListItem>
  <IconListItem><CheckIcon /> Cancel anytime</IconListItem>
</IconList>
```

## Keyboard Interactions

- Tab: focus moves to interactive descendants (links, buttons) within items
- The list itself is not interactive

## ARIA

- Implicit `list` role from `<ul>` element
- `aria-label` is provided when the `label` prop is set
- Each child contributes a list item via its `<li>` element
- Each child icon is decorative (`aria-hidden="true"`)

## When to Use

- Use to highlight a short series of features, benefits, or steps.
- Use when a leading icon adds scannability or recognition to each item.

## When Not to Use

- Do not use for navigation menus — use a `Nav` + `List` + `ListItem` composition.
- Do not use for tabular data — use `DataTable`.
- Do not use when icons would be the primary content — use a different pattern.

## Headless

Renders only the `<ul>` semantics. The list spacing, icon dimensions,
and any visual rhythm are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `icon-list` class. Typical treatments remove
default list bullets (since the icon replaces the bullet) and apply
consistent vertical spacing.

## Testing

- Verify the component renders a `<ul>` element with class `icon-list`
- Verify `aria-label` is present when `label` is supplied
- Verify `aria-label` is absent when `label` is omitted
- Verify children render inside the list
- Verify additional HTML attributes pass through to the root `<ul>`

## Advice

- **Designers**: Use a single icon per list to maintain visual rhythm. Choose icons that match the tone (check, arrow, dot).
- **Developers**: Always supply `IconListItem` children. Add `label` when the list's purpose is not clear from surrounding context.

## Related components

- `icon-list-item` — one item in an icon list with a leading icon slot

## References

- US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/
- HTML `<ul>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WCAG 1.3.1 Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships
