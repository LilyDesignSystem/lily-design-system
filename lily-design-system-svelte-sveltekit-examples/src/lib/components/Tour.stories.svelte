<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tour from './Tour.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Tour',
    component: Tour,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tour'}}
>
  <p>Tour content</p>
</Story>
