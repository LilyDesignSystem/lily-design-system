<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VitalSignWeightAsKgView from './VitalSignWeightAsKgView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VitalSignWeightAsKgView',
    component: VitalSignWeightAsKgView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Vital Sign Weight As Kg View'}}
/>
