<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableCol from './DataTableCol.svelte';

  const { Story } = defineMeta({
    title: 'Examples/DataTableCol',
    component: DataTableCol,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
