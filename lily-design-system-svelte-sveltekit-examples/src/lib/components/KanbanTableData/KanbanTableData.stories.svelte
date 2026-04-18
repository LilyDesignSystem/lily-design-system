<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableData from './KanbanTableData.svelte';

  const { Story } = defineMeta({
    title: 'Examples/KanbanTableData',
    component: KanbanTableData,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Kanban Table Data'}}
>
  <span>Cell data</span>
</Story>
