<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EmailLink from './EmailLink.svelte';

  const { Story } = defineMeta({
    title: 'Examples/EmailLink',
    component: EmailLink,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Email Link'}}
/>
