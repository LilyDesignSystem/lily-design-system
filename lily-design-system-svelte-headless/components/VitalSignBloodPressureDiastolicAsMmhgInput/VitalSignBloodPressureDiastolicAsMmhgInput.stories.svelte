<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBloodPressureDiastolicAsMmhgInput from './VitalSignBloodPressureDiastolicAsMmhgInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBloodPressureDiastolicAsMmhgInput',
    component: VitalSignBloodPressureDiastolicAsMmhgInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Blood Pressure Diastolic As Mmhg Input'}}
/>
