# TableFoot

The footer section of a Table, rendered as a <tfoot> element. Contains TableRow elements with summary or footer cells.

## Props

- `className`: string (optional) -- CSS class name appended to `table-foot`
- `children`: ReactNode (required) -- TableRow elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```tsx
<TableFoot>
  <TableRow><TableTD colSpan={2}>Total: 2 users</TableTD></TableRow>
</TableFoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
