<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBloodPressureSystolicAsMmhgView from './VitalSignBloodPressureSystolicAsMmhgView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignBloodPressureSystolicAsMmhgView',
    component: VitalSignBloodPressureSystolicAsMmhgView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Blood Pressure Systolic As Mmhg View'}}
/>
