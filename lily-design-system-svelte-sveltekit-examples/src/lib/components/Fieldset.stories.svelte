<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Fieldset from './Fieldset.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Fieldset',
    component: Fieldset,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <legend>Legend</legend><p>Fields</p>
</Story>
