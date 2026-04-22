<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Textarea from './Textarea.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Textarea',
    component: Textarea,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Textarea'}}
/>
