<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SharePage from './SharePage.svelte';

  const { Story } = defineMeta({
    title: 'Examples/SharePage',
    component: SharePage,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'SharePage'}}
>
  <span>SharePage</span>
</Story>
