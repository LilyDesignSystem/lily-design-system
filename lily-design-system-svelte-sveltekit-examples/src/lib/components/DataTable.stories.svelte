<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTable from './DataTable.svelte';

  const { Story } = defineMeta({
    title: 'Examples/DataTable',
    component: DataTable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Data Table'}}
>
  <span>Cell data</span>
</Story>
