<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BackToTop from './BackToTop.svelte';

  const { Story } = defineMeta({
    title: 'Examples/BackToTop',
    component: BackToTop,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'BackToTop'}}
>
  <span>BackToTop</span>
</Story>
