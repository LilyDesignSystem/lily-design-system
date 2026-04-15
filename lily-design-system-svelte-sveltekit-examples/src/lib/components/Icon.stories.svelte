<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Icon from './Icon.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Icon',
    component: Icon,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Icon'}}
>
  <span>★</span>
</Story>
