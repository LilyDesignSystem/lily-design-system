<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Resizable from './Resizable.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Resizable',
    component: Resizable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Resizable'}}
>
  <div>Resizable content</div>
</Story>
