<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PostalCodeView from './PostalCodeView.svelte';

  const { Story } = defineMeta({
    title: 'Examples/PostalCodeView',
    component: PostalCodeView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>View content</span>
</Story>
