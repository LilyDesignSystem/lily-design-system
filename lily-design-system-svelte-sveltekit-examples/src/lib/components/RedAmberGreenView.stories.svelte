<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RedAmberGreenView from './RedAmberGreenView.svelte';

  const { Story } = defineMeta({
    title: 'Examples/RedAmberGreenView',
    component: RedAmberGreenView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Red Amber Green View'}}
/>
