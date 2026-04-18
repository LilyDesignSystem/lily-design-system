<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignRespiratoryRateAsBreathsPerMinuteView from './VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignRespiratoryRateAsBreathsPerMinuteView',
    component: VitalSignRespiratoryRateAsBreathsPerMinuteView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Respiratory Rate As Breaths Per Minute View'}}
/>
