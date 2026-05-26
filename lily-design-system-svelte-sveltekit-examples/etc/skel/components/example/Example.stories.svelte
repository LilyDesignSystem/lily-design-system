<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
 
  import MyComponent from './Example.svelte';
 
  const { Story } = defineMeta({
    component: MyComponent,
  });
</script>
 
<Story
  name="MyStory"
  parameters={{
    sveltekit_experimental: {
      state: {
        page: {
          data: {
            test: 'passed',
          },
        },
        navigating: {
          to: {
            route: { id: '/storybook' },
            params: {},
            url: new URL('http://localhost/storybook'),
          },
        },
        updated: {
          current: true,
        },
      },
    },
  }}
/>