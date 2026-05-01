# TableHead

The header section of a Table, rendered as a `<thead>` element. Contains TableRow elements with column header cells.

## Props

- `className`: string (optional) -- CSS class name appended to `table-head`
- `children`: ReactNode (required) -- TableRow elements with header cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>`

## Usage

```tsx
<TableHead>
  <TableRow><TableTH>Name</TableTH><TableTH>Email</TableTH></TableRow>
</TableHead>
```

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
