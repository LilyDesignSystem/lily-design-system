<script lang="ts">
  import KanbanBoard from '@lilydesignsystem/svelte-kanban-board';
  import type { KanbanCard, KanbanColumn } from '@lilydesignsystem/svelte-kanban-board';
  import { labelsFor, type LabelPack } from '@lilydesignsystem/svelte-locale-translations';
  import type { DemoStrings } from './strings.js';

  let { s, pack }: { s: DemoStrings; pack: LabelPack } = $props();

  const columns = $derived<KanbanColumn[]>([
    { id: 'todo', title: s.statuses.todo },
    { id: 'doing', title: s.statuses.doing, wipLimit: 3 },
    { id: 'done', title: s.statuses.done }
  ]);
  // The cards keep their column in state; their titles follow the language.
  let placement = $state<Record<string, string>>({ c1: 'done', c2: 'done', c3: 'doing', c4: 'doing', c5: 'todo', c6: 'todo' });
  const cards = $derived<KanbanCard[]>(s.tasks.map((title, i) => ({ id: `c${i + 1}`, columnId: placement[`c${i + 1}`], title })));
  const labels = $derived(labelsFor('kanban-board', pack) as never);

  function onMove(cardId: string, toColumnId: string) {
    placement = { ...placement, [cardId]: toColumnId };
  }
</script>

<KanbanBoard label={s.kanban.label} {columns} {cards} {onMove} {labels} />
