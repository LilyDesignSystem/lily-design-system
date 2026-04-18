<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableFoot from './GanttTableFoot.svelte';

  const { Story } = defineMeta({
    title: 'Examples/GanttTableFoot',
    component: GanttTableFoot,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Footer</td></tr>
</Story>
