<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTd from './GanttTableTd.svelte';

  const { Story } = defineMeta({
    title: 'Examples/GanttTableTd',
    component: GanttTableTd,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>
