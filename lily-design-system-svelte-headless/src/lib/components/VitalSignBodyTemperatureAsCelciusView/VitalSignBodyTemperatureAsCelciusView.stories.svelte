<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBodyTemperatureAsCelciusView from './VitalSignBodyTemperatureAsCelciusView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBodyTemperatureAsCelciusView',
    component: VitalSignBodyTemperatureAsCelciusView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Body Temperature As Celcius View'}}
/>
