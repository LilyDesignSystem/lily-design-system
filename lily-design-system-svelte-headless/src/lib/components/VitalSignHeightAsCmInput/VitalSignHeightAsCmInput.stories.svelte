<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignHeightAsCmInput from './VitalSignHeightAsCmInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignHeightAsCmInput',
    component: VitalSignHeightAsCmInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Height As Cm Input'}}
/>
