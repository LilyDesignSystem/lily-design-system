<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignWaistCircumferenceAsCmInput from './VitalSignWaistCircumferenceAsCmInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignWaistCircumferenceAsCmInput',
    component: VitalSignWaistCircumferenceAsCmInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Waist Circumference As Cm Input'}}
/>
