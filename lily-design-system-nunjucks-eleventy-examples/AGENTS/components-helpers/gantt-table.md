# GanttTable

Pattern (gantt-table uses HTML element names directly for sub-components):

```tsx
<GanttTable>
    <GanttTableThead>
        <GanttTableTr>
            <GanttTableTH>…</GanttTableTH>
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <GanttTableTD>…</GanttTableTD>
        </GanttTableTr>
    </GanttTableTbody>
    <GanttTableTfoot>
        <GanttTableTr>
            <GanttTableTH>…</GanttTableTH>
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

Suffix slugs (kebab):

- gantt-table-thead ↔ `<thead>`
- gantt-table-tbody ↔ `<tbody>`
- gantt-table-tfoot ↔ `<tfoot>`
- gantt-table-tr ↔ `<tr>`
- gantt-table-th ↔ `<th>`
- gantt-table-td ↔ `<td>`
