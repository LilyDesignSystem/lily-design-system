<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ScrollArea from './ScrollArea.svelte';

  const { Story } = defineMeta({
    title: 'Examples/ScrollArea',
    component: ScrollArea,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Scroll Area'}}
>
  <p>Scrollable content area with enough text to scroll.</p>
</Story>
