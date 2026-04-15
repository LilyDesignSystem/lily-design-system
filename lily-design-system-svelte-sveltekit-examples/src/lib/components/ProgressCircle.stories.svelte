<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProgressCircle from './ProgressCircle.svelte';

  const { Story } = defineMeta({
    title: 'Examples/ProgressCircle',
    component: ProgressCircle,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Progress Circle'}}
>
  <span>Loading...</span>
</Story>
