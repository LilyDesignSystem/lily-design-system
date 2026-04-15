<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableCol from './CalendarTableCol.svelte';

  const { Story } = defineMeta({
    title: 'Examples/CalendarTableCol',
    component: CalendarTableCol,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
