<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Progress from './Progress.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Progress',
    component: Progress,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Progress'}}
/>
