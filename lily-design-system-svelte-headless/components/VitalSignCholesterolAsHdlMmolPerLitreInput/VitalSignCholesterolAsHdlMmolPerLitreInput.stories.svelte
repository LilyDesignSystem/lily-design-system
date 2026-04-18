<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignCholesterolAsHdlMmolPerLitreInput from './VitalSignCholesterolAsHdlMmolPerLitreInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignCholesterolAsHdlMmolPerLitreInput',
    component: VitalSignCholesterolAsHdlMmolPerLitreInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Cholesterol As Hdl Mmol Per Litre Input'}}
/>
