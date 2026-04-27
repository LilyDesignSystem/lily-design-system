# IconList

A list of icon list item components. Renders a `<ul>` so the items are exposed with native list semantics. Each child should typically be an [`IconListItem`](IconListItem.md). Inspired by the USWDS Icon list component.

## Implementation Notes

- Root element is `<ul>` (provides native list semantics)
- `label` is optional; when provided it is rendered as `aria-label`

## Props

- `label`: string (optional) — `aria-label` for the list
- `children`: ReactNode (required) — `IconListItem` children
- `className`: string (optional) — appended after the root `icon-list` class
- `...restProps`: any additional HTML attributes passed to the `<ul>`

## Usage

```tsx
<IconList label="Benefits">
  <IconListItem icon={<CheckIcon />}>Easy to use</IconListItem>
  <IconListItem icon={<CheckIcon />}>Accessible by default</IconListItem>
</IconList>
```

## ARIA

- The native `<ul>` provides list semantics
- `aria-label` provides an optional accessible name

## References

- [USWDS Icon list](https://designsystem.digital.gov/components/icon-list/)
