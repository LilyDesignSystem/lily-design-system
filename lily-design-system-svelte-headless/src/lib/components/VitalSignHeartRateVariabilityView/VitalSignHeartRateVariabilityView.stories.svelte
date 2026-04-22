<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignHeartRateVariabilityView from './VitalSignHeartRateVariabilityView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignHeartRateVariabilityView',
    component: VitalSignHeartRateVariabilityView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Heart Rate Variability View'}}
/>
