<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DatetimeLocalInput from './DatetimeLocalInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/DatetimeLocalInput',
    component: DatetimeLocalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Datetime Local Input'}}
/>
