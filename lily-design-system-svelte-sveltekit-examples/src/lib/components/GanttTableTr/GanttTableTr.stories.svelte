<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTr from './GanttTableTr.svelte';

  const { Story } = defineMeta({
    title: 'Examples/GanttTableTr',
    component: GanttTableTr,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <td>Row data</td>
</Story>
