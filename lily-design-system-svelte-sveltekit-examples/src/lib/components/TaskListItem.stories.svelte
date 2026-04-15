<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TaskListItem from './TaskListItem.svelte';

  const { Story } = defineMeta({
    title: 'Examples/TaskListItem',
    component: TaskListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Task List Item'}}
/>
