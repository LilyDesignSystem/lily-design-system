<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignWaistCircumferenceAsCmView from './VitalSignWaistCircumferenceAsCmView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignWaistCircumferenceAsCmView',
    component: VitalSignWaistCircumferenceAsCmView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Waist Circumference As Cm View'}}
/>
