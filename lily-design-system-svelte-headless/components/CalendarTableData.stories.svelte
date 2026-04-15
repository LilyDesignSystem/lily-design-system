<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableData from './CalendarTableData.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTableData',
    component: CalendarTableData,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>
