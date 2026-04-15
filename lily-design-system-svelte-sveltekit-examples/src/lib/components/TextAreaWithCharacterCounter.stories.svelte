<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextAreaWithCharacterCounter from './TextAreaWithCharacterCounter.svelte';

  const { Story } = defineMeta({
    title: 'Examples/TextAreaWithCharacterCounter',
    component: TextAreaWithCharacterCounter,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Text Area With Character Counter'}}
/>
