<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarRangePicker from './CalendarRangePicker.svelte';

  const { Story } = defineMeta({
    title: 'Examples/CalendarRangePicker',
    component: CalendarRangePicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Calendar Range Picker'}}
>
  <p>Picker content</p>
</Story>
