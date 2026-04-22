<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignHeartRateAsBeatsPerMinuteView from './VitalSignHeartRateAsBeatsPerMinuteView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignHeartRateAsBeatsPerMinuteView',
    component: VitalSignHeartRateAsBeatsPerMinuteView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Heart Rate As Beats Per Minute View'}}
/>
