<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableBody from './DataTableBody.svelte';

  const { Story } = defineMeta({
    title: 'Examples/DataTableBody',
    component: DataTableBody,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>
