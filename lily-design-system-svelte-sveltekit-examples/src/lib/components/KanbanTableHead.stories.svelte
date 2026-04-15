<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableHead from './KanbanTableHead.svelte';

  const { Story } = defineMeta({
    title: 'Examples/KanbanTableHead',
    component: KanbanTableHead,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><th>Header</th></tr>
</Story>
