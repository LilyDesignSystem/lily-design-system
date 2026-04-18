<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MeasurementInstanceInput from './MeasurementInstanceInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/MeasurementInstanceInput',
    component: MeasurementInstanceInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Measurement Instance Input'}}
/>
