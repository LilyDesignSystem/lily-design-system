<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignBellyCircumferenceAsCmView from './VitalSignBellyCircumferenceAsCmView.svelte';

  const { Story } = defineMeta({
    title: 'Examples/VitalSignBellyCircumferenceAsCmView',
    component: VitalSignBellyCircumferenceAsCmView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Belly Circumference As Cm View'}}
/>
