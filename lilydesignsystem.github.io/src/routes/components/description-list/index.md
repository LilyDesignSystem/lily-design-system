# DescriptionList

A definition list displaying information in key-value format <dl>.

## Implementation Notes

- Renders a native `<dl>` element with `DescriptionListItem` children
- Each child wraps a `<dt>` term and one or more `<dd>` descriptions
- Spreads `restProps` onto the root `<dl>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | slot (required) | — | `DescriptionListItem` children |
| `...restProps` | HTML attributes | — | Spread onto the root `<dl>` |

## Usage

```html
<DescriptionList>
  <DescriptionListItem term="Date of birth" description="14 January 1990" />
  <DescriptionListItem term="Address" description="1 Example Road, London" />
</DescriptionList>
```

## Keyboard Interactions

- No keyboard interactions — this is a passive content list

## ARIA

- Native `<dl>` semantics describe a list of associated terms and descriptions
- Screen readers announce the term/description relationship

## When to Use

- Displaying read-only details (profile information, summary metadata) where each value is paired with a label
- Glossaries, definitions, FAQs in a structured format

## When Not to Use

- Use `SummaryList` when each row also needs an inline change/edit action
- Use `DataTable` for tabular data with column headers shared across rows

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.description-list` as the root class. No default styles are included.

## Related components

- `description-list-item` — child term/description pair
- `summary-list` — change-link summary list

## References

- [MDN dl element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)

---

Lily™ and Lily Design System™ are trademarks.
