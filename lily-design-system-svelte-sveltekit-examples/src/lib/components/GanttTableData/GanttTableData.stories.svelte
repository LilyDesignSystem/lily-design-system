<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableData from './GanttTableData.svelte';

  const { Story } = defineMeta({
    title: 'Examples/GanttTableData',
    component: GanttTableData,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>
