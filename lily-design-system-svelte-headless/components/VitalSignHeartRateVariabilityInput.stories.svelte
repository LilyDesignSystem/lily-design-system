<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignHeartRateVariabilityInput from './VitalSignHeartRateVariabilityInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignHeartRateVariabilityInput',
    component: VitalSignHeartRateVariabilityInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Heart Rate Variability Input'}}
/>
