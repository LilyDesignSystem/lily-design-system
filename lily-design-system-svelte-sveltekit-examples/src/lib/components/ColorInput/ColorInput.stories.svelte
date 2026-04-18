<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ColorInput from './ColorInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/ColorInput',
    component: ColorInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Color Input'}}
/>
