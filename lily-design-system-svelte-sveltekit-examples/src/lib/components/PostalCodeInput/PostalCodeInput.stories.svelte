<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PostalCodeInput from './PostalCodeInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/PostalCodeInput',
    component: PostalCodeInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Postal Code Input'}}
/>
