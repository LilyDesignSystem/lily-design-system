<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Slider from './Slider.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Slider',
    component: Slider,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slider'}}
/>
