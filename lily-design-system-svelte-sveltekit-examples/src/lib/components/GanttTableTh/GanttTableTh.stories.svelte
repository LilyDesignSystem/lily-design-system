<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTh from './GanttTableTh.svelte';

  const { Story } = defineMeta({
    title: 'Examples/GanttTableTh',
    component: GanttTableTh,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
