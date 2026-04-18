# KanbanTableCol

A Kanban table column definition, rendered as a `<col>` element. Used inside a `<colgroup>` to define column properties for each workflow stage.

## Props

- `span`: number (optional) -- number of columns this col element spans
- `...restProps`: unknown -- additional attributes spread onto the `<col>`

## Usage

```svelte
<KanbanTable label="Board">
  <colgroup>
    <KanbanTableCol span={1} />
    <KanbanTableCol span={1} />
    <KanbanTableCol span={1} />
  </colgroup>
  ...
</KanbanTable>
```

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
