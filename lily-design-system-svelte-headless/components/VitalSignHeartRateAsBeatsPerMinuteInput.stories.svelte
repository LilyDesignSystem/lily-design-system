<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignHeartRateAsBeatsPerMinuteInput from './VitalSignHeartRateAsBeatsPerMinuteInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignHeartRateAsBeatsPerMinuteInput',
    component: VitalSignHeartRateAsBeatsPerMinuteInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Heart Rate As Beats Per Minute Input'}}
/>
