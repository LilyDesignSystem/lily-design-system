<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBellyCircumferenceAsCmInput from './VitalSignBellyCircumferenceAsCmInput.svelte';

  const { Story } = defineMeta({
    title: 'Examples/VitalSignBellyCircumferenceAsCmInput',
    component: VitalSignBellyCircumferenceAsCmInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Belly Circumference As Cm Input'}}
/>
