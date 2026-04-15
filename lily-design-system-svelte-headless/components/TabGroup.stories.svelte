<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TabGroup from './TabGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TabGroup',
    component: TabGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tab Group'}}
>
  <span>Group content</span>
</Story>
