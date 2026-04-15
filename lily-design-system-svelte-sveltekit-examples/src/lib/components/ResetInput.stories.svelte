<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ResetInput from './ResetInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/ResetInput',
    component: ResetInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
