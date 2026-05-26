# MutuallyExclusive

A container that enforces a "zero or one" selection rule across a group of checkboxes — when the user checks one option, the previously checked option is unchecked, but unlike a radio group the user is also free to uncheck the current selection and leave the group with nothing selected.

This sits in the gap between `RadioGroup` (always exactly one) and `CheckboxGroup` (any number, including all). It is the right choice for optional preferences ("which one of these would you prefer, if any?") rather than required choices. The component renders `role="group"` with an accessible label so screen readers announce the constraint, and each child checkbox keeps its own native semantics.

## Implementation Notes

- Wraps a group of selectable controls (typically checkboxes) and enforces that only one can be checked at a time
- When the user checks one option, the previously-checked option is unchecked
- Behaves like a radio group but allows the user to *uncheck* the current selection (to leave the group with no selection)
- Renders `role="group"` with an `aria-label` so the constraint is communicated to assistive technology
- Children are passed via the `children` slot; the consumer composes the individual `CheckboxInput` controls

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible label for the group |
| `value` | string | null | null | Currently selected option's value, or null when none is selected; bindable |
| `onChange` | (value: string | null) => void | — | Fired when the selected value changes |
| `children` | slot (required) | — | The CheckboxInput controls that make up the group |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<MutuallyExclusive label="Preferred contact method" value={contact} onChange={setContact}>
  <CheckboxInput value="email" label="Email" />
  <CheckboxInput value="sms" label="SMS" />
  <CheckboxInput value="post" label="Post" />
</MutuallyExclusive>
```

## Keyboard Interactions

- Tab moves focus through the child controls
- Space toggles the focused checkbox (native behaviour); the component handler then unchecks any other previously-checked option

## ARIA

- `role="group"` + `aria-label` identifies the group
- Each child checkbox retains its own native semantics
- Consumers may also use `aria-describedby` to reference an explanation of the constraint

## When to Use

- When a question allows zero or one answer (radio group requires at least one) and you want a familiar checkbox affordance
- Surveys or settings where "none of these" is a valid state

## When Not to Use

- Use `RadioGroup` when at least one option must always be selected
- Use `CheckboxGroup` when multiple selections are allowed
- Use `SegmentGroup` for short, side-by-side mutually exclusive options

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.mutually-exclusive` as the root class. No default styles are included.

## Related components

- `radio-group` — mandatory mutually exclusive selection
- `checkbox-group` — multiple selections allowed
- `segment-group` — segmented control for short option lists

## References

- [WAI-ARIA group role](https://www.w3.org/TR/wai-aria-1.2/#group)
