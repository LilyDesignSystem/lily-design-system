<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DateTimeLocalInput from './DateTimeLocalInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/DateTimeLocalInput',
    component: DateTimeLocalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'DateTime Local Input'}}
/>
