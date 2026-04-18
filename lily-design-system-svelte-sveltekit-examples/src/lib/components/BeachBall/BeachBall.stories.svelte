<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BeachBall from './BeachBall.svelte';

  const { Story } = defineMeta({
    title: 'Examples/BeachBall',
    component: BeachBall,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Beach Ball'}}
/>
