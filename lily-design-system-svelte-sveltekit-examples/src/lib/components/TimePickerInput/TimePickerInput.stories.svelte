<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TimePickerInput from './TimePickerInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/TimePickerInput',
    component: TimePickerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Time Picker Input'}}
/>
