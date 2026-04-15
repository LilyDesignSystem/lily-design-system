<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckListItem from './CheckListItem.svelte';

  const { Story } = defineMeta({
    title: 'Examples/CheckListItem',
    component: CheckListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>
