# IconList

An ordered list of `IconListItem` components. Renders `<ul class="icon-list">`.

## Implementation Notes

- Headless: no CSS, no styles
- `label` is optional and sets `aria-label` when provided
- Children are typically `IconListItem` components

## Props

- `label`: string (optional) — aria-label for the list
- default slot — `IconListItem` children
- `...$attrs` — additional HTML attributes

## Usage

```vue
<IconList label="Highlights">
    <IconListItem>
        <template #icon>★</template>
        Featured
    </IconListItem>
</IconList>
```

## ARIA

- Native `<ul>` list semantics
- `aria-label` (optional)

## Headless

The consumer styles list spacing, dividers, and icon alignment.

## Testing

- Verify root `icon-list` class
- Verify aria-label when provided
- Verify slot children render

## References

- [USWDS Icon list](https://designsystem.digital.gov/components/icon-list/)
