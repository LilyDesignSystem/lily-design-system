<script lang="ts">
  import GanttChart from '@lilydesignsystem/svelte-gantt-chart';
  import type { GanttTask } from '@lilydesignsystem/svelte-gantt-chart';
  import { intlLabelsFor, type LabelPack } from '@lilydesignsystem/svelte-locale-translations';
  import { addDays, type DemoStrings } from './strings.js';

  let { s, pack, locale, today }: { s: DemoStrings; pack: LabelPack; locale: string; today: string } = $props();

  const tasks = $derived<GanttTask[]>([
    { id: 'g1', label: s.tasks[0], start: addDays(today, -10), end: addDays(today, -6) },
    { id: 'g2', label: s.tasks[1], start: addDays(today, -6), end: addDays(today, 0), dependsOn: ['g1'] },
    { id: 'g3', label: s.tasks[2], start: addDays(today, 0), end: addDays(today, 9), dependsOn: ['g2'] },
    { id: 'g4', label: s.tasks[3], start: addDays(today, 6), end: addDays(today, 12), dependsOn: ['g3'] },
    { id: 'g5', label: s.tasks[4], start: addDays(today, 4), end: addDays(today, 13), dependsOn: ['g2'] },
    { id: 'g6', label: s.tasks[5], start: addDays(today, 14), end: addDays(today, 14), dependsOn: ['g4', 'g5'] }
  ]);
  const labels = $derived(intlLabelsFor('gantt-chart', pack, locale) as never);
</script>

<GanttChart
  label={s.gantt.label}
  range={{ start: addDays(today, -10), end: addDays(today, 16) }}
  {tasks}
  {today}
  {labels}
/>
