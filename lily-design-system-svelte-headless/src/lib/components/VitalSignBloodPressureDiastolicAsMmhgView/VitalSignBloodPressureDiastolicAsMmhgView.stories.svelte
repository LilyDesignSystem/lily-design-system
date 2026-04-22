<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBloodPressureDiastolicAsMmhgView from './VitalSignBloodPressureDiastolicAsMmhgView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBloodPressureDiastolicAsMmhgView',
    component: VitalSignBloodPressureDiastolicAsMmhgView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Blood Pressure Diastolic As Mmhg View'}}
/>
