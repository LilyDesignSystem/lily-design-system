# IconListItem

One item in an `IconList` with a leading icon slot. The icon is decorative (`aria-hidden="true"`); the default slot carries the accessible text.

## Implementation Notes

- Headless: no CSS, no styles
- The `icon` named slot is rendered only when content is supplied
- Icon span carries `aria-hidden="true"`

## Slots

- default slot — text content (accessible)
- `icon` slot — decorative leading icon

## Usage

```vue
<IconListItem>
    <template #icon>★</template>
    Featured article
</IconListItem>
```

## ARIA

- The icon span has `aria-hidden="true"`
- The text span carries the accessible content

## Headless

The consumer styles icon size, alignment, and spacing.

## Testing

- Verify root `icon-list-item` class
- Verify the icon span carries `aria-hidden="true"` when icon is provided
- Verify default slot text renders inside the text span
- Verify the icon span is omitted when no icon slot is supplied

## References

- [USWDS Icon list](https://designsystem.digital.gov/components/icon-list/)
