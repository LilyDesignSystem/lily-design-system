<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignCholesterolAsHdlMmolPerLitreView from './VitalSignCholesterolAsHdlMmolPerLitreView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignCholesterolAsHdlMmolPerLitreView',
    component: VitalSignCholesterolAsHdlMmolPerLitreView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Cholesterol As Hdl Mmol Per Litre View'}}
/>
