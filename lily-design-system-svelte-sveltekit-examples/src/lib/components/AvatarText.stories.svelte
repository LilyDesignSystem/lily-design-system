<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AvatarText from './AvatarText.svelte';

  const { Story } = defineMeta({
    title: 'Examples/AvatarText',
    component: AvatarText,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>JD</span>
</Story>
