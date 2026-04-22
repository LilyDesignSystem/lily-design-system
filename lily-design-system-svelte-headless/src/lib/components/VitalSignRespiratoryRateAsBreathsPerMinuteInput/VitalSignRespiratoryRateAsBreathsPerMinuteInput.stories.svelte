<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignRespiratoryRateAsBreathsPerMinuteInput from './VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignRespiratoryRateAsBreathsPerMinuteInput',
    component: VitalSignRespiratoryRateAsBreathsPerMinuteInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Respiratory Rate As Breaths Per Minute Input'}}
/>
