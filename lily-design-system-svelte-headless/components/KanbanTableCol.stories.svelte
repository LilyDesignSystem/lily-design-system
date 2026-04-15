<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableCol from './KanbanTableCol.svelte';

  const { Story } = defineMeta({
    title: 'Headless/KanbanTableCol',
    component: KanbanTableCol,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
