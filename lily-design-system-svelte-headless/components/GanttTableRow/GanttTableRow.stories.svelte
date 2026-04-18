<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableRow from './GanttTableRow.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableRow',
    component: GanttTableRow,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <td>Row data</td>
</Story>
