<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBloodPressureSystolicAsMmhgInput from './VitalSignBloodPressureSystolicAsMmhgInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBloodPressureSystolicAsMmhgInput',
    component: VitalSignBloodPressureSystolicAsMmhgInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Blood Pressure Systolic As Mmhg Input'}}
/>
