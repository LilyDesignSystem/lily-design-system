<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignHeightAsCmView from './VitalSignHeightAsCmView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignHeightAsCmView',
    component: VitalSignHeightAsCmView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Height As Cm View'}}
/>
