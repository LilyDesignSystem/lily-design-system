# TableBody

The body section of a Table, rendered as a <tbody> element. Contains TableRow elements with data cells.

## Props

- `className`: string (optional) -- CSS class name appended to `table-body`
- `children`: ReactNode (required) -- TableRow elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```tsx
<TableBody>
  <TableRow><TableTD>Alice</TableTD><TableTD>alice@example.com</TableTD></TableRow>
</TableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
