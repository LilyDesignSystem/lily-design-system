# CalendarTableCol

A column definition used inside a `<colgroup>` within a `CalendarTable`. **Source discrepancy:** although `AGENTS.md` describes the `-col` suffix as `<th>`, `CalendarTableCol` actually renders a `<col>` element. This component is therefore a column-sizing / styling hook, not a header cell.

## What it is

A headless Svelte 5 structural element rendering `<col>`. Category: calendar grid column-definition primitive.

## What it does

- Renders `<col class="calendar-table-col {className}" span={span || undefined}>`.
- Emits the `span` attribute only when a truthy value is provided.
- Spreads additional HTML attributes onto the `<col>`.

## When to use it

- Inside a `<colgroup>` within a `CalendarTable` to style or size one or more columns (e.g. weekends).
- When CSS needs a `col` hook to target a column.

## When not to use it

- As a header cell — use a plain `<th>` inside a `CalendarTableRow` in `CalendarTableHead`. Despite the name, this component is not a header.
- For data cells — use `CalendarTableData`.
- For non-calendar tables — use `DataTableCol`, `GanttTableCol`, `KanbanTableCol`, or `TableCol` (those also render `<col>` via the same suffix pattern).

## How to use it

Import `CalendarTableCol` from `./CalendarTableCol.svelte`. Place inside a `<colgroup>` at the top of a `CalendarTable`, optionally with `span`.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-col`.
- `span` — number, optional. Number of columns this `<col>` covers.
- `...restProps` — additional HTML attributes spread onto the `<col>`.

## Usage

### Weekend vs weekday columns

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableCol from './CalendarTableCol.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';
</script>

<CalendarTable label="January 2025">
  <colgroup>
    <CalendarTableCol class="weekend" />
    <CalendarTableCol span={5} />
    <CalendarTableCol class="weekend" />
  </colgroup>
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5, 6, 7] as d}
        <CalendarTableData>{d}</CalendarTableData>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### Single column span

```svelte
<colgroup>
  <CalendarTableCol span={7} />
</colgroup>
```

### With data hooks

```svelte
<colgroup>
  <CalendarTableCol data-day="sunday" />
  <CalendarTableCol data-day="monday" />
</colgroup>
```

### In a full composition

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableCol from './CalendarTableCol.svelte';
  import CalendarTableHead from '../CalendarTableHead/CalendarTableHead.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';
</script>

<CalendarTable label="Week schedule">
  <colgroup>
    <CalendarTableCol />
    <CalendarTableCol span={5} />
    <CalendarTableCol />
  </colgroup>
  <CalendarTableHead>
    <CalendarTableRow>
      <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
    </CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5, 6, 7] as d}
        <CalendarTableData>{d}</CalendarTableData>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### Without span

```svelte
<colgroup>
  <CalendarTableCol />
  <CalendarTableCol />
</colgroup>
```

## Accessibility

- `<col>` provides structural column semantics; not interactive.
- Screen readers do not read `<col>` content. Any accessible labels should be on `<th>` header cells inside `CalendarTableHead`.

## Related components

- `CalendarTable`, `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot`, `CalendarTableRow`, `CalendarTableData`.
- `DataTableCol`, `GanttTableCol`, `KanbanTableCol`, `TableCol` — sibling `<col>` equivalents in other tables.
