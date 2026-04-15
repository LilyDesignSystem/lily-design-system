<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from './Input.svelte';

  const { Story } = defineMeta({
    title: 'Examples/Input',
    component: Input,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Input'}}
/>
