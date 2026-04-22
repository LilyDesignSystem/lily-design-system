<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignCholesterolAsLdlMmolPerLitreInput from './VitalSignCholesterolAsLdlMmolPerLitreInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignCholesterolAsLdlMmolPerLitreInput',
    component: VitalSignCholesterolAsLdlMmolPerLitreInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Cholesterol As Ldl Mmol Per Litre Input'}}
/>
