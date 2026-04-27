# IconListItem

One item in an [`IconList`](IconList.md), with an optional leading icon slot and required text content. Inspired by the USWDS Icon list component.

## Implementation Notes

- Root element is `<li>` (provides native list-item semantics)
- The icon is supplied via the `icon` ReactNode prop (**not** `children`)
- `children` is the textual content of the item
- The icon span is decorative and uses `aria-hidden="true"`

## Props

- `icon`: ReactNode (optional) — leading icon content
- `children`: ReactNode (required) — text content of the item
- `className`: string (optional) — appended after the root `icon-list-item` class
- `...restProps`: any additional HTML attributes passed to the `<li>`

## Usage

```tsx
<IconList label="Benefits">
  <IconListItem icon={<CheckIcon />}>Saves time</IconListItem>
  <IconListItem icon={<CheckIcon />}>Accessible by default</IconListItem>
  <IconListItem>No icon, text only</IconListItem>
</IconList>
```

## ARIA

- Native `<li>` semantics
- The icon span has `aria-hidden="true"` so screen readers ignore the decorative glyph and announce only the text

## References

- [USWDS Icon list](https://designsystem.digital.gov/components/icon-list/)
