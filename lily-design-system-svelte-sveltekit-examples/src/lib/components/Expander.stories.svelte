<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Expander from './Expander.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Expander',
    component: Expander,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Expander'}}
>
  <p>Expandable content</p>
</Story>
