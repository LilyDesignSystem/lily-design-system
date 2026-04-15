<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Emoji from './Emoji.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Emoji',
    component: Emoji,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Emoji'}}
/>
