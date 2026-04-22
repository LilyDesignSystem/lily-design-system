<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignCholesterolAsLdlMmolPerLitreView from './VitalSignCholesterolAsLdlMmolPerLitreView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignCholesterolAsLdlMmolPerLitreView',
    component: VitalSignCholesterolAsLdlMmolPerLitreView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Cholesterol As Ldl Mmol Per Litre View'}}
/>
