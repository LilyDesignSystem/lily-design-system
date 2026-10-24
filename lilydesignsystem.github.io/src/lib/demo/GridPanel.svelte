<script lang="ts">
  import DataGrid from '@lilydesignsystem/svelte-data-grid';
  import type { DataGridColumn, DataGridLabels } from '@lilydesignsystem/svelte-data-grid';
  import { labelsFor, type LabelPack } from '@lilydesignsystem/svelte-locale-translations';
  import { addDays, type DemoStrings } from './strings.js';

  let { s, pack, locale, today }: { s: DemoStrings; pack: LabelPack; locale: string; today: string } = $props();

  const date = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }));
  const columns = $derived<DataGridColumn[]>([
    { id: 'task', header: s.grid.task, sortable: true, resizable: true, filterable: true },
    { id: 'owner', header: s.grid.owner, sortable: true, filterable: true },
    { id: 'status', header: s.grid.status, sortable: true, filterable: true },
    { id: 'due', header: s.grid.due, sortable: true, format: (v) => date.format(new Date(`${v}T00:00:00Z`)) },
    { id: 'hours', header: s.grid.hours, sortable: true, format: (v) => new Intl.NumberFormat(locale).format(Number(v)) }
  ]);
  const statusOrder = ['done', 'done', 'doing', 'doing', 'todo', 'todo'] as const;
  const rows = $derived(
    s.tasks.map((task, i) => ({
      id: `t${i + 1}`,
      task,
      owner: s.owners[i % s.owners.length],
      status: s.statuses[statusOrder[i]],
      due: addDays(today, (i - 2) * 6),
      hours: [8, 12, 24, 10, 6, 4][i]
    }))
  );
  const labels = $derived(labelsFor('data-grid', pack) as DataGridLabels);
  let selected = $state<string[]>([]);
</script>

<DataGrid
  label={s.grid.label}
  caption={s.grid.label}
  {columns}
  {rows}
  {locale}
  rowId={(row) => String(row.id)}
  selectionMode="multiple"
  bind:selected
  pageSize={4}
  movableColumns
  {labels}
/>
