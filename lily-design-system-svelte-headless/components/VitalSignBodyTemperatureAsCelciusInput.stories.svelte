<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBodyTemperatureAsCelciusInput from './VitalSignBodyTemperatureAsCelciusInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBodyTemperatureAsCelciusInput',
    component: VitalSignBodyTemperatureAsCelciusInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Body Temperature As Celcius Input'}}
/>
