<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableData from './DataTableData.svelte';

  const { Story } = defineMeta({
    title: 'Examples/DataTableData',
    component: DataTableData,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>
