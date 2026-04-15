<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableCol from './GanttTableCol.svelte';

  const { Story } = defineMeta({
    title: 'Examples/GanttTableCol',
    component: GanttTableCol,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
