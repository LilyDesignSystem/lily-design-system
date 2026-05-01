# TableRow

A single row in a Table, rendered as a <tr> element. Contains TableTH or TableTD cells.

## Props

- `className`: string (optional) -- CSS class name appended to `table-row`
- `children`: ReactNode (required) -- TableTH or TableTD cells
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```tsx
<TableRow><TableTD>Alice</TableTD><TableTD>alice@example.com</TableTD></TableRow>
```

## References

- HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
